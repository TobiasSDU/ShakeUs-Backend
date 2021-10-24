import { removeArrayElement } from '../util/remove_array_element';

export class Party {
    private _id: string;
    private hosts: string[];
    private primaryHost: string;
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
        this.hosts = hosts;
        this.primaryHost = primaryHost;
        this._guests = guests;
        this._activityPackId = activityPackId;
    }

    public get id() {
        return this._id;
    }

    public get getHosts() {
        return this.hosts;
    }

    public set setHosts(hosts: string[]) {
        this.hosts = hosts;
    }

    public addHost(hostId: string) {
        this.hosts.push(hostId);
    }

    public removeHost(hostId: string) {
        removeArrayElement(this.hosts, hostId);
    }

    public get getPrimaryHost() {
        return this.primaryHost;
    }

    public set setPrimaryHost(primaryHost: string) {
        this.primaryHost = primaryHost;
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
