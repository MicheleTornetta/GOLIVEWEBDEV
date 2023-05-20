// External Dependencies

const router = require("express").Router();
const Users = require('./user');
const Post = require("../../models/posts");
const checkAuth = require("../auth/authentication");


router.post("/", checkAuth, async (req, res) => {
  try {
    // create a post
    console.log(req.session.user);

    await Post.create({
      user_id: req.session.user,
      title: req.body.title,
      article: req.body.article,
      date: new Date(),
    });

    res.json({"message": "Success"});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', checkAuth, async (req, res) => {
  const result = await Post.destroy({
    cascade: true,
    where: {
      id: req.params.id,
      user_id: req.session.user
    }
  });

  res.status(200).json({
    success: result !== 0
  });
})

router.put("/:id", checkAuth, async (req, res) => {
  try {
    // update a post
    const result = await Post.update({
      title: req.body.title,
      article: req.body.article,
      date: new Date(),
    }, {
      where: {
        id: req.params.id,
        user_id: req.session.user
      }
    });

    res.json({updatedRows: result[0]});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
