const router = require('express').Router();

const userRoutes = require('./user-routes');
const postRoutes = require('./posts-routes');
const commentsRoutes = require('./comments-routes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentsRoutes);

module.exports = router;