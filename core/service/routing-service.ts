import * as _ from "lodash";
import * as Promise from "bluebird";
import {Map, Set} from "immutable";
import {ModelDescriptorService} from "./model-descriptor-service";
import {SessionService} from "core/service/session-service";

export class RoutingService {
    private static instance: RoutingService;
    private hash: string;
    private params: Map<string, string>;
    private listeners: Map<string, Set<Function>>;
    private history: Map<string, string>;

    public static SEPARATOR = '~';

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        private sessionService: SessionService) {
        this.getParams();
        this.listeners = Map<string, Set<Function>>();
        this.history = Map<string, string>();
    }

    public static getInstance() {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(
                ModelDescriptorService.getInstance(),
                SessionService.instance
            );
        }
        return RoutingService.instance;
    }

    public selectSection(section: string) {
        if (this.sessionService.session) {
            this.history = this.history.set(this.getParams().get('section'), this.getParams().get('path'));
        }
        this.params = this.getParams().set('section', section).set('path', this.history.get(section) || '');
        this.buildParams();
        this.dispatchParamChange('section');
        this.dispatchParamChange('path');
    }

    public selectObject(object: any, atIndex: number) {
        let self = this;
        return this.getKeyFromObject(object).then(function(objectKey) {
            let path = _.split(self.getParams().get('path') || '', RoutingService.SEPARATOR);
            while (path.length > atIndex) {
                path.pop();
            }
            path.push(objectKey);
            self.params = self.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
            self.buildParams();
            self.dispatchParamChange('path');
            return objectKey;
        })
    }

    public selectProperty(property: string, atIndex: number, objectType?: string) {
        let path = _.split(this.getParams().get('path') || RoutingService.SEPARATOR, RoutingService.SEPARATOR),
            key = property + (objectType ? '[' + objectType : ''),
            pathElement;
        while (path.length > atIndex) {
            pathElement = path.pop();
        }
        path.push(key);
        this.params = this.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
        this.buildParams();
        this.dispatchParamChange('path');
        return property;
    }

    public closeColumnAtIndex(index: number) {
        let path = _.split(this.getParams().get('path') || RoutingService.SEPARATOR, RoutingService.SEPARATOR),
            pathElement;
        while (path.length >= index) {
            pathElement = path.pop();
        }
        this.params = this.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
        this.buildParams();
        this.dispatchParamChange('path');
    }

    public subscribe(param: string, listener: Function) {
        let listeners = this.listeners.has(param) ?
            this.listeners.get(param).add(listener) :
            Set([listener]);
        this.listeners = this.listeners.set(param, listeners);
        return listener;
    }

    public unsubscribe(param: string, listener: Function) {
        if (this.listeners.has(param)) {
            let listeners = this.listeners.get(param).delete(listener);
            this.listeners = this.listeners.set(param, listeners);
        }
    }

    public getKeyFromObject(object: any): Promise<string> {
        let self = this;
        return this.getObjectId(object).then(function(id) {
            let prefix = object._isNew ?
                            'new_' :
                            Array.isArray(object) ?
                                'list_' :
                                '',
                params = {
                    filter: object._filter,
                    sorted: object._sorted
                },
                suffix = id || ((params.filter || params.sorted) && JSON.stringify(params)) || null;
            return prefix + self.getObjectTypeString(object) + (suffix ? '|' + suffix : '');
        });
    }

    public getSection(): string {
        return this.params.get('section');
    }

    public getPath(): string {
        return this.params.get('path');
    }

    private getObjectId(object: any): Promise<any> {
        return this.modelDescriptorService.getUiDescriptorForObject(object).then(function(uiDescriptor) {
            return _.get(object, (object._isNew ? uiDescriptor.newIdPath : uiDescriptor.idPath) || 'id');
        });
    }

    private getObjectTypeString(object: any): string {
        let results;
        if (Array.isArray(object._objectType)) {
            results = _.join(object._objectType, ',');
        } else {
            results = this.modelDescriptorService.getObjectType(object);
        }
        return results;
    }

    private dispatchParamChange(param: string) {
        if (this.listeners.has(param)) {
            let self = this,
                listeners = this.listeners.get(param);
            listeners.forEach(function(listener) {
                listener.call({}, self.params.get(param));
            });
        }
    }

    private getParams(): Map<string, string> {
        if (!this.params || this.hash != location.hash) {
            this.params = Map<string, string>(_.map(
                _.split(location.hash, ';'),
                (x) => _.split(x, '=')
            ));
            this.hash = location.hash;
        }
        return this.params;
    }

    private buildParams() {
        if (this.params) {
            this.hash = _.join(
                _.map(
                    _.sortBy(_.toPairs(this.params.toJS()), [0]),
                    (x) => _.join(x, '=')
                ), ';'
            );
        }
        location.hash = this.hash;
    }
}
