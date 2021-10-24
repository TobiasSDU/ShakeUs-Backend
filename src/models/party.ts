import { removeArrayElement } from '../util/remove_array_element';

export class Party {
    private _id: string;
    private hosts: string[];
    private primaryHost: string;
    private guests: string[];
    private activityPackId: string;

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
        this.guests = guests;
        this.activityPackId = activityPackId;
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

    public get getGuests() {
        return this.guests;
    }

    public set setGuests(guests: string[]) {
        this.guests = guests;
    }

    public addGuest(guestId: string) {
        this.guests.push(guestId);
    }

    public addGuests(guests: string[]) {
        guests.forEach((guest: string) => {
            this.addGuest(guest);
        });
    }

    public removeGuest(guestId: string) {
        removeArrayElement(this.guests, guestId);
    }

    public removeAllGuests() {
        this.guests = [];
    }

    public get getActivityPackId() {
        return this.activityPackId;
    }

    public set setActivityPackId(activityPackId: string) {
        this.activityPackId = activityPackId;
    }
}
