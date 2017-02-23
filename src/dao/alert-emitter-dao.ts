import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {AlertEmitter} from '../model/AlertEmitter';

export class AlertEmitterDao extends AbstractDao<AlertEmitter> {

    public constructor() {
        super(Model.AlertEmitter, {
            queryMethod: 'alert.emitter.query',
            createMethod: 'alert.emitter.update',
            updateMethod: 'alert.emitter.update'
        });
    }
}

