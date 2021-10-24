export class Activity {
    private _id: string;
    private title: string;
    private description: string;
    private startTime: number;

    constructor(
        id: string,
        title: string,
        description: string,
        startTime: number
    ) {
        this._id = id;
        this.title = title;
        this.description = description;
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

    public get getDescription() {
        return this.description;
    }

    public set setDescription(description: string) {
        this.description = description;
    }

    public get getStartTime() {
        return this.startTime;
    }

    public set setStartTime(startTime: number) {
        this.startTime = startTime;
    }
}
