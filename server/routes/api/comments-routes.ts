// External Dependencies

import express from "express";
import Comments from "../../models/comments";
import checkLoggedIn from "../auth/authentication";

const router = express.Router();

router.post("/:id", checkLoggedIn, async (req, res) => {
  // try {
  //   // create a comment
  //   await Comments.create({
  //     title: req.body.title,
  //     comment: req.body.comment,
  //     post_id: req.params.id,
  //     user_id: req.session.user,
  //     date: new Date(),
  //   });

  //   res.json({ message: "Success!" });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

export default router;
