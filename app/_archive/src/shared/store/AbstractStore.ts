import { IStoreArgument, IMatch, ILocation } from "../interface/IStoreArgument";

export default abstract class AbstractStore {
    private match: IMatch;

    private location: ILocation;

    private cookies: string;

    public get Match() {
        return this.match || null;
    }

    public get Location() {
        return this.location || null;
    }

    protected constructor(arg: IStoreArgument) {
        this.match = arg.match;
        this.location = arg.location;
    }

    protected reset(arg: IStoreArgument) {
        this.match = arg.match;
        this.location = arg.location;
    }

    abstract fetchData(): Promise<any>;

    public toJSON(): object {
        const { match, location, cookies } = this;
        return {
            match,
            location,
            cookies
        };
    }

    public fromJSON(json: any): AbstractStore {
        if (!json) {
            return this;
        }
        const { match, location, cookies } = json;
        if (typeof match !== "undefined") {
            this.match = match;
        }
        if (typeof location !== "undefined") {
            this.location = location;
        }
        if (typeof cookies !== "undefined") {
            this.cookies = cookies;
        }
        return this;
    }
}
