import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import helmet     from 'helmet';
import express from 'express';
import config from 'config';
import swaggerRouter from './api/swagger/router';
import nockInterceptor from './lib/nockInterceptor';

const app = express();

app.use(helmet());
app.use((req, res, next) => {
  req.requestStartTime = Date.now();
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());

app.use(morgan('combined', {
  stream: winston.stream
}));

app.use(cors({
  origin(requestOrigin, cb) {
    if (typeof requestOrigin !== 'undefined') {
      let error = true;
      for (const testOrigin of config.get('cors-origin')) {
        if (requestOrigin.indexOf(testOrigin) !== -1) {
          error = false;
          break;
        }
      }
      if (error) return cb('Bad Request', false);
    }
    return cb(null, true);
  }
}));

swaggerRouter(app, () => {
  const port = process.env.PORT || config.get('port');
  const env = config.get('env');
  app.listen(port, '0.0.0.0', () => {
    winston.logger.info('App listening on port %d in %s', port, env);
  });
});

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'debug') {
  nockInterceptor().then(getExperimentsDatafile);
}

export default app;
