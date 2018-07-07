import { observable, action, computed } from "mobx";
import { IStoreArgument } from "../interface/IStoreArgument";
import AbstractStore from "./AbstractStore";
import { IS_NODE } from "../../../config/env";

declare var window;

/**
 * Global store
 */
export default class GlobalStore extends AbstractStore {
    public static API_BASE: string = "";

    private static instance: GlobalStore;

    public static get Instance() {
        return GlobalStore.getInstance({} as any);
    }

    /**
     * @param arg
     */
    public static getInstance(arg: IStoreArgument = {} as IStoreArgument) {
        if (!GlobalStore.instance) {
            GlobalStore.instance = new GlobalStore(arg);
        }
        return GlobalStore.instance;
    }

    private constructor(arg: IStoreArgument) {
        super(arg);

        if (!IS_NODE) {
            // SSR data saved in InitialState and used by browser
            const initialState = window.__INITIAL_STATE__ || {};
            if (initialState && initialState.globalStore) {
                this.fromJSON(initialState.globalStore);
            } else {
                this.fetchData();
            }
        }
    }

    public static rebuild(arg: IStoreArgument = {} as IStoreArgument) {
        if (GlobalStore.instance) {
            GlobalStore.instance = null as any;
        }
        GlobalStore.instance = GlobalStore.getInstance(arg);
    }

    public static destroy() {
        GlobalStore.instance = null as any;
    }

    @observable loading: boolean = false;

    @observable exampleData;

    @action
    fetchExampleData = () => {
        return Promise.resolve("example").then(result => {
            this.exampleData = result;
        });
    };

    @computed
    get URL() {
        if (IS_NODE) {
            return this.Location.url;
        }
        return `${location.protocol}//${location.host}${location.pathname}`;
    }

    /**
     * fetch data before ssr
     */
    fetchData() {
        const promises: Promise<any>[] = [];
        promises.push(this.fetchExampleData());
        return Promise.all(promises);
    }

    public toJSON() {
        const obj = super.toJSON();
        return Object.assign(obj, {
            exampleData: "example"
        });
    }

    public fromJSON(json: any) {
        super.fromJSON(json);
        if (!json) {
            return this;
        }
        const { exampleData } = json;
        if (typeof exampleData !== "undefined") {
            this.exampleData = exampleData;
        }
        return this;
    }
}
