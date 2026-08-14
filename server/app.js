import express from 'express';
import cors from 'cors';
import session from 'express-session';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './handlers/errorHandler.js';
import {
  ALLOWED_ORIGINS,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  SESSION_SECRET,
  UPLOAD_DIR,
} from './config/index.js';

const app = express();

// Session cookies are cross-origin here, so CORS must name the origin
// explicitly and allow credentials — a wildcard origin would be rejected.
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.use(
  session({
    name: SESSION_COOKIE,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // not readable from JavaScript
      // Requests reach us same-origin through the Vite proxy, so 'lax' is both
      // correct and the safer default. (A direct cross-origin setup would need
      // sameSite:'none' + secure:true, which requires HTTPS.)
      sameSite: 'lax',
      secure: false, // set true when served over HTTPS
      maxAge: SESSION_MAX_AGE,
    },
  })
);

// Serve uploaded media so the admin preview and the live site can load it.
app.use('/uploads', express.static(UPLOAD_DIR));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
