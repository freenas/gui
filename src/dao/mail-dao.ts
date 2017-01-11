import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class MailDao extends AbstractDao {

    public constructor() {
        super(Model.Mail, {
            queryMethod: 'mail.get_config',
            createMethod: 'mail.update'
        });
    }

}

