"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityPack = void 0;
const remove_array_element_1 = require("../util/remove_array_element");
class ActivityPack {
    constructor(id, title, description, activities) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.activities = activities;
    }
    get id() {
        return this._id;
    }
    set id(newId) {
        this._id = newId;
    }
    get getTitle() {
        return this.title;
    }
    set setTitle(title) {
        this.title = title;
    }
    get getDescription() {
        return this.description;
    }
    set setDescription(description) {
        this.description = description;
    }
    get getActivities() {
        return this.activities;
    }
    set setActivities(activities) {
        this.activities = activities;
    }
    addActivity(activityId) {
        this.activities.push(activityId);
    }
    removeActivity(activityId) {
        (0, remove_array_element_1.removeArrayElement)(this.activities, activityId);
    }
    removeAllActivities() {
        this.activities = [];
    }
}
exports.ActivityPack = ActivityPack;
