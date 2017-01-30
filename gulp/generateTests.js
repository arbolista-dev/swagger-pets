import stt from 'swagger-test-templates';
import YAML   from 'js-yaml';
import fs     from 'fs';
import gulp from 'gulp';
import { argv } from 'yargs';
import Promise from 'bluebird';
/*
SUMMARY

Reads Swagger spec.
Generates tests for new routes.
Any existing tests that exist will be read and it will be ensured
that there is a test for every response for every operation for
every route. If there are missing tests, the task will fail.
*/

const readFile = Promise.promisify(require('fs').readFile);
const writeFile = Promise.promisify(require('fs').writeFile);
const VALID_OPERATIONS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

function testExists(operation, response, existingTest) {
  const re = new RegExp(`describe\\(('|")${operation}.+it\\(('|")should respond with ${response}`);
  return re.test(existingTest.replace(/\n+/g, ''));
}

gulp.task('generate:tests', async () => {
  const swaggerDoc = YAML.safeLoad(fs.readFileSync(`${__dirname}/../src/api/swagger/swagger.yml`));
  const config = {
    assertionFormat: 'expect',
    testModule: 'request',
    templatesPath: `${__dirname}/../test/templates`,
    // If pathnames passed, just generate tests for provided pathnames.
    // Otherwise, generate tests for all paths.
    pathName: argv.pathnames ? argv.pathnames.split('|') : [],
    maxLen: 80
  };

  // Generates an array of JavaScript test files following specified configuration
  const tests = stt.testGen(swaggerDoc, config);

  try {
    await Promise.all(Object.keys(swaggerDoc.paths).map(async (path) => {
      const filename = `${path.replace(/^\//, '').replace(/\//g, '-')}-test.js`;
      const testPath = `${__dirname}/../test/integration/${filename}`;
      const test = tests.find(test => test.name === filename);

      // Not generating tests for this path.
      if (test === undefined) return undefined;

      let existingTest;
      try {
        // Look for existing test.
        existingTest = await readFile(testPath, 'utf8');
      } catch (readErr) {
        if (readErr.code === 'ENOENT') {
          // If file does not exist, write it.
          return await writeFile(testPath, test.test);
        }
        throw readErr;
      }
      const missing = [];
      for (const operation of VALID_OPERATIONS) {
        if (swaggerDoc.paths[path][operation] === undefined) continue;
        // for all existing operation responses for this path,
        for (const response in swaggerDoc.paths[path][operation].responses) {
          // make sure a test exists.
          if (!testExists(operation, response, existingTest)) {
            missing.push({ operation, code: response });
          }
        }
      }
      // In case of any test missing,
      if (missing.length > 0) {
        if (process.env.PRINT_MISSING) {
          process.stdout.write(test.test);
        }
        // log missing tests.
        missing.forEach((res) => {
          console.warn(`No test in ${filename} for '${res.operation}' responding with '${res.code}'.`);
        });
        throw new Error('Please write missing tests.');
      }
    }));
  } catch (e) {
    console.error(e);
    // Fail process.
    process.exit(1);
  }
});
