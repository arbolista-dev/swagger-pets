import YAML   from 'js-yaml';
import fs     from 'fs';
import swaggerTools from 'swagger-tools';
import config from 'config';


export default async function(app, fnDone) {

  const swaggerDoc = YAML.safeLoad(fs.readFileSync(`${__dirname}/swagger.yml`));

  swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {

    app.use(middleware.swaggerUi());
    app.use(middleware.swaggerMetadata());

      // Schema Validation
    app.use((req, res, next) => {
      const validation = middleware.swaggerValidator();
      try {
        validation(req, {}, (swaggerParamDef) => {
          if (data) {
            // Return Swagger validation error, eg `${swaggerParamDef.paramName} is a required field`
          } else {
            return next();
          }
        });
      } catch (e) {
        // respond with server error.
      }
    });

    app.use(middleware.swaggerRouter({
      controllers: `${__dirname}/../controllers`
    }));

    fnDone();

  });

}
