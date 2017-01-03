import { EventDispatcherService } from './event-dispatcher-service';
import { Model } from 'core/model/model';
import _ = require("lodash");
import Promise = require("bluebird");
import immutable = require("immutable");

export class CacheService {
    private static instance: CacheService;
    private storage: Map<any, Array<any>>;
    private types: Map<string, Object>;
    private dataObjectPrototypes: Map<Object, Object>;
    private currentState: immutable.Map<string, immutable.Map<string, immutable.Map<string, any>>>;
    private eventDispatcherService: EventDispatcherService;

    private constructor() {
        let self = this;
        this.storage = new Map<any, Array<any>>();
        this.types = new Map<string, Object>();
        this.dataObjectPrototypes = new Map<Object, Object>();
        this.eventDispatcherService = EventDispatcherService.getInstance();
        this.eventDispatcherService.addEventListener('stateChange', (state) => self.handleStateChange(state));
    }

    public static getInstance() {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    public registerTypeForKey(this: CacheService, type: any, key: string) {
        let self = this,
            promise;
        if (type && (!this.types.has(key) || this.types.get(key) !== type || !type.objectPrototype || Promise.is(type.objectPrototype))) {
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
            (cacheArray as any)._meta_data = {
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

    private handleStateChange(state: immutable.Map<string, immutable.Map<string, immutable.Map<string, any>>>) {
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

    public getDataObject(key: string) {
        let type = this.types.get(key),
            prototype = this.getPrototypeForType(type),
            object;
        if (prototype) {
            object = Object.create(prototype);
            if (object) {
                object = object.constructor.call(object) || object;
            }
        } else {
            object = {
                _objectType: key
            };
        }
        return object;
    }

    private ensureModelIsPopulated(type: any) {
        return (!type || type.objectPrototype || !type.typeName) ?
            Promise.is(type.objectPrototype) ?
                type.objectPrototype.then(function(objectPrototype) { type.objectPrototype = objectPrototype }) :
                Promise.resolve() :
            Model.populateObjectPrototypeForType(type);
    }

    private updateDataStoreForKey(this: CacheService, key: any, state: immutable.Map<string, immutable.Map<string, any>>) {
        let self = this,
            cache = self.initializeCacheKey(key),
            cachedKeys = [], object;
        for (let i = cache.length - 1; i >= 0; i--) {
            object = cache[i];
            if (state.has(object.id)) {
                _.assign(object, state.get(object.id).toJS());
                cachedKeys.push(object.id);
            } else {
                cache.splice(i, 1);
            }
        }
        state.forEach(function(value, id) {
            if (cachedKeys.indexOf(id) === -1) {
                cache.push(_.assign(self.getDataObject(key), value.toJS()));
            }
        });
        this.eventDispatcherService.dispatch('modelChange.' + key, cache);
        return cache;
    }

    private getPrototypeForType(type: any) {
        let prototype = this.dataObjectPrototypes.get(type);
        if (!prototype && type && type.objectPrototype) {
            prototype = Object.create(type.objectPrototype);
            this.dataObjectPrototypes.set(type, prototype);
        }
        return prototype;
    }
}
