import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {PushBullet} from '../model/PushBullet';

export class PushBulletDao extends AbstractDao<PushBullet> {

    public constructor() {
        super(Model.PushBullet, {
            queryMethod: 'alert.emitter.pushbullet.get_config',
            createMethod: 'alert.emitter.pushbullet.update'
        });
    }

}

