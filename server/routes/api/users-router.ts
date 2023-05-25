// External Dependencies

import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sql from '../../db/connection';
import rateLimit from 'express-rate-limit'

// Global Config

const userRouter = express.Router();
userRouter.use(express.json());

const ONE_HOUR = 60 * 60 * 1000;
const MAX_REGISTRATIONS_PER_TIME_FRAME = 2;

const registerLimiter = rateLimit({
    windowMs: ONE_HOUR,
    max: MAX_REGISTRATIONS_PER_TIME_FRAME,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,
    message: {
        error: 'Too many account registrations.'
    }
});

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const MAX_LOGIN_REQUESTS_PER_TIME_FRAME = 15;

const loginLimiter = rateLimit({
    windowMs: FIFTEEN_MINUTES,
    max: MAX_LOGIN_REQUESTS_PER_TIME_FRAME,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Too many attempts, please try again later.'
    },
    skipSuccessfulRequests: true,
});

userRouter.post('/register', registerLimiter, async (req: Request<any, any, {
    username: string | undefined,
    password: string | undefined,
    email: string | undefined
}>, res: Response<{ error?: string, username?: string }>) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        res.status(403).send({
            error: 'Missing username, password, or email.'
        });
        return;
    }

    const alreadyExists = await sql<{ alreadyExists: number }[]>`SELECT 1 AS already_exists FROM Users WHERE username = ${username} OR email = ${email}`;

    if (alreadyExists.length) {
        res.status(403).send({
            error: 'A user with that username or email already exists.',
        });
        return;
    }

    if (password.length < 10) {
        res.status(403).send({
            error: 'Password must be at least 10 characters.'
        });
        return;
    }

    const splitEmail = email.split('@');

    if (splitEmail.length !== 2 || !splitEmail[1].includes('.')) {
        res.status(403).send({
            error: 'Invalid email provided.'
        });
        return;
    }

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, (err, encrypted) => {
        if (err) {
            res.status(500).send({
                error: 'Something went wrong.'
            });
            throw err;
        }

        sql`
            INSERT INTO Users (username, password, email)
                VALUES (${username}, ${encrypted}, ${email});
        `.execute();

        res.send({
            username
        });
    });
});

userRouter.post('/login', loginLimiter, async (req: Request<any, any, {
    username: string | undefined,
    password: string | undefined
}>, res: Response<{ error?: string, username?: string }>) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send({
            error: 'Invalid username or password.'
        });
        return;
    }

    const user = await sql<{ password: string }[]>`
        SELECT password FROM Users WHERE Username = ${username}
    `;

    if (user.length !== 1) {
        res.status(400).send({
            error: 'Invalid username or password.'
        });
        return;
    }

    const encryptedPassword = user[0].password;

    bcrypt.compare(password, encryptedPassword, (err, same) => {
        if (err) {
            res.status(500).send({
                error: 'Something went wrong.'
            });
            throw err;
        }

        if (same) {
            res.send({
                username
            });
        }
        else {
            res.status(400).send({
                error: 'Invalid username or password.'
            });
        }
    });
});

export default userRouter;