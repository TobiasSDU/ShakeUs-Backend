export class Activity {
    private _id: string;
    private title: string;
    private _description: string;
    private startTime: number;

    constructor(
        id: string,
        title: string,
        description: string,
        startTime: number
    ) {
        this._id = id;
        this.title = title;
        this._description = description;
        this.startTime = startTime;
    }

    public get id() {
        return this._id;
    }

    public get getTitle() {
        return this.title;
    }

    public set setTitle(title: string) {
        this.title = title;
    }

    public get description() {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get getStartTime() {
        return this.startTime;
    }

    public set setStartTime(startTime: number) {
        this.startTime = startTime;
    }
}
