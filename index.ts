import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";

runServer();

function runServer() {
  dotenv.config({ path: "./vars.env" });

  const app: Express = express();

  const PORT_HTTP = process.env.PORT_HTTP;

  app.use(express.json());

  app.get("/*", (req, res) => {
    let path = req.url;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    path = path.replaceAll(".html", ".ejs");

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
