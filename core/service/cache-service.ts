import { EventDispatcherService } from './event-dispatcher-service';
import { Model } from 'core/model/model';

export class CacheService {
    private static instance: CacheService;
    private storage: Map<any, Array<any>>;
    private types: Map<string, Object>;
    private dataObjectPrototypes: Map<Object, Object>;
    private currentState: Map<string, Map<string, Map<string, any>>>;
    private eventDispatcherService: EventDispatcherService;

    private constructor() {
        let self = this;
        this.storage = new Map<any, Array<any>>();
        this.types = new Map<string, Object>();
        this.dataObjectPrototypes = new Map<Object, Object>();
        this.eventDispatcherService = EventDispatcherService.getInstance();
        this.eventDispatcherService.addEventListener('stateChange', (state) => self.handleStateChange(state));
    }

    public static getInstance(storage: Map<any, Array<any>>) {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService(storage);
        }
        return CacheService.instance;
    }

    public registerTypeForKey(this: CacheService, type: Object, key: string) {
        let self = this,
            promise;
        if (!this.types.has(key) || this.types.get(key) !== type || !type.objectPrototype) {
            promise = this.ensureModelIsPopulated(type).then(function() {
                self.types.set(key, type);
            });
        } else {
            promise = Promise.resolve();
        }
        return promise;
    }

    public initializeCacheKey(this: CacheService, key: string): Array<Object> {
        if (!this.storage.has(key)) {
            let cacheArray = [];
            cacheArray._meta_data = {
                collectionModelType: this.types.get(key)
            };
            this.storage.set(key, cacheArray);
            this.registerTypeForKey(Model[key], key);
        }
        return this.storage.get(key);
    }

    public hasCacheKey(this: CacheService, key: any): boolean {
        return this.storage.has(key);
    }

    public getCacheEntry(this: CacheService, key: any): Array<any> {
        return this.storage.get(key);
    }

    public getDataObject(key: string) {
        let type = this.types.get(key),
            object = Object.create(this.getPrototypeForType(type));
        if (object) {
            object = object.constructor.call(object) || object;
        }
        return object;
    }

    private handleStateChange(state: Map<string, Map<string, Map<string, any>>>) {
        let self = this;
        if (this.currentState) {
            state.forEach(function(value, key) {
                if (!self.currentState.has(key) || self.currentState !== value) {
                    self.updateDataStoreForKey(key, value);
                }
            });
        } else {
            state.forEach(function(value, key) {
                self.updateDataStoreForKey(key, value);
            });
        }
        this.currentState = state;
    }

    private ensureModelIsPopulated(type: Object) {
        return (!type || type.objectPrototype || !type.typeName) ? Promise.resolve() : Model.populateObjectPrototypeForType(type);
    }

    private updateDataStoreForKey(this: CacheService, key: any, state: Map<string, Map<string, any>>) {
        let self = this,
            cache = self.initializeCacheKey(key),
            cachedKeys = [], object;
        for (var i = cache.length - 1; i >= 0; i--) {
            object = cache[i];
            if (state.has(object.id)) {
                this.mergeObjects(object, state.get(object.id).toJS());
                cachedKeys.push(object.id);
            } else {
                cache.splice(i, 1);
            }
        }
        state.forEach(function(value, id) {
            if (cachedKeys.indexOf(id) === -1) {
                cache.push(self.mergeObjects(self.getDataObject(key), value.toJS()));
            }
        });
        this.eventDispatcherService.dispatch('modelChange.' + key, cache);
        return cache;
    }

    private getPrototypeForType(type: Object) {
        var prototype = this.dataObjectPrototypes.get(type);
        if (type && !prototype) {
            prototype = Object.create(type.objectPrototype);
            this.dataObjectPrototypes.set(type, prototype);
        }
        return prototype;
    }

    private mergeObjects(target, source) {
        return Object.assign(target, source);
    }
}

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
