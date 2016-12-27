"use strict";
var redux_1 = require("redux");
var main_1 = require("../reducers/main");
var ChangeCase = require("change-case");
var Promise = require("bluebird");
var middleware_client_1 = require("./middleware-client");
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
        var _this = this;
        return this.middlewareClient.callRpcMethod(methodName, middlewareCriteria).then(function (result) {
            var payload = Array.isArray(result) ? result : [result];
            _this.store.dispatch({
                type: main_1.ACTIONS.IMPORT_OBJECTS,
                meta: {
                    type: type
                },
                payload: payload
            });
            return payload;
        });
    };
    DatastoreService.prototype.stream = function (type, methodName, middlewareCriteria) {
        var _this = this;
        //TODO: count rpc call in order to have the total of object for a type (LIMIT: 2000)
        return this.middlewareClient.callRpcMethod(methodName, middlewareCriteria).then(function (message) {
            var streamId = message.id, stream = _this.getDefaultStreamObject(type, streamId);
            _this.store.dispatch({
                type: main_1.ACTIONS.SAVE_STREAM,
                meta: {
                    type: streamId
                },
                payload: stream
            });
            stream = _this.getState().get("streams").get(streamId);
            return _this.handleFragmentResponse(stream, message);
        });
    };
    DatastoreService.prototype.getDefaultStreamObject = function (type, streamId) {
        return {
            type: type,
            streamId: streamId,
            startSequence: 1,
            endSequence: 1,
            lastSequence: 1,
            reachEnd: false,
            data: []
        };
    };
    DatastoreService.prototype.handleFragmentResponse = function (stream, message) {
        var fragment = message.args.fragment, payload = Array.isArray(fragment) ? fragment : [fragment], reachEnd = message.name === "end", sequenceNumber = message.args.seqno, type = stream.get("type"), promise;
        if (reachEnd) {
            stream = stream.set("lastSequence", sequenceNumber)
                .set("reachEnd", true);
            return stream;
        }
        //TODO: Store only data when the total number is under or equal to 2000.
        //TODO: Manage stockage streaming response.
        var action = this.store.dispatch({
            type: main_1.ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: payload
        });
        var data = this.getState().get(type).valueSeq().toJS(), previousLastSequence = stream.get("lastSequence");
        if (sequenceNumber > previousLastSequence) {
            stream = stream.set("lastSequence", sequenceNumber);
        }
        //TODO: Remove data from strea objects. (related to montage data)
        stream = stream.set("endSequence", sequenceNumber)
            .set("reachEnd", false)
            .set("data", data);
        this.store.dispatch({
            type: main_1.ACTIONS.SAVE_STREAM,
            meta: {
                type: message.id
            },
            payload: stream
        });
        //FIXME: remove automatical fetching once the ui would have been updated.
        return this.getNextSequenceForStream(stream.get("streamId"));
    };
    DatastoreService.prototype.getNextSequenceForStream = function (streamId) {
        return this.getSequenceForStream(streamId);
    };
    DatastoreService.prototype.getPreviousSequenceForStream = function (streamId) {
        return this.getSequenceForStream(streamId, false);
    };
    DatastoreService.prototype.getSequenceForStream = function (streamId, next) {
        var _this = this;
        if (next === void 0) { next = true; }
        next = !!next;
        if (streamId) {
            var stream_1 = this.getState().get("streams").get(streamId);
            if (stream_1) {
                var currentEndSequence = stream_1.get("endSequence"), sequenceNumber = next ? currentEndSequence + 1 : currentEndSequence - 1;
                if (sequenceNumber > 0) {
                    return this.middlewareClient.continueRpcMethod(streamId, sequenceNumber).then(function (message) {
                        return _this.handleFragmentResponse(stream_1, message);
                    });
                }
                return Promise.reject("The sequence number must equal or greater than 1");
            }
            return Promise.reject("Stream can be found with stream ID: " + streamId);
        }
        return Promise.reject("Stream ID missing");
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
    DatastoreService.prototype["delete"] = function (type, id) {
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
    DatastoreService.prototype["import"] = function (type, objects) {
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
                this["delete"](type, id);
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
                return Promise.is(action.payload) ?
                    action.payload.then(function (result) { return dispatch(Object.assign({}, action, { payload: result })); }, function (error) { return dispatch(Object.assign({}, action, { payload: error, error: true })); }) :
                    next(action);
            };
        };
    };
    return DatastoreService;
}());
exports.DatastoreService = DatastoreService;
