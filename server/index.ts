import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";
import { auth } from "express-openid-connect";
import session from "express-session";
import fs from "fs";
import https from "https";

import router from "./routes";
import setupSession from "./auth";
import getCompileScssFunction from "./scss-compiler";
import PGStore from "./session-store";

interface User {
  username: string;
  email: string;
  userId: number;
}

/**
 * Extend express session interfaces to support the user being stored.
 */
declare module "express-session" {
  interface SessionData {
    user: User | undefined;
  }
}

runServer();

async function runServer() {
  if (dotenv.config({ path: "./vars.env" }).error) {
    throw new Error("Missing vars.env!");
  }

  const app: Express = express();
  const IS_PROD = app.get("env") === "production";

  app.use(function (request, response, next) {
    if (IS_PROD && !request.secure) {
      response.redirect("https://" + request.headers.host + request.url);
    } else {
      next();
    }
  });

  const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  };

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(authConfig));

  const sess = {
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: {
      secure: IS_PROD,
    },
    resave: false,
    store: new PGStore(),
  };

  if (IS_PROD) {
    app.set("trust proxy", 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sess));

  const PORT_HTTP = process.env.PORT_HTTP;
  const PORT_HTTPS = process.env.PORT_HTTPS;

  app.use(express.json());

  app.use(setupSession);

  app.use("/", router);

  app.get("/*", (req: Request, res: Response, next: Function) => {
    let path = req.url;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    path = path.replace(".html", ".ejs");

    if (path.includes(".ejs")) {
      ejs.renderFile(
        "templated/" + path,
        {
          user: req.oidc.user,
        },
        function (err, compiled) {
          if (err) {
            next();
          } else {
            res.status(200).send(compiled);
          }
        }
      );
    } else {
      next();
    }
  });

  app.get("/*.css", getCompileScssFunction(IS_PROD));

  app.use(express.static("templated/"));

  app.get("/*", (req, res) => {
    ejs.renderFile(
      "templated/404.ejs",
      {
        user: req.oidc.user,
      },
      function (err, compiled) {
        if (err) {
          console.error(err);
          res.status(404).send("404");
        } else {
          res.status(404).send(compiled);
        }
      }
    );
  });

  http.createServer(app).listen(PORT_HTTP, () => {
    console.log(`Listening on http://localhost:${PORT_HTTP}`);
  });

  if (IS_PROD) {
    const credentials = {
      key: fs.readFileSync(process.env.HTTPS_KEY_LOCATION as string, "utf8"),
      cert: fs.readFileSync(process.env.HTTPS_CERT_LOCATION as string, "utf8"),
    };

    https.createServer(credentials, app).listen(PORT_HTTPS, () => {
      console.log(`Listening on https://localhost:${PORT_HTTPS}`);
    });
  }
}
