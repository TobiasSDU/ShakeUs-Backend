import { generateUUID } from '../util/uuid_generator';

export class Activity {
    private _id: string;
    private _title: string;
    private _description: string;
    private _startTime: number;

    constructor(title: string, description: string, startTime: number) {
        this._id = generateUUID();
        this._title = title;
        this._description = description;
        this._startTime = startTime;
    }

    public get id() {
        return this._id;
    }

    public get title() {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
    }

    public get description() {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get startTime() {
        return this._startTime;
    }

    public set startTime(startTime: number) {
        this._startTime = startTime;
    }
}
