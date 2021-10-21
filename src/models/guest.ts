import { generateUUID } from '../../util/uuid_generator';

export class Guest {
    private _id: string;
    private _name: string;

    constructor(name: string) {
        this._id = generateUUID();
        this._name = name;
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }
}