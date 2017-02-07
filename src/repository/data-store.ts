import { createStore } from 'redux';

export class DataStore {
    private store;

    public constructor() {
        this.store = createStore(function() {});
    }
}
