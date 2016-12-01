"use strict";
var event_dispatcher_service_1 = require("./event-dispatcher-service");
var model_1 = require("core/model/model");
var CacheService = (function () {
    function CacheService() {
        var self = this;
        this.storage = new Map();
        this.types = new Map();
        this.dataObjectPrototypes = new Map();
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
        this.eventDispatcherService.addEventListener('stateChange', function (state) { return self.handleStateChange(state); });
    }
    CacheService.getInstance = function (storage) {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService(storage);
        }
        return CacheService.instance;
    };
    CacheService.prototype.registerTypeForKey = function (type, key) {
        var self = this, promise;
        if (!this.types.has(key) || this.types.get(key) !== type || !type.objectPrototype) {
            promise = this.ensureModelIsPopulated(type).then(function () {
                self.types.set(key, type);
            });
        }
        else {
            promise = Promise.resolve();
        }
        return promise;
    };
    CacheService.prototype.initializeCacheKey = function (key) {
        if (!this.storage.has(key)) {
            var cacheArray = [];
            cacheArray._meta_data = {
                collectionModelType: this.types.get(key)
            };
            this.storage.set(key, cacheArray);
            this.registerTypeForKey(model_1.Model[key], key);
        }
        return this.storage.get(key);
    };
    CacheService.prototype.hasCacheKey = function (key) {
        return this.storage.has(key);
    };
    CacheService.prototype.getCacheEntry = function (key) {
        return this.storage.get(key);
    };
    CacheService.prototype.getDataObject = function (key) {
        var type = this.types.get(key), object = Object.create(this.getPrototypeForType(type));
        if (object) {
            object = object.constructor.call(object) || object;
        }
        return object;
    };
    CacheService.prototype.handleStateChange = function (state) {
        var self = this;
        if (this.currentState) {
            state.forEach(function (value, key) {
                if (!self.currentState.has(key) || self.currentState !== value) {
                    self.updateDataStoreForKey(key, value);
                }
            });
        }
        else {
            state.forEach(function (value, key) {
                self.updateDataStoreForKey(key, value);
            });
        }
        this.currentState = state;
    };
    CacheService.prototype.ensureModelIsPopulated = function (type) {
        return (!type || type.objectPrototype || !type.typeName) ? Promise.resolve() : model_1.Model.populateObjectPrototypeForType(type);
    };
    CacheService.prototype.updateDataStoreForKey = function (key, state) {
        var self = this, cache = self.initializeCacheKey(key), cachedKeys = [], object;
        for (var i = cache.length - 1; i >= 0; i--) {
            object = cache[i];
            if (state.has(object.id)) {
                this.mergeObjects(object, state.get(object.id).toJS());
                cachedKeys.push(object.id);
            }
            else {
                cache.splice(i, 1);
            }
        }
        state.forEach(function (value, id) {
            if (cachedKeys.indexOf(id) === -1) {
                cache.push(self.mergeObjects(self.getDataObject(key), value.toJS()));
            }
        });
        this.eventDispatcherService.dispatch('modelChange.' + key, cache);
        return cache;
    };
    CacheService.prototype.getPrototypeForType = function (type) {
        var prototype = this.dataObjectPrototypes.get(type);
        if (type && !prototype) {
            prototype = Object.create(type.objectPrototype);
            this.dataObjectPrototypes.set(type, prototype);
        }
        return prototype;
    };
    CacheService.prototype.mergeObjects = function (target, source) {
        return Object.assign(target, source);
    };
    return CacheService;
}());
exports.CacheService = CacheService;
if (typeof Object.assign !== 'function') {
    Object.assign = function (target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}
