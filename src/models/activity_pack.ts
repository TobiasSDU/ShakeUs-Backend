import { removeArrayElement } from '../util/remove_array_element';

export class ActivityPack {
    private _id: string;
    private title: string;
    private _description: string;
    private _activities: string[];

    constructor(
        id: string,
        title: string,
        description: string,
        activities: string[]
    ) {
        this._id = id;
        this.title = title;
        this._description = description;
        this._activities = activities;
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

    public get activities() {
        return this._activities;
    }

    public set activities(activities: string[]) {
        this._activities = activities;
    }

    public addActivity(activityId: string) {
        this._activities.push(activityId);
    }

    public removeActivity(activityId: string) {
        removeArrayElement(this._activities, activityId);
    }

    public removeAllActivities() {
        this._activities = [];
    }
}
