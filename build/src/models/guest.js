"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guest = void 0;
class Guest {
    constructor(id, name) {
        this._id = id;
        this.name = name;
    }
    get id() {
        return this._id;
    }
    get getName() {
        return this.name;
    }
}
exports.Guest = Guest;
