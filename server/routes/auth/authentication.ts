import { Request, Response } from "express";

function checkAuth(req: Request, res: Response, next: Function) {
    if (req.session.user)
        next();
    else
        res.status(400).json({ err: 'You must be logged in to perform this action.' });
}

export default checkAuth;