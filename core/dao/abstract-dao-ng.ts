import { MiddlewareClient } from '../service/middleware-client';
import { DatastoreService } from '../service/datastore-service';
import { Model } from '../model/model';
import { processor as cleaningProcessor } from '../service/data-processor/cleaner';
import { processor as diffProcessor } from '../service/data-processor/diff';
import { processor as nullProcessor } from '../service/data-processor/null';
import { dotCase, paramCase } from 'change-case';
import * as _ from 'lodash';
import * as Promise from "bluebird";

// DTM
import { CacheService } from '../service/cache-service';

export class AbstractDao {
    protected middlewareClient: MiddlewareClient;
    protected datastoreService: DatastoreService;

    private listPromise: Promise<Array<any>>;

    protected model: any;
    private middlewareName: string;
    private objectType: string;
    private queryMethod: string;
    private createMethod: string;
    private updateMethod: string;
    private deleteMethod: string;
    private eventName: string;
    protected propertyDescriptors: Map<string, any>;

    // DTM
    private cacheService: CacheService;
    private registerPromise: Promise<void>;

    public constructor(objectType: any, config?: any) {
        config = config || {};
        let self = this;
        this.model = Model[objectType] || {};
        this.objectType = config.typeName || objectType;
        this.middlewareName = config.middlewareName || paramCase(objectType);
        this.queryMethod = config.queryMethod || dotCase(objectType) + '.query';
        this.updateMethod = config.updateMethod || dotCase(objectType) + '.update';
        this.createMethod = config.createMethod || dotCase(objectType) + '.create';
        this.deleteMethod = config.deleteMethod || dotCase(objectType) + '.delete';
        this.eventName = config.eventName || 'entity-subscriber.' + this.middlewareName + '.changed';
        this.middlewareClient = MiddlewareClient.getInstance();
        this.datastoreService = DatastoreService.getInstance();

        // DTM
        this.cacheService = CacheService.getInstance();
        this.registerPromise = this.cacheService.registerTypeForKey(this.model, objectType).then(function() {
            self.propertyDescriptors = new Map<string, any>();
            if (self.model.constructor.propertyBlueprints) {
                for (let descriptor of self.model.constructor.propertyBlueprints) {
                    self.propertyDescriptors.set(descriptor.name, descriptor);
                }
            }
        });
    }

    public list(): Promise<Array<any>> {
        return this.listPromise ?
            this.listPromise :
            this.listPromise = this.query();
    }

    public get(): Promise<any> {
        return this.list().then((x) => x[0]);
    }

    public findSingleEntry(criteria: any, params?: any): Promise<any> {
        params = params || {};
        params.single = true;
        return this.query(criteria, params).then(function(results) {
            return results[0];
        });
    }

    public find(criteria?: any, params?: any): Promise<any> {
        criteria = criteria || {};
        params = params || {};
        return this.query(criteria, params).then(function(results) {
            return results;
        });
    }

    public register() {
        this.middlewareClient.subscribeToEvents(this.eventName);
    }

    public save(object: any, args?: Array<any>): Promise<any> {
        return object._isNew ? this.create(object, args) : this.update(object, args);
    }

    public delete(object: any, args?: Array<any>) {
        args = args || [];
        return this.middlewareClient.submitTask(this.deleteMethod, _.concat([object.id], args));
    }

    public getNewInstance() {
        let self = this;
        return this.cacheService.registerTypeForKey(this.objectType, this.model).then(function() {
            return new Object({
                _isNew: true,
                _objectType: self.objectType
            });
        });
    }

    public getEmptyList() {
        let self = this;
        return this.cacheService.registerTypeForKey(this.objectType, this.model).then(function() {
            let emptyList = [];
            (emptyList as any)._objectType = self.objectType;
            return emptyList;
        })
    }

    private update(object: any, args?: Array<any>): Promise<any> {
        args = args || [];
        let update = diffProcessor.process(
            cleaningProcessor.process(
                object,
                this.propertyDescriptors
            ),
            this.objectType,
            object.id
        );
        if (update || (args && args.length > 0)) {
            return this.middlewareClient.submitTask(this.updateMethod, _.concat([object.id, update], args));
        }
    }

    private create(object: any, args?: Array<any>): Promise<any> {
        args = args || [];
        let newObject = nullProcessor.process(
            cleaningProcessor.process(
                object,
                this.propertyDescriptors
            )
        );
        if (newObject) {
            return this.middlewareClient.submitTask(this.createMethod, _.concat([newObject], args));
        }
    }

    private query(criteria?: any, isSingle?: boolean): Promise<void> {
        let self = this,
            middlewareCriteria = criteria ? this.getMiddlewareCriteria(criteria, isSingle) : [];
        let modelInitializationPromise = this.model.typeName ? Model.populateObjectPrototypeForType(this.model) : Promise.resolve();
        return modelInitializationPromise.then(function() {
            return self.datastoreService.query(self.objectType, self.queryMethod, middlewareCriteria);
        }).then(function(entries) {
            entries = Array.isArray(entries) ? entries : [entries];
            self.register();
            let results = entries.map(function(x) {
                x._objectType = self.objectType;
                x.Type = x.constructor.Type = self.model;
                return x;
            });
            results._meta_data = {
                collectionModelType: self.model
            };
            results._objectType = self.objectType;
            return results;
        });
    }

    private getMiddlewareCriteria(criteria: Object, params?: Object): Array<any> {
        let keys = Object.keys(criteria),
            middlewareCriteria = [],
            key, value;
        for (let i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            value = criteria[key];
            if (typeof value === 'object') {
                let subCriteria = this.getMiddlewareCriteria(value);
                Array.prototype.push.apply(middlewareCriteria, subCriteria.map(function(x) { return [key + '.' + x[0], x[1], x[2]] }));
            } else {
                middlewareCriteria.push([key, '=', value]);
            }
        }
        return params ? [middlewareCriteria, params] : [middlewareCriteria];
    }

}
