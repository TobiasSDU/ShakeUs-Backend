"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guest = void 0;
class Guest {
    constructor(id, name, notificationToken) {
        this._id = id;
        this.name = name;
        this.notificationToken = notificationToken;
    }
    get id() {
        return this._id;
    }
    get getName() {
        return this.name;
    }
    get getNotificationToken() {
        return this.notificationToken;
    }
    set setNotificationToken(notificationToken) {
        this.notificationToken = notificationToken;
    }
}
exports.Guest = Guest;
