import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";

import { userRouter } from "./routes/api/users-router";

import sql from './db/connection';

runServer();

async function runServer() {  
  const result = await sql`
    SELECT * FROM Users;
  `;

  console.log('About to print!');
  console.log(result);

  dotenv.config({ path: "./vars.env" });

  const app: Express = express();

  const PORT_HTTP = process.env.PORT_HTTP;

  app.use(express.json());

  app.get("/*", (req: Request, res: Response) => {
    let path = req.url;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    path = path.replace(".html", ".ejs");

    if (path.includes(".ejs")) {
      ejs.renderFile("templated/" + path, function (err, compiled) {
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
    console.log(`Listening on ${PORT_HTTP}!`);
  });
}


//middleware

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

