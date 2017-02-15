import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {AlertEmitterEmail} from '../model/AlertEmitterEmail';

export class AlertEmitterEmailDao extends AbstractDao<AlertEmitterEmail> {

    public constructor() {
        super(Model.AlertEmitterEmail, {
            queryMethod: 'alert.emitter.email.get_config',
            createMethod: 'alert.emitter.email.update'
        });
    }

}

