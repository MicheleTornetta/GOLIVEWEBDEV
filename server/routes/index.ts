import express from 'express';
import apiRoutes from './api';
import userRouter from './api/users-router';

const router = express.Router();

router.use('/user', userRouter);

export default router;