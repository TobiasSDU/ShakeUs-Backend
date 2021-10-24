export class Guest {
    private _id: string;
    private name: string;

    constructor(id: string, name: string) {
        this._id = id;
        this.name = name;
    }

    public get id() {
        return this._id;
    }

    public get getName() {
        return this.name;
    }
}
