import {MiddlewareClient} from './middleware-client';
import {DatastoreService} from './datastore-service';
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
        return this.middlewareClient.connect().then(function () {
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
    }

    public saveDataObject(object: Object, args?: Array<any>) {
        return this.modelDescriptorService.getDaoForObject(object).then(function(dao) {
            return dao.save(object, args);
        });
    }

    public deleteDataObject(object: Object, args?: Array<any>) {
        return this.modelDescriptorService.getDaoForObject(object).then(function(dao) {
            return dao.delete(object, args);
        });
    }

    public getNewInstanceForType(type: Object): Promise<Object> {
        return this.modelDescriptorService.getDaoForType((type as any).typeName).then(function(dao) {
            return dao.getNewInstance();
        });
    }
}
