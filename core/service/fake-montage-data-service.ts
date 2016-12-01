import {MiddlewareClient} from './middleware-client';
import {DatastoreService} from './datastore-service';
import {CacheService} from './cache-service';
import {processor as cleaningProcessor} from 'core/service/data-processor/cleaner';
import {processor as diffProcessor} from 'core/service/data-processor/diff';
import {processor as nullProcessor} from 'core/service/data-processor/null';

import {Model} from 'core/model/model';

import * as ChangeCase from 'change-case';

// DTM
export class FakeMontageDataService {
    private static instance: FakeMontageDataService;
    private middlewareClient: MiddlewareClient;
    private datastoreService: DatastoreService;
    private cacheService: CacheService;
    private validPropertyRegex: RegExp;
    private typePropertiesDescriptors: Map<string, Map<string, Object>>;

    private constructor() {
        this.middlewareClient = MiddlewareClient.getInstance();
        this.datastoreService = DatastoreService.getInstance();
        this.cacheService = CacheService.getInstance();
        this.validPropertyRegex = /[a-z0-9_]*/;
        this.typePropertiesDescriptors = new Map<string, Map<string, Object>>();
    }

    public static getInstance(): FakeMontageDataService {
        if (!FakeMontageDataService.instance) {
            FakeMontageDataService.instance = new FakeMontageDataService();
        }
        return FakeMontageDataService.instance;
    }

    public loginWithCredentials(login: string, password: string) {
        let self = this;
        return this.middlewareClient.connect(this.getURL()).then(function () {
            return self.middlewareClient.login(login, password);
        });
    }

    public fetchData(type: Object, criteria?: Object, isSingle?: boolean) {
        let key = type.typeName,
            entries;
        if (this.cacheService.hasCacheKey(key) && (entries = this.cacheService.getCacheEntry(key)).length > 0) {
            return Promise.resolve(entries);
        } else {
            return this.queryObjectsFromMiddleware(type, criteria, isSingle);
        }
    }

    public saveDataObject(object: Object, args?: Array<any>) {
        this.loadPropertyDescriptors(object);
        return object._isNew ? this.create(object, args) : this.update(object, args);
    }

    public deleteDataObject(object: Object, args?: Array<any>) {
        let typeName = object._objectType ||
            (object.Type && object.Type.typeName) ||
            (object.constructor.Type && object.constructor.Type.typeName);
        return this.middlewareClient.submitTask(ChangeCase.dotCase(typeName) + '.delete', [object.id]);
    }

    public getNewInstanceForType(type: Object): Promise<Object> {
        let self = this;
        return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
            let instance = self.cacheService.getDataObject(type.typeName);
            instance._isNew = true;
            return instance;
        });
    }

    public getEmptyCollectionForType(this: FakeMontageDataService, type: Object): Array<Object> {
        return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
            let emptyArray = [];
            emptyArray._meta_data = {
                collectionModelType: type
            };
            return emptyArray;
        })
    }

    public subscribeToEvents(name: string, type: Object) {
        return Promise.all([
            this.cacheService.registerTypeForKey(type, type.typeName),
            this.middlewareClient.subscribeToEvents(name)
        ]);
    }

    private loadPropertyDescriptors(object: Object) {
        if (object.constructor.Type && object.constructor.Type.constructor) {
            let propertyDescriptors = new Map<string, Object>();
            for (let descriptor of object.constructor.Type.constructor.propertyBlueprints) {
                propertyDescriptors.set(descriptor.name, descriptor);
            }
            this.typePropertiesDescriptors.set(object.constructor.Type.typeName, propertyDescriptors);
        }
    }

    private update(object: Object, args?: Array<any>) {
        let type = object.constructor.Type,
            typeName = type.typeName,
            methodName = type.updateMethod || ChangeCase.dotCase(typeName) + '.update';

        return this.middlewareClient.submitTask(methodName, [object.id,
            diffProcessor.process(
                cleaningProcessor.process(
                    object,
                    this.typePropertiesDescriptors.get(object.constructor.Type.typeName)
                ),
                typeName,
                object.id
            )
        ]);
    }

    private create(object: Object, args?: Array<any>) {
        let type = object.constructor.Type,
            typeName = type.typeName,
            methodName = type.createMethod || ChangeCase.dotCase(typeName) + '.create';

        return this.middlewareClient.submitTask(methodName, [
            nullProcessor.process(
                cleaningProcessor.process(
                    object,
                    this.typePropertiesDescriptors.get(object.constructor.Type.typeName)
                )
            )
        ]);
    }

    private queryObjectsFromMiddleware(type: Object, criteria?: Object, isSingle?: boolean) {
        let self = this,
            typeName = type.typeName,
            middlewareType = type.middlewareType || ChangeCase.paramCase(typeName),
            methodName = type.queryMethod || ChangeCase.dotCase(typeName) + '.query',
            limit = type === Model.Task ? 100 : -1,
            middlewareCriteria = (criteria || limit !== -1) ? this.getMiddlewareCriteria(criteria, isSingle, limit) : [];
        return Model.populateObjectPrototypeForType(type).then(function () {
            return self.cacheService.registerTypeForKey(type, typeName);
        }).then(function () {
            return self.middlewareClient.callRpcMethod(methodName, middlewareCriteria);
        }).then(function (entries) {
            entries = Array.isArray(entries) ? entries : [entries];
            let cache = self.cacheService.initializeCacheKey(typeName);
            self.datastoreService.import(typeName, entries);
            self.middlewareClient.subscribeToEvents('entity-subscriber.' + middlewareType + '.changed');
            return cache;
        });
    }

    private getMiddlewareCriteria(criteria, isSingle, limit): Array<Array<string>> {
        criteria = criteria || {};
        var keys = Object.keys(criteria),
            middlewareCriteria = [],
            result,
            key, value;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            value = criteria[key];
            if (typeof value === 'object') {
                var subCriteria = this._getMiddlewareCriteriaFromObject(value);
                Array.prototype.push.apply(middlewareCriteria, subCriteria.map(function (x) {
                    return [key + '.' + x[0], x[1], x[2]]
                }));
            } else {
                middlewareCriteria.push([key, '=', value]);
            }
        }
        if (isSingle || (limit && limit !== -1)) {
            var params = {};
            if (isSingle) {
                params.single = true;
            }
            if (limit && limit !== -1) {
                params.limit = limit;
            }
            result = [middlewareCriteria, params];
        } else {
            result = [middlewareCriteria];
        }
        return result;
    }

    private getURL(): string {
        var scheme = location.protocol === 'https:' ? 'wss' : 'ws',
            host = this.getHost();
        return `${scheme}://${host}/dispatcher/socket`;
    }

    private getHost(): string {
        let result = location.host,
            hostParam = location.href.split(';').filter(
                (x) => x.split('=')[0] === 'host'
            )[0];
        if (hostParam) {
            var host = hostParam.split('=')[1];
            if (host && host.length > 0) {
                result = host;
            }
        }
        return host;
    }
}
