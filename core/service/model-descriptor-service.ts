import { MiddlewareClient } from './middleware-client';
import { AbstractDao } from '../dao/abstract-dao-ng';
import * as ChangeCase from 'change-case';
import Promise = require("bluebird");

export class ModelDescriptorService {
    private static instance: ModelDescriptorService;
    private uiCache: Map<string, Object>;
    private daoCache: Map<string, AbstractDao>;
    private schema: Map<string, any>;

    private readonly UI_DESCRIPTOR_PREFIX = 'core/model/user-interface-descriptors/';
    private readonly UI_DESCRIPTOR_SUFFIX = '-user-interface-descriptor.mjson';
    private readonly DAO_PREFIX = 'core/dao/';
    private readonly DAO_SUFFIX = '-dao.js';

    public constructor(private middlewareClient: MiddlewareClient) {
        this.uiCache = new Map<string, Object>();
        this.daoCache = new Map<string, AbstractDao>();
    }

    public static getInstance(): ModelDescriptorService {
        if (!ModelDescriptorService.instance) {
            ModelDescriptorService.instance = new ModelDescriptorService(MiddlewareClient.getInstance());
        }
        return ModelDescriptorService.instance;
    }

    public getUiDescriptorForObject(this: ModelDescriptorService, object: Object): Promise<any> {
        let type = this.getObjectType(object),
            result;
        if (type) {
            result = this.getUiDescriptorForType(type);
        }
        return result;
    }

    public getUiDescriptorForType(type: string): Promise<any> {
        let self = this;
        if (type) {
            return this.uiCache.has(type) ?
                Promise.resolve(this.uiCache.get(type)) :
                SystemJS.import(this.UI_DESCRIPTOR_PREFIX + ChangeCase.paramCase(type) + this.UI_DESCRIPTOR_SUFFIX)
                    .then(function (uiDescriptor) {
                        self.uiCache.set(type, uiDescriptor.root.properties);
                        return uiDescriptor.root.properties;
                    });
        }
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
                let dao = new (daoModule[type + 'Dao'])();
                self.daoCache.set(type, dao);
                return dao;
            }, function() {
                debugger;
            });
    }

    public getObjectType(object: any): string {
        let type = (Array.isArray(object._objectType) && object._objectType[0]) || object._objectType || (Array.isArray(object) && object.length > 0 && object[0]._objectType);
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

    public getPropertyType(type: string, property: string): Promise<string> {
        return this.loadRemoteSchema().then(function(schema) {
            let result;
            if (schema.has(type)) {
                let propertyDescriptor = schema.get(type).properties[property];
                if (propertyDescriptor) {
                    if (propertyDescriptor.type) {
                        result = propertyDescriptor.type;
                    } else if (propertyDescriptor['$ref']) {
                        result = ChangeCase.pascalCase(propertyDescriptor['$ref']);
                    }
                }
            }
            return result;
        });
    }

    private loadRemoteSchema(): Promise<Map<string, Object>> {
        let self = this;
        return this.schema ?
            Promise.resolve(this.schema) :
            this.middlewareClient.callRpcMethod('discovery.get_schema').then(function(schema: any) {
                self.schema = new Map<string, any>();
                for (let schemaType in schema.definitions) {
                    let objectType = ChangeCase.pascalCase(schemaType);
                    self.schema.set(objectType, schema.definitions[schemaType]);
                }
                return self.schema;
            });
    }
}
