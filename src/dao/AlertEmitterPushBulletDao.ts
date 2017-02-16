import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {AlertEmitterPushBullet} from '../model/AlertEmitterPushBullet';

export class AlertEmitterPushBulletDao extends AbstractDao<AlertEmitterPushBullet> {

    public constructor() {
        super(Model.AlertEmitterPushBullet, {
            queryMethod: 'alert.emitter.pushbullet.get_config',
            updateMethod: 'alert.emitter.pushbullet.update'
        });
    }

}

