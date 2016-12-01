"use strict";
var redux_1 = require("redux");
var DataStore = (function () {
    function DataStore() {
        this.store = redux_1.createStore(function () { });
    }
    return DataStore;
}());
exports.DataStore = DataStore;
