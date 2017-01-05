import { MiddlewareClient } from './middleware-client';
import { AbstractDao } from '../dao/abstract-dao';
import * as Promise from 'bluebird';
import * as _ from 'lodash';

export class ModelDescriptorService {
    private static instance: ModelDescriptorService;
    private uiCache: Map<string, Object>;
    private daoCache: Map<string, Promise<AbstractDao>>;
    private schema: Map<string, any>;


    private readonly UI_DESCRIPTOR_PREFIX = 'core/model/user-interface-descriptors/';
    private readonly UI_DESCRIPTOR_SUFFIX = '-user-interface-descriptor.mjson';
    private readonly DAO_PREFIX = 'core/dao/';
    private readonly DAO_SUFFIX = '-dao';

    public constructor(private middlewareClient: MiddlewareClient) {
        this.uiCache = new Map<string, Object>();
        this.daoCache = new Map<string, Promise<AbstractDao>>();
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
if (typeof type !== 'string') debugger;
        let self = this;
        if (type) {
            let uiDescriptorPath = this.UI_DESCRIPTOR_PREFIX + _.kebabCase(type) + this.UI_DESCRIPTOR_SUFFIX;
            return Promise.resolve(
                this.uiCache.has(type) ?
                    this.uiCache.get(type) :
                    SystemJS.import(uiDescriptorPath).then((uiDescriptor) => {
                        self.uiCache.set(type, uiDescriptor.root.properties);
                        return uiDescriptor.root.properties;
                    }, () => { debugger; })
            );
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
        let daoPath = this.DAO_PREFIX + _.kebabCase(type) + this.DAO_SUFFIX;
        if (!this.daoCache.has(type)) {
            this.daoCache.set(type,
                Promise.resolve(
                    require.async(daoPath).then((daoModule) => new (daoModule[type + 'Dao'])(), () => { debugger; })
                )
            );
        }
        return this.daoCache.get(type);
    }

    public getObjectType(object: any): string {
        return  (Array.isArray(object._objectType) && object._objectType[0]) ||
                object._objectType ||
                (Array.isArray(object) && object.length > 0 && object[0]._objectType);
    }

    public getPropertyType(type: string, property: string): Promise<string> {
        return this.loadRemoteSchema().then(function(schema) {
            let result;
            if (schema.has(type)) {
                let propertyDescriptor = (schema.get(type) as any).properties[property];
                if (propertyDescriptor) {
                    if (propertyDescriptor.type) {
                        result = propertyDescriptor.type;
                    } else if (propertyDescriptor['$ref']) {
                        result = _.upperFirst(_.camelCase(propertyDescriptor['$ref']));
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
                    let objectType = _.upperFirst(_.camelCase(schemaType));
                    self.schema.set(objectType, schema.definitions[schemaType]);
                }
                return self.schema;
            });
    }
}
