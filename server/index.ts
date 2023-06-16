import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";
import { auth, requiresAuth } from 'express-openid-connect';
import session from "express-session";

import router from './routes';
import sql from "./db/connection";

interface User {
  username: string,
  email: string,
  userId: number,
}

/**
 * Extend express session interfaces to support the userId being stored.
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

  app.use(async (req: Request, _, next) => {
    if (!req.session.user && req.oidc.isAuthenticated()) {
      interface SqlUser {
        user_id: number,
        username: string,
        email: string
      };

      let matchedUsers = (await sql<SqlUser[]>`SELECT user_id, username, email FROM Users WHERE email = ${req.oidc.user.email} LIMIT 1`);

      if (matchedUsers.length === 0) {
        await sql`INSERT INTO Users (username, email) VALUES (${req.oidc.user.nickname}, ${req.oidc.user.email})`;
        matchedUsers = (await sql<SqlUser[]>`SELECT user_id, username, email FROM Users WHERE email = ${req.oidc.user.email} LIMIT 1`);
      }

      if (matchedUsers.length === 0) {
        throw new Error('The database might have died - this should never be reached.');
      }

      const user = matchedUsers[0];

      req.session.user = {
        email: user.email,
        userId: user.user_id,
        username: user.username
      };
    }
    else if (!req.oidc.isAuthenticated()) {
      req.session.user = undefined;
    }

    next();
  });

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


//middleware

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

