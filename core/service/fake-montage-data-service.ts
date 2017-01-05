import {MiddlewareClient} from './middleware-client';
import {DatastoreService} from './datastore-service';
import {Model} from '../model/model';
import {ModelDescriptorService} from './model-descriptor-service';
import Promise = require('bluebird');

// DTM
export class FakeMontageDataService {
    private static instance: FakeMontageDataService;
    private middlewareClient: MiddlewareClient;
    private datastoreService: DatastoreService;
    private modelDescriptorService: ModelDescriptorService;
    private validPropertyRegex: RegExp;
    private typePropertiesDescriptors: Map<string, Map<string, Object>>;

    private constructor() {
        this.middlewareClient = MiddlewareClient.getInstance();
        this.datastoreService = DatastoreService.getInstance();
        this.modelDescriptorService = ModelDescriptorService.getInstance();
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
        return this.modelDescriptorService.getDaoForType((type as any).typeName).then(function(dao) {
            return criteria ?
                        isSingle ?
                            dao.findSingleEntry(criteria) :
                            dao.find(criteria) :
                        dao.list();
        });
/*
        let key = type.typeName,
            entries;
        if (this.cacheService.hasCacheKey(key) && (entries = this.cacheService.getCacheEntry(key)).length > 0) {
            return Promise.resolve(entries);
        } else {
            return this.queryObjectsFromMiddleware(type, criteria, isSingle);
        }
*/
    }

    public saveDataObject(object: Object, args?: Array<any>) {
        return this.modelDescriptorService.getDaoForObject(object).then(function(dao) {
            return dao.save(object, args);
        });
/*
        this.loadPropertyDescriptors(object);
        return object._isNew ? this.create(object, args) : this.update(object, args);
*/
    }

    public deleteDataObject(object: Object, args?: Array<any>) {
        return this.modelDescriptorService.getDaoForObject(object).then(function(dao) {
            return dao.delete(object, args);
        });
/*
        let typeName = object._objectType ||
            (object.Type && object.Type.typeName) ||
            (object.constructor.Type && object.constructor.Type.typeName);
        return this.middlewareClient.submitTask(ChangeCase.dotCase(typeName) + '.delete', [object.id]);
*/
    }

    public getNewInstanceForType(type: Object): Promise<Object> {
        return this.modelDescriptorService.getDaoForType((type as any).typeName).then(function(dao) {
            return dao.getNewInstance();
        });
/*
        let self = this;
        return this.cacheService.registerTypeForKey(type, type.typeName).then(function () {
            let instance = self.cacheService.getDataObject(type.typeName);
            instance._isNew = true;
            return instance;
        });
*/
    }

    private getURL(): string {
        let scheme = location.protocol === 'https:' ? 'wss' : 'ws',
            host = this.getHost();
        return `${scheme}://${host}/dispatcher/socket`;
    }

    private getHost(): string {
        let result = location.host,
            hostParam = location.href.split(';').filter(
                (x) => x.split('=')[0] === 'host'
            )[0];
        if (hostParam) {
            let host = hostParam.split('=')[1];
            if (host && host.length > 0) {
                result = host;
            }
        }
        return result;
    }
}
