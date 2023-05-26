// External Dependencies

import { Request, Response } from "express";

import express from "express";
import { requiresAuth } from "express-openid-connect";

const router = express.Router();

router.post("/", requiresAuth, async (req: Request, res: Response) => {
  // try {
  //   // create a post
  //   console.log(req.session.user);

  //   await Post.create({
  //     user_id: req.session.user,
  //     title: req.body.title,
  //     article: req.body.article,
  //     date: new Date(),
  //   });

  //   res.json({ "message": "Success" });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json(err);
  // }
});

router.delete('/:id', requiresAuth, async (req: Request, res: Response) => {
  // const result = await Post.destroy({
  //   cascade: true,
  //   where: {
  //     id: req.params.id,
  //     user_id: req.session.user
  //   }
  // });

  // res.status(200).json({
  //   success: result !== 0
  // });
})

router.put("/:id", requiresAuth, async (req: Request, res: Response) => {
  // try {
  //   // update a post
  //   const result = await Post.update({
  //     title: req.body.title,
  //     article: req.body.article,
  //     date: new Date(),
  //   }, {
  //     where: {
  //       id: req.params.id,
  //       user_id: req.session.user
  //     }
  //   });

  //   res.json({ updatedRows: result[0] });
  // } catch (err) {
  //   res.status(500).json(err);
  // }
});

export default router;
