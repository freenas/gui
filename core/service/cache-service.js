"use strict";
var CacheService = (function () {
    function CacheService(dataStore) {
        this.dataStore = dataStore || new Map();
    }
    CacheService.getInstance = function (dataStore) {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService(dataStore);
        }
        return CacheService.instance;
    };
    CacheService.prototype.addToCache = function (key, values) {
        var cache;
        if (!this.dataStore.has(key)) {
            this.dataStore.set(key, values);
            cache = values;
        }
        else {
            cache = this.dataStore.get(key);
            for (var i = 0; i < values.length; i++) {
                cache.push(values[i]);
            }
        }
        return cache;
    };
    CacheService.prototype.clearCacheEntry = function (key) {
        var isExistingEntry = this.dataStore.has(key);
        if (isExistingEntry) {
            this.dataStore.get(key).splice(0);
        }
        return isExistingEntry;
    };
    CacheService.prototype.getCacheEntry = function (key) {
        return this.dataStore.get(key);
    };
    return CacheService;
}());
exports.CacheService = CacheService;
