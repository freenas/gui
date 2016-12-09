import { createStore, applyMiddleware, compose } from 'redux';
import { dispatchAction, ACTIONS } from '../reducers/main';
import * as ChangeCase from 'change-case';

import { MiddlewareClient } from 'core/service/middleware-client';
import { EventDispatcherService } from './event-dispatcher-service';

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

    public query(this:DatastoreService, type: string, methodName: string, middlewareCriteria: Array<any>) {
        let queryPromise = this.middlewareClient.callRpcMethod(methodName, middlewareCriteria);
        this.store.dispatch({
            type: ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: queryPromise
        });
        return queryPromise;
    }

    public save(this: DatastoreService, type: string, id: string, object: Object) {
        this.store.dispatch({
            type: ACTIONS.SAVE_OBJECT,
            meta: {
                type: type,
                id: id
            },
            payload: object
        });
    }

    public delete(this: DatastoreService, type: any, id: string) {
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

    public import(this:DatastoreService, type, objects: Array<Object>) {
        this.store.dispatch({
            type: ACTIONS.IMPORT_OBJECTS,
            meta: {
                type: type
            },
            payload: objects
        });
    }

    public getState(): Map<string, Map<string, Map<string, any>>> {
        return this.store.getState();
    }

    private handleMiddlewareModelChange(args: any) {
        let type = ChangeCase.pascalCase(args.service),
            ids = args.ids,
            entities = args.entities,
            operation = args.operation;
        if (operation === 'create' || operation === 'update') {
            let id, entity;
            for (let i = 0; i < ids.length; i++) {
                id = ids[i];
                entity = entities[i];
                this.save(type, id, entity);
            }
        } else if (operation === 'delete') {
            for (let id of ids) {
                this.delete(type, id);
            }
        }
    }

    private handleModelChange() {
        this.eventDispatcherService.dispatch('stateChange', this.store.getState());
    }

    // DTM (should be replaced by redux-promise as soon as mr is out)
    private promiseMiddleware(_ref) {
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

    }
}

