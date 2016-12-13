import { AbstractDao } from './abstract-dao-ng';

export class MailDao extends AbstractDao {

    public constructor() {
        super('Mail', {
            queryMethod: 'mail.get_config',
            createMethod: 'mail.update'
        });
    }

}

