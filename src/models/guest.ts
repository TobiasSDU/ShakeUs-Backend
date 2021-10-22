export class Guest {
    private _id: string;
    private _name: string;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
    }

    public get id() {
        return this._id;
    }

    public get name() {
        return this._name;
    }
}
