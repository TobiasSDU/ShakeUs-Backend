import { removeArrayElement } from '../../util/remove_array_element';

export class Party {
    private _id: string;
    private _hosts: string[];
    private _primaryHost: string;
    private _guests: string[];
    private _activityPackId: string;

    constructor(
        id: string,
        hosts: string[],
        primaryHost: string,
        guests: string[],
        activityPackId: string
    ) {
        this._id = id;
        this._hosts = hosts;
        this._primaryHost = primaryHost;
        this._guests = guests;
        this._activityPackId = activityPackId;
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

    public get activityPackId() {
        return this._activityPackId;
    }

    public set activityPackId(activityPackId: string) {
        this._activityPackId = activityPackId;
    }
}
