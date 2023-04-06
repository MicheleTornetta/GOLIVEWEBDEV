import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import ejs from "ejs";
// import mongoose from 'mongoose';
import { connectToDatabase } from "./server/dbClient/database.client"
import { userRouter } from "./server/routes/user.router";

runServer();

function runServer() {
  dotenv.config({ path: "./vars.env" });

  const app: Express = express();

  const PORT_HTTP = process.env.PORT_HTTP;

  app.use(express.json());

  app.get("/*", (req: Request, res: Response) => {
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


//middleware

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

// connection to mongodb

connectToDatabase()
    .then(() => {
        app.use("/user", userRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

//https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial

// mongoose.connect('mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@glwd.ije945m.mongodb.net/?retryWrites=true&w=majority', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   });


