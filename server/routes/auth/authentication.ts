import { Request, Response } from "express";

/**
 * Checks if a user is logged in. If they are logged in, they are allowed
 * to pass. Otherwise, they are given a 400 error. 
 * 
 * This does **not** check if they are an admin. Use `checkIsAdmin` for that. 
 */
function checkLoggedIn(req: Request, res: Response, next: Function) {
    if (req.session.user)
        next();
    else
        res.status(400).json({ err: 'You must be logged in to perform this action.' });
}

/**
 * Checks if a user is an admin. If they are an admin, they are allowed
 * to pass. Otherwise, they are given a 400 error. 
 */
function checkIsAdmin(req: Request, res: Response, next: Function) {
    if (req.session.user.isAdmin)
        next();
    else
        res.status(400).json({ err: 'You must be logged in to perform this action.' });
}

export default checkLoggedIn;