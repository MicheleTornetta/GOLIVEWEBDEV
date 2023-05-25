class LoggedInUser {
    private _username: string;
    private _token: string;
    private _isAdmin: boolean;

    public constructor(username: string, token: string, isAdmin: boolean) {
        this._username = username;
        this._isAdmin = isAdmin;
        this._token = token;
    }

    public get username() { return this._username; }
    public get isAdmin() { return this._isAdmin; }
    public get token() { return this._token; }
}