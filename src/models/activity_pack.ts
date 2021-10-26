import { removeArrayElement } from '../util/remove_array_element';

export class ActivityPack {
    private _id: string;
    private title: string;
    private description: string;
    private activities: string[];

    constructor(
        id: string,
        title: string,
        description: string,
        activities: string[]
    ) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.activities = activities;
    }

    public get id() {
        return this._id;
    }

    public set id(newId: string) {
        this._id = newId;
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

    public get getActivities() {
        return this.activities;
    }

    public set setActivities(activities: string[]) {
        this.activities = activities;
    }

    public addActivity(activityId: string) {
        this.activities.push(activityId);
    }

    public removeActivity(activityId: string) {
        removeArrayElement(this.activities, activityId);
    }

    public removeAllActivities() {
        this.activities = [];
    }
}
