import nock from 'nock';
import path from 'path';
import fse from 'fs-extra';

export default async function() {
  return new Promise((fnSuccess, _fnFail) => {
    if (process.env.NOCK_RECORD) {
      nock.recorder.rec({
        use_separator: false,
        output_objects: true,
        logging: (content) => {
          process.stdout.write(typeof (content) === 'object' ? JSON.stringify(content, null, 2) : content);
        }
      });
      fnSuccess();

    } else if (process.env.NOCK_PLAYBACK) {
      const fixturePath = path.join(__dirname, '../..', 'test/nock');
      nock.disableNetConnect();
      fse.walk(fixturePath)
        .on('data', (item) => {
          if (item.stats.isFile()) {
            /* eslint-disable import/no-dynamic-require, global-require */
            const defs = require(item.path);
            /* eslint-enable import/no-dynamic-require, global-require */
            const scopes = nock.define(defs);
            scopes.forEach(scope => scope.persist());
          }
        })
        .on('end', () => {
          fnSuccess();
        });
    }
  });
}

