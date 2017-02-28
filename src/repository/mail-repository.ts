import {AlertEmitterEmailDao} from '../dao/alert-emitter-email-dao';

export class MailRepository {
    private static instance: MailRepository;

    private constructor(
        private alertEmitterEmailDao: AlertEmitterEmailDao
    ) {}

    public static getInstance() {
        if (!MailRepository.instance) {
            MailRepository.instance = new MailRepository(
                new AlertEmitterEmailDao()
            );
        }
        return MailRepository.instance;
    }

    public getConfig(): Promise<any> {
        return this.alertEmitterEmailDao.get();
    }

    public saveConfig(config) {
        return this.alertEmitterEmailDao.save(config);
    }

    public sendTestMail(mailMessage){
        return this.alertEmitterEmailDao.send(mailMessage);
    }
}

