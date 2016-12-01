import { MiddlewareClient } from 'core/service/middleware-client';
import { AbstractDao } from '/core/dao/abstract-dao-ng';
import * as ChangeCase from 'change-case';

export class ModelDescriptorService {
    private static instance: ModelDescriptorService;
    private uiCache: Map<string, Object>;
    private daoCache: Map<string, AbstractDao>;

    private readonly UI_DESCRIPTOR_PREFIX = 'core/model/user-interface-descriptors/';
    private readonly UI_DESCRIPTOR_SUFFIX = '-user-interface-descriptor.mjson';
    private readonly DAO_PREFIX = 'core/dao/';
    private readonly DAO_SUFFIX = '-dao.js';

    public constructor(private middlewareClient: MiddlewareClient) {
        this.uiCache = new Map<string, Object>();
        this.daoCache = new Map<string, Object>();
    }

    public static getInstance(): ModelDescriptorService {
        if (!ModelDescriptorService.instance) {
            ModelDescriptorService.instance = new ModelDescriptorService(MiddlewareClient.getInstance());
        }
        return ModelDescriptorService.instance;
    }

    public getUiDescriptorForObject(this: ModelDescriptorService, object: Object): Promise<Object> {
        let type = this.getObjectType(object),
            result;
        if (type) {
            result = this.getUiDescriptorForType(type);
        }
        return result;
    }

    public getUiDescriptorForType(type: string): Promise<Object> {
        let self = this;
        return this.uiCache.has(type) ?
            Promise.resolve(this.uiCache.get(type)) :
            SystemJS.import(this.UI_DESCRIPTOR_PREFIX + ChangeCase.paramCase(type) + this.UI_DESCRIPTOR_SUFFIX)
                .then(function (uiDescriptor) {
                    self.uiCache.set(type, uiDescriptor.root.properties);
                    return uiDescriptor.root.properties;
                });
    }

    public getDaoForObject(object: Object): Promise<AbstractDao> {
        let type = this.getObjectType(object),
            result;
        if (type) {
            result = this.getDaoForType(type);
        }
        return result;
    }

    public getDaoForType(type: string): Promise<AbstractDao> {
        let self = this;
        return this.daoCache.has(type) ?
            Promise.resolve(this.daoCache.get(type)) :
            require.async(this.DAO_PREFIX + ChangeCase.paramCase(type) + this.DAO_SUFFIX).then(function(daoModule) {
                let Dao = daoModule[type + 'Dao'],
                    dao = Dao.getInstance ? Dao.getInstance() : Dao.instance;
                self.daoCache.set(type, dao);
                return dao;
            });
    }

    public getObjectType(this: ModelDescriptorService, object: Object): string {
        let type = object._objectType || (Array.isArray(object) && object.length > 0 && object[0]._objectType);
        if (!type) { // DTM
            let model = object.Type ||
                object.constructor.Type ||
                Array.isArray(object) && object._meta_data && object._meta_data.collectionModelType;
            if (model) {
                type = model.typeName;
            }
        }
        return type;
    }
}
