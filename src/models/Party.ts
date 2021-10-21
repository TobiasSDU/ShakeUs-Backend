import { generateUUID } from '../../util/uuid_generator';
import { removeArrayElement } from '../../util/remove_array_element';
import { ActivityPack } from './ActivityPack';

export class Party {
    private _id: string;
    private _hosts: string[];
    private _primaryHost: string;
    private _guests: string[];
    private _activityPack: ActivityPack;

    constructor(hostId: string, activityPack: ActivityPack) {
        this._id = generateUUID();
        this._hosts = [hostId];
        this._primaryHost = hostId;
        this._guests = [];
        this._activityPack = activityPack;
    }

    public get id() {
        return this._id;
    }

    public get hosts() {
        return this._hosts;
    }

    public set hosts(hosts: string[]) {
        this._hosts = hosts;
    }

    public addHost(hostId: string) {
        this._hosts.push(hostId);
    }

    public removeHost(hostId: string) {
        removeArrayElement(this._hosts, hostId);
    }

    public get primaryHost() {
        return this._primaryHost;
    }

    public set primaryHost(primaryHost: string) {
        this._primaryHost = primaryHost;
    }

    public get guests() {
        return this._guests;
    }

    public set guests(guests: string[]) {
        this._guests = guests;
    }

    public addGuest(guestId: string) {
        this._guests.push(guestId);
    }

    public addGuests(guests: string[]) {
        guests.forEach((guest: string) => {
            this.addGuest(guest);
        });
    }

    public removeGuest(guestId: string) {
        removeArrayElement(this._guests, guestId);
    }

    public removeAllGuests() {
        this._guests = [];
    }

    public get activityPack() {
        return this._activityPack;
    }

    public set activityPack(activityPack: ActivityPack) {
        this._activityPack = activityPack;
    }
}
