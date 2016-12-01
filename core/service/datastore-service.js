"use strict";
var redux_1 = require("redux");
var main_1 = require("../reducers/main");
var ChangeCase = require("change-case");
var middleware_client_1 = require("core/service/middleware-client");
var event_dispatcher_service_1 = require("./event-dispatcher-service");
var DatastoreService = (function () {
    function DatastoreService() {
        var self = this, composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux_1.compose;
        this.store = redux_1.createStore(main_1.dispatchAction, composeEnhancers(redux_1.applyMiddleware(this.promiseMiddleware)));
        this.store.subscribe(function () { return self.handleModelChange(); });
        this.eventDispatcherService = event_dispatcher_service_1.EventDispatcherService.getInstance();
        this.eventDispatcherService.addEventListener('middlewareModelChange', function (args) { return self.handleMiddlewareModelChange(args); });
        this.middlewareClient = middleware_client_1.MiddlewareClient.getInstance();
    }
    DatastoreService.getInstance = function () {
        if (!DatastoreService.instance) {
            DatastoreService.instance = new DatastoreService();
        }
        return DatastoreService.instance;
    };
    DatastoreService.prototype.query = function (type, methodName, middlewareCriteria) {
        var queryPromise = this.middlewareClient.callRpcMethod(methodName, middlewareCriteria);
        this.store.dispatch({
            type: main_1.ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: queryPromise
        });
        return queryPromise;
    };
    DatastoreService.prototype.save = function (type, id, object) {
        this.store.dispatch({
            type: main_1.ACTIONS.SAVE_OBJECT,
            meta: {
                type: type,
                id: id
            },
            payload: object
        });
    };
    DatastoreService.prototype.delete = function (type, id) {
        var state = this.store.getState();
        if (state && state.get(type) && state.get(type).has(id)) {
            this.store.dispatch({
                type: main_1.ACTIONS.DELETE_OBJECT,
                meta: {
                    type: type,
                    id: id
                }
            });
        }
    };
    DatastoreService.prototype.import = function (type, objects) {
        this.store.dispatch({
            type: main_1.ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: objects
        });
    };
    DatastoreService.prototype.getState = function () {
        return this.store.getState();
    };
    DatastoreService.prototype.handleMiddlewareModelChange = function (args) {
        var type = ChangeCase.pascalCase(args.service), ids = args.ids, entities = args.entities, operation = args.operation;
        if (operation === 'create' || operation === 'update') {
            var id = void 0, entity = void 0;
            for (var i = 0; i < ids.length; i++) {
                id = ids[i];
                entity = entities[i];
                this.save(type, id, entity);
            }
        }
        else if (operation === 'delete') {
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                this.delete(type, id);
            }
        }
    };
    DatastoreService.prototype.handleModelChange = function () {
        this.eventDispatcherService.dispatch('stateChange', this.store.getState());
    };
    // DTM (should be replaced by redux-promise as soon as mr is out)
    DatastoreService.prototype.promiseMiddleware = function (_ref) {
        var dispatch = _ref.dispatch;
        return function (next) {
            return function (action) {
                return Promise.is(action.payload) ? action.payload.then(function (result) {
                    return dispatch(Object.assign({}, action, { payload: result }));
                }, function (error) {
                    return dispatch(Object.assign({}, action, { payload: error, error: true }));
                }) : next(action);
            };
        };
    };
    return DatastoreService;
}());
exports.DatastoreService = DatastoreService;
