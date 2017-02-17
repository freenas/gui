import { createStore, applyMiddleware, compose } from 'redux';
import { dispatchAction, ACTIONS } from '../reducers/main';

import { MiddlewareClient } from './middleware-client';
import { EventDispatcherService } from './event-dispatcher-service';
import {Map} from 'immutable';
import _ = require('lodash');

export class DatastoreService {
    private static instance: DatastoreService;
    private store;
    private eventDispatcherService: EventDispatcherService;
    private middlewareClient: MiddlewareClient;

    private constructor() {
        let self = this,
            composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        this.store = createStore(dispatchAction, composeEnhancers(applyMiddleware(this.promiseMiddleware)));
        this.store.subscribe(() => self.handleModelChange());
        this.eventDispatcherService = EventDispatcherService.getInstance();
        this.eventDispatcherService.addEventListener('middlewareModelChange', (args) => self.handleMiddlewareModelChange(args));
        this.middlewareClient = MiddlewareClient.getInstance();
    }

    public static getInstance() {
        if (!DatastoreService.instance) {
            DatastoreService.instance = new DatastoreService();
        }
        return DatastoreService.instance;
    }

    public query(type: string, methodName: string, idPath: string, middlewareCriteria?: Array<any>) {
        return this.middlewareClient.callRpcMethod(methodName, middlewareCriteria).then((result) => {
            let payload = Array.isArray(result) ? result : [result];

            this.store.dispatch({
                type: ACTIONS.IMPORT_OBJECTS,
                meta: {
                    type: type,
                    idPath: idPath
                },
                payload: payload
            });

            return payload;
        });
    }

    public stream(type: string, methodName: string, idPath: string, partial: boolean, middlewareCriteria?: Array<any>) {
        // TODO: count rpc call in order to have the total of object for a type (LIMIT: 2000)
        return this.middlewareClient.callRpcMethod(methodName, middlewareCriteria).then((message) => {
            let streamId = message.id,
                stream = this.getDefaultStreamObject(type, streamId, idPath, partial);

            this.store.dispatch({
                type: ACTIONS.SAVE_STREAM,
                meta: {
                    type: streamId
                },
                payload: stream
            });

            return this.handleFragmentResponse(this.getState().get('streams').get(streamId), message);
        });
    }

    private getDefaultStreamObject (type, streamId, idPath, partial) {
        return {
            type: type,
            streamId: streamId,
            idPath: idPath,
            startSequence: 1,
            endSequence: 1,
            lastSequence: 1,
            partial: partial,
            reachEnd: false,
            data: []
        };
    }

    private handleFragmentResponse (stream: Map<string, any>, message) {
        let fragment = message.args.fragment || [],
            reachEnd = message.name === 'end',
            sequenceNumber = message.args.seqno,
            type = stream.get('type');

        if (reachEnd) {
            stream = stream.set('lastSequence', sequenceNumber)
                        .set('reachEnd', true);

            return stream;
        }

        // TODO: Store only data when the total number is under or equal to 2000.
        // TODO: Manage stockage streaming response.
        this.store.dispatch({
            type: ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type,
                idPath: stream.get('idPath')
            },
            payload: _.castArray(fragment)
        });

        let data = this.getState().get(type).valueSeq().toJS(),
            previousLastSequence = stream.get('lastSequence');

        if (sequenceNumber > previousLastSequence) {
            stream = stream.set('lastSequence', sequenceNumber);
        }

        // TODO: Remove data from strea objects. (related to montage data)
        stream = stream.set('endSequence', sequenceNumber)
                    .set('reachEnd', false)
                    .set('data', data);

        this.store.dispatch({
            type: ACTIONS.SAVE_STREAM,
            meta: {
                type: message.id
            },
            payload: stream.toJS()
        });

        if (stream.get('partial')) {
            return this.getState().get('streams').get(stream.get('streamId'));
        }

        return this.getNextSequenceForStream(stream.get('streamId'));
    }

    public getNextSequenceForStream (streamId) {
        return this.getSequenceForStream(streamId);
    }

    public getPreviousSequenceForStream (streamId) {
        return this.getSequenceForStream(streamId, false);
    }

    private getSequenceForStream(streamId, next = true) {
        next = !!next;

        if (streamId) {
            let stream = this.getState().get('streams').get(streamId);

            if (stream) {
                let currentEndSequence = stream.get('endSequence'),
                    sequenceNumber = next ? currentEndSequence + 1 : currentEndSequence - 1;

                if (sequenceNumber > 0) {
                    return this.middlewareClient.continueRpcMethod(streamId, sequenceNumber).then((message) => {
                        return this.handleFragmentResponse(stream, message);
                    });
                }

                return Promise.reject('The sequence number must equal or greater than 1');
            }

            return Promise.reject('Stream can be found with stream ID: ' + streamId);
        }

        return Promise.reject('Stream ID missing');
    }

    public save(type: string, id: string, object: Object) {
        this.store.dispatch({
            type: ACTIONS.SAVE_OBJECT,
            meta: {
                type: type,
                id: id
            },
            payload: object
        });
    }

    public delete(type: any, id: string) {
        let state = this.store.getState();
        if (state && state.get(type) && state.get(type).has(id)) {
            this.store.dispatch({
                type: ACTIONS.DELETE_OBJECT,
                meta: {
                    type: type,
                    id: id
                }
            });
        }
    }

    public import(type, objects: Array<Object>) {
        this.store.dispatch({
            type: ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: objects
        });
    }

    public rename(type, oldId: string, newId: string) {
        this.store.dispatch({
            type: ACTIONS.RENAME_OBJECT,
            meta: {
                type: type,
                id: oldId
            },
            payload: newId
        });
    }

    public saveOverlay(type: string, id: any, taskId: number, payload: any) {
        this.store.dispatch({
            type: ACTIONS.SAVE_OVERLAY,
            meta: {
                type: type,
                id: id,
                taskId: taskId
            },
            payload: payload
        });
    }

    public deleteOverlay(type: string, id: any, taskId: number) {
        this.store.dispatch({
            type: ACTIONS.DELETE_OVERLAY,
            meta: {
                type: type,
                id: id,
                taskId: taskId
            }
        });
    }

    public getState(): Map<string, Map<string, Map<string, any>>> {
        return this.store.getState();
    }

    private handleMiddlewareModelChange(args: any) {
        let type = _.upperFirst(_.camelCase(args.service)),
            ids = args.ids,
            entities = args.entities,
            operation = args.operation;
        switch (operation) {
            case 'create':
            case 'update':
                let id, entity;
                for (let i = 0; i < ids.length; i++) {
                    id = ids[i];
                    entity = entities[i];
                    if (entity) {
                        this.save(type, id, entity);
                    }
                }
                break;
            case 'delete':
                for (let id of ids) {
                    this.delete(type, id);
                }
                break;
            case 'rename':
                for (let id of ids) {
                    this.rename(type, id[0], id[1]);
                }
                break;
            default:
                console.log('Unknown operation: "' + operation + '"');
                break;
        }
    }

    private handleModelChange() {
        this.eventDispatcherService.dispatch('stateChange', this.store.getState());
    }

    // DTM (should be replaced by redux-promise as soon as mr is out)
    private promiseMiddleware(_ref) {
        let dispatch = _ref.dispatch;

        return function (next) {
            return function (action) {
                return Promise.is(action.payload) ?
                    action.payload.then(
                        function (result) { return dispatch(Object.assign({}, action, { payload: result })); },
                        function (error) { return dispatch(Object.assign({}, action, { payload: error, error: true })); }) :
                    next(action);
            };
        };

    }
}

