import {MailDao} from "../dao/mail-dao";
import * as Promise from "bluebird";

export class MailRepository {
    private static instance: MailRepository;

    private constructor(
        private mailDao: MailDao
    ) {}

    public static getInstance() {
        if (!MailRepository.instance) {
            MailRepository.instance = new MailRepository(
                MailDao.getInstance()
            );
        }
        return MailRepository.instance;
    }

    public getConfig(): Promise<any> {
        return this.mailDao.get();
    }

    public saveConfig(config) {
        return this.mailDao.save(config);
    }
}

