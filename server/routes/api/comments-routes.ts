// External Dependencies

const router = require("express").Router();
const Comments = require("../../models/comments");
const checkAuth = require("../auth/authentication");

router.post("/:id", checkAuth, async (req, res) => {
  try {
    // create a comment
    await Comments.create({
      title: req.body.title,
      comment: req.body.comment,
      post_id: req.params.id,
      user_id: req.session.user,
      date: new Date(),
    });

    res.json({ message: "Success!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
