"use strict";
var _ = require("lodash");
var immutable_1 = require("immutable");
var model_descriptor_service_1 = require("./model-descriptor-service");
var session_service_1 = require("core/service/session-service");
var RoutingService = (function () {
    function RoutingService(modelDescriptorService, sessionService) {
        this.modelDescriptorService = modelDescriptorService;
        this.sessionService = sessionService;
        this.getParams();
        this.listeners = immutable_1.Map();
        this.history = immutable_1.Map();
    }
    RoutingService.getInstance = function () {
        if (!RoutingService.instance) {
            RoutingService.instance = new RoutingService(model_descriptor_service_1.ModelDescriptorService.getInstance(), session_service_1.SessionService.instance);
        }
        return RoutingService.instance;
    };
    RoutingService.prototype.selectSection = function (section) {
        if (this.sessionService.session) {
            this.history = this.history.set(this.getParams().get('section'), this.getParams().get('path'));
        }
        this.params = this.getParams().set('section', section).set('path', this.history.get(section) || '');
        this.buildParams();
        this.dispatchParamChange('section');
        this.dispatchParamChange('path');
    };
    RoutingService.prototype.selectObject = function (object, atIndex) {
        var self = this;
        return this.getKeyFromObject(object).then(function (objectKey) {
            var path = _.split(self.getParams().get('path') || '', RoutingService.SEPARATOR);
            while (path.length > atIndex) {
                path.pop();
            }
            path.push(objectKey);
            self.params = self.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
            self.buildParams();
            self.dispatchParamChange('path');
            return objectKey;
        });
    };
    RoutingService.prototype.selectProperty = function (property, atIndex, objectType) {
        var path = _.split(this.getParams().get('path') || RoutingService.SEPARATOR, RoutingService.SEPARATOR), key = property + (objectType ? '[' + objectType : ''), pathElement;
        while (path.length > atIndex) {
            pathElement = path.pop();
        }
        path.push(key);
        this.params = this.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
        this.buildParams();
        this.dispatchParamChange('path');
        return property;
    };
    RoutingService.prototype.closeColumnAtIndex = function (index) {
        var path = _.split(this.getParams().get('path') || RoutingService.SEPARATOR, RoutingService.SEPARATOR), pathElement;
        while (path.length >= index) {
            pathElement = path.pop();
        }
        this.params = this.getParams().set('path', _.join(path, RoutingService.SEPARATOR));
        this.buildParams();
        this.dispatchParamChange('path');
    };
    RoutingService.prototype.subscribe = function (param, listener) {
        var listeners = this.listeners.has(param) ?
            this.listeners.get(param).add(listener) :
            immutable_1.Set([listener]);
        this.listeners = this.listeners.set(param, listeners);
        return listener;
    };
    RoutingService.prototype.unsubscribe = function (param, listener) {
        if (this.listeners.has(param)) {
            var listeners = this.listeners.get(param).delete(listener);
            this.listeners = this.listeners.set(param, listeners);
        }
    };
    RoutingService.prototype.getKeyFromObject = function (object) {
        var self = this;
        return this.getObjectId(object).then(function (id) {
            var prefix = object._isNew ?
                'new_' :
                Array.isArray(object) ?
                    'list_' :
                    '', params = {
                filter: object._filter,
                sorted: object._sorted
            }, suffix = id || ((params.filter || params.sorted) && JSON.stringify(params)) || null;
            return prefix + self.getObjectTypeString(object) + (suffix ? '|' + suffix : '');
        });
    };
    RoutingService.prototype.getSection = function () {
        return this.params.get('section');
    };
    RoutingService.prototype.getPath = function () {
        return this.params.get('path');
    };
    RoutingService.prototype.getObjectId = function (object) {
        return this.modelDescriptorService.getUiDescriptorForObject(object).then(function (uiDescriptor) {
            return _.get(object, (object._isNew ? uiDescriptor.newIdPath : uiDescriptor.idPath) || 'id');
        });
    };
    RoutingService.prototype.getObjectTypeString = function (object) {
        var results;
        if (Array.isArray(object._objectType)) {
            results = _.join(object._objectType, ',');
        }
        else {
            results = this.modelDescriptorService.getObjectType(object);
        }
        return results;
    };
    RoutingService.prototype.dispatchParamChange = function (param) {
        if (this.listeners.has(param)) {
            var self_1 = this, listeners = this.listeners.get(param);
            listeners.forEach(function (listener) {
                listener.call({}, self_1.params.get(param));
            });
        }
    };
    RoutingService.prototype.getParams = function () {
        if (!this.params || this.hash != location.hash) {
            this.params = immutable_1.Map(_.map(_.split(location.hash, ';'), function (x) { return _.split(x, '='); }));
            this.hash = location.hash;
        }
        return this.params;
    };
    RoutingService.prototype.buildParams = function () {
        if (this.params) {
            this.hash = _.join(_.map(_.sortBy(_.toPairs(this.params.toJS()), [0]), function (x) { return _.join(x, '='); }), ';');
        }
        location.hash = this.hash;
    };
    RoutingService.SEPARATOR = '~';
    return RoutingService;
}());
exports.RoutingService = RoutingService;
