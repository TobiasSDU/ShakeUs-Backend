import { generateUUID } from '../../util/uuid_generator';
import { removeArrayElement } from '../../util/remove_array_element';
import { IActivityPack } from './IActivityPack';

export class Party {
    private _id: string;
    private _hosts: string[];
    private _primaryHost: string;
    private _activityPack: IActivityPack;

    constructor(hostId: string, activityPack: IActivityPack) {
        this._id = generateUUID();
        this._hosts = [hostId];
        this._primaryHost = hostId;
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

    public get activityPack() {
        return this._activityPack;
    }

    public set activityPack(activityPack: IActivityPack) {
        this._activityPack = activityPack;
    }
}
