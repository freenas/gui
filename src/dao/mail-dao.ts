import { AbstractDao } from './abstract-dao';
import {Model} from '../model';
import {Mail} from '../model/Mail';

export class MailDao extends AbstractDao<Mail> {

    public constructor() {
        super(Model.Mail, {
            queryMethod: 'alert.emitter.mail.get_config',
            createMethod: 'alert.emitter.mail.update'
        });
    }

}

