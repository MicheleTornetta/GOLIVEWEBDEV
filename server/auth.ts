import { NextFunction, Request, Response } from "express";
import sql from "./db/connection";

/**
 * Sets up the session to reflect auth0's & the database's information 
 */
async function setupSession(req: Request, _: Response, next: NextFunction) {
    // If the user is logged in with auth0 but does not have a session,
    // setup their session variables.
    if (!req.session.user && req.oidc.isAuthenticated()) {
        interface SqlUser {
            user_id: number,
            username: string,
            email: string
        };

        // Query the database to find the user's id, username, and email
        let matchedUsers = (await sql<SqlUser[]>`SELECT user_id, username, email FROM Users WHERE email = ${req.oidc.user.email} LIMIT 1`);

        if (matchedUsers.length === 0) {
            // If no user was found, this is their first time logging in.
            // In that case, they have not been added to the database yet,
            // so add them to the database with the values provided by auth0.
            await sql`INSERT INTO Users (username, email) VALUES (${req.oidc.user.nickname}, ${req.oidc.user.email})`;

            // Query the user id, username, and email now that it's been added to the database
            matchedUsers = (await sql<SqlUser[]>`SELECT user_id, username, email FROM Users WHERE email = ${req.oidc.user.email} LIMIT 1`);
        }

        if (matchedUsers.length === 0) {
            throw new Error('The above query should always return 1 item. If this ever fails, something went horribly wrong.');
        }

        const user = matchedUsers[0];

        req.session.user = {
            email: user.email,
            userId: user.user_id,
            username: user.username
        };
    }
    else if (!req.oidc.isAuthenticated()) {
        req.session.user = undefined;
    }

    next();
}

export default setupSession;