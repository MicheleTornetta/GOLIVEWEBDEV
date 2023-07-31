import { SessionData, Store } from "express-session";
import sql from "./db/connection";

function currentTimestamp() {
    return Math.ceil(Date.now() / 1000);
}

class PGStore extends Store {
    /**
     * Gets the session from the store given a session ID and passes it to `callback`.
     *
     * The `session` argument should be a `Session` object if found, otherwise `null` or `undefined` if the session was not found and there was no error.
     * A special case is made when `error.code === 'ENOENT'` to act like `callback(null, null)`.
     */
    public async get(sid: string, callback: (err: any, session?: SessionData | null) => void) {
        const result = await sql<{ sess: string }[]>`SELECT sess FROM "session" WHERE sid = ${sid} AND expire >= to_timestamp(${currentTimestamp()})`;

        if (result.length === 1) {
            try {
                const data = JSON.parse(result[0].sess) as SessionData;
                callback(null, data);
            }
            catch (ex) {
                callback(ex, null);
            }
        }
        else {
            callback('No session found', null);
        }
    }

    /** Upsert a session in the store given a session ID and `SessionData` */
    public async set(sid: string, session: SessionData, callback?: (err?: any) => void) {
        const result = await sql<{ sess: string }[]>`SELECT sess FROM "session" WHERE sid = ${sid} AND expire >= to_timestamp(${currentTimestamp()})`;

        if (result.length === 1) {
            try {
                const data = JSON.parse(result[0].sess) as SessionData;
                callback(null, data);
            }
            catch (ex) {
                callback(ex, null);
            }
        }
        else {
            callback('No session found', null);
        }
    }

    /** Destroys the session with the given session ID. */
    public async destroy(sid: string, callback?: (err?: any) => void) {

    }

    /** Returns all sessions in the store */
    // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/38783, https://github.com/expressjs/session/pull/700#issuecomment-540855551
    public async all(callback: (err: any, obj?: SessionData[] | { [sid: string]: SessionData } | null) => void) {

    }

    /** Returns the amount of sessions in the store. */
    public async length(callback: (err: any, length?: number) => void) {

    }

    /** Delete all sessions from the store. */
    public async clear(callback?: (err?: any) => void) {

    }

    /** "Touches" a given session, resetting the idle timer. */
    public async touch(sid: string, session: SessionData, callback?: () => void) {

    }
}

export default PGStore;