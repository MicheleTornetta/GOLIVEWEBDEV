import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";
import { auth } from 'express-openid-connect';
import session from "express-session";

import router from './routes';
import setupSession from "./auth";

interface User {
  username: string,
  email: string,
  userId: number,
}

/**
 * Extend express session interfaces to support the user being stored.
 */
declare module 'express-session' {
  interface SessionData {
    user: User | undefined;
  }
}

runServer();

async function runServer() {
  if (dotenv.config({ path: "./vars.env" }).error) {
    throw new Error('Missing vars.env!');
  }

  const app: Express = express();

  const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:8080',
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
  };

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(authConfig));

  const sess = {
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false
    }
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }

  app.use(session(sess));

  const PORT_HTTP = process.env.PORT_HTTP;

  app.use(express.json());

  app.use(setupSession);

  app.use('/', router);

  app.get("/*", (req: Request, res: Response) => {
    let path = req.url;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    path = path.replace(".html", ".ejs");

    if (path.includes(".ejs")) {
      ejs.renderFile("templated/" + path, {
        user: req.oidc.user
      }, function (err, compiled) {
        if (err) {
          res.status(404).send("404 not found ;(");
        } else {
          res.status(200).send(compiled);
        }
      });
    } else {
      res
        .status(200)
        .sendFile(
          __dirname.substring(0, __dirname.length - 5) + "/templated/" + path
        );
    }
  });

  http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`Listening on http://localhost:${PORT_HTTP}`);
  });
}
