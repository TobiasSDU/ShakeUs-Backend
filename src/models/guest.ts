export class Guest {
    private _id: string;
    private name: string;
    private notificationToken: string;

    constructor(id: string, name: string, notificationToken: string) {
        this._id = id;
        this.name = name;
        this.notificationToken = notificationToken;
    }

    public get id() {
        return this._id;
    }

    public get getName() {
        return this.name;
    }

    public get getNotificationToken() {
        return this.notificationToken;
    }

    public set setNotificationToken(notificationToken: string) {
        this.notificationToken = notificationToken;
    }
}
