import { SessionData, Store } from 'express-session';
import sql from './db/connection';

const DEFAULT_PRUNE_INTERVAL_IN_SECONDS = 60 * 15;
const ONE_DAY = 86400;

function currentTimestamp(): number {
    return Math.ceil(Date.now() / 1000);
}

export default class PGStore extends Store {
    private pruneSessionInterval: false | number;

    private ttl: number;

    private closed: boolean;

    private pruneTimer: NodeJS.Timeout;

    public constructor(options?: {
        captureRejections?: boolean | undefined,
        ttl?: number | undefined,
        pruneSessionInterval?: number | undefined,
    }) {
        super(options);

        this.ttl = options?.ttl;

        if (options?.pruneSessionInterval === undefined) {
            this.pruneSessionInterval = false;
        } else {
            this.pruneSessionInterval = (options.pruneSessionInterval || DEFAULT_PRUNE_INTERVAL_IN_SECONDS) * 1000;
        }
    }

    /**
     * Closes the session store
     *
     * Currently only stops the automatic pruning, if any, from continuing
     */
    public async close() {
        this.closed = true;

        this.clearPruneTimer();
    }

    private initPruneTimer() {
        if (this.pruneSessionInterval && !this.closed) {
            const delay = this.pruneSessionInterval;

            this.pruneTimer = setTimeout(
                () => { this.pruneSessions(); },
                delay
            );
            this.pruneTimer.unref();
        }
    }

    private clearPruneTimer() {
        if (this.pruneTimer) {
            clearTimeout(this.pruneTimer);
            this.pruneTimer = undefined;
        }
    }

    /**
     * Does garbage collection for expired session in the database
     */
    public async pruneSessions() {
        try {
            await sql`DELETE FROM "session" WHERE expire < to_timestamp(${currentTimestamp()})`;
        }
        catch (ex) {
            console.error('Failed to prune sessions');
            console.error(ex);
        }

        this.clearPruneTimer();
        this.initPruneTimer();
    }

    /**
     * Figure out when a session should expire
     */
    private getExpireTime(sess: SessionData): number {
        let expire;

        if (sess && sess.cookie && sess.cookie['expires']) {
            const expireDate = new Date(sess.cookie['expires']);
            expire = Math.ceil(expireDate.valueOf() / 1000);
        } else {
            const ttl = this.ttl || ONE_DAY;
            expire = Math.ceil(Date.now() / 1000 + ttl);
        }

        return expire;
    }

    /**
     * Attempt to fetch session by the given `sid`.
     */
    public async get(sid: string, fn: (err: any, session?: SessionData | null) => void) {
        this.initPruneTimer();

        try {
            const res = await sql<{ sess: string }[]>`SELECT sess FROM "session" WHERE sid = ${sid} AND expire >= to_timestamp(${currentTimestamp()})`;
            if (res.length === 1) {
                try {
                    fn(null, JSON.parse(res[0].sess) as SessionData);
                }
                catch (ex) {
                    this.destroy(sid, fn);
                }
            }
            else {
                fn(null);
            }
        }
        catch (ex) {
            fn(ex);
        }
    }

    /**
     * Commit the given `sess` object associated with the given `sid`.
     */
    public async set(sid: string, sess: SessionData, fn?: (err?: any) => void) {
        this.initPruneTimer();

        const sessJson = JSON.stringify(sess);

        const expireTime = this.getExpireTime(sess);

        try {
            await sql`INSERT INTO "session" (sess, expire, sid) SELECT ${sessJson}, to_timestamp(${expireTime}), ${sid} ON CONFLICT (sid) DO UPDATE SET sess=${sessJson}, expire=to_timestamp(${expireTime}) RETURNING sid`;
        }
        catch (ex) {
            if (fn) {
                fn(ex);
            }
        }
        // const query = 'INSERT INTO ' + this.quotedTable() + ' (sess, expire, sid) SELECT $1, to_timestamp($2), $3 ON CONFLICT (sid) DO UPDATE SET sess=$1, expire=to_timestamp($2) RETURNING sid';
    }

    /**
     * Destroy the session associated with the given `sid`.
     */
    public async destroy(sid: string, fn?: (err?: any) => void) {
        this.initPruneTimer();

        try {
            await sql`DELETE FROM "session" WHERE sid = ${sid}`;
        }
        catch (ex) {
            if (fn) {
                fn(ex);
            }
        }
    }

    /**
     * Touch the given session object associated with the given session ID.
     */
    public async touch(sid: string, sess: SessionData, fn?: () => void) {
        this.initPruneTimer();

        const expireTime = this.getExpireTime(sess);

        try {
            await sql<{ sid: string }[]>`UPDATE "session" SET expire = to_timestamp(${expireTime}) WHERE sid = ${sid}`;
        }
        catch (ex) {
            console.error(ex);
        }

        if (fn) {
            fn();
        }
    }
}
