import { AbstractDao } from './abstract-dao-ng';

export class MailDao extends AbstractDao {
    private static instance: MailDao;

    private constructor() {
        super(AbstractDao.Model.Mail, {
            queryMethod: 'mail.get_config',
            createMethod: 'mail.update'
        });
    }

    public static getInstance() {
        if (!MailDao.instance) {
            MailDao.instance = new MailDao();
        }
        return MailDao.instance;
    }
}

