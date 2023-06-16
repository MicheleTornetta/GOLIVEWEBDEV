// External Dependencies

import express, { Request, Response } from "express";
import sql from "../../db/connection";
import rateLimit from "express-rate-limit";

const router = express.Router();

interface Comment {
    message: string,
    postId: number,
}

const ONE_HOUR = 60 * 60 * 1000;

const commentRateLimiter = rateLimit({
    windowMs: ONE_HOUR,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/create', commentRateLimiter, async (req: Request<any, any, Comment>, res: Response) => {
    if (!req.session.user) {
        res.status(400).send({
            error: 'Must be logged in to do this!'
        });
        return;
    }

    const { message, postId } = req.body;

    if (!message.trim()) {
        res.status(400).send({
            error: 'Cannot create comment with no text.'
        });
        return;
    }

    if (message.length > 2000) {
        res.status(400).send({
            error: 'Message cannot be more than 2000 characters.'
        });
        return;
    }

    if (!postId) {
        res.status(400).send({
            error: 'Invalid post id!'
        });
        return;
    }

    const userId = req.session.user.userId;

    try {
        await sql`INSERT INTO Comments (comment, created_date, user_id, post_id) VALUES (
            ${message}, ${new Date()}, ${userId}, ${postId}
        )`;

        res.send({
            success: 'Comment posted successfully'
        });
    }
    catch (ex) {
        console.error(ex);
        res.status(500).send({
            error: 'Something went wrong.'
        });
    }
});

export default router;
