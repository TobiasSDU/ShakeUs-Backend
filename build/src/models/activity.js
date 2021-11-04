"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
class Activity {
    constructor(id, title, description, startTime) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
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
    get getStartTime() {
        return this.startTime;
    }
    set setStartTime(startTime) {
        this.startTime = startTime;
    }
}
exports.Activity = Activity;
