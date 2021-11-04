"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Party = void 0;
const remove_array_element_1 = require("../util/remove_array_element");
class Party {
    constructor(id, hosts, primaryHost, guests, activityPackId) {
        this._id = id;
        this.hosts = hosts;
        this.primaryHost = primaryHost;
        this.guests = guests;
        this.activityPackId = activityPackId;
    }
    get id() {
        return this._id;
    }
    get getHosts() {
        return this.hosts;
    }
    set setHosts(hosts) {
        this.hosts = hosts;
    }
    addHost(hostId) {
        this.hosts.push(hostId);
    }
    removeHost(hostId) {
        (0, remove_array_element_1.removeArrayElement)(this.hosts, hostId);
    }
    get getPrimaryHost() {
        return this.primaryHost;
    }
    set setPrimaryHost(primaryHost) {
        this.primaryHost = primaryHost;
    }
    get getGuests() {
        return this.guests;
    }
    set setGuests(guests) {
        this.guests = guests;
    }
    addGuest(guestId) {
        this.guests.push(guestId);
    }
    addGuests(guests) {
        guests.forEach((guest) => {
            this.addGuest(guest);
        });
    }
    removeGuest(guestId) {
        (0, remove_array_element_1.removeArrayElement)(this.guests, guestId);
    }
    removeAllGuests() {
        this.guests = [];
    }
    get getActivityPackId() {
        return this.activityPackId;
    }
    set setActivityPackId(activityPackId) {
        this.activityPackId = activityPackId;
    }
}
exports.Party = Party;
