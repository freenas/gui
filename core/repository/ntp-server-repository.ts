import { AbstractRepository } from './abstract-repository-ng';
import { NtpServerDao } from 'core/dao/ntp-server-dao';
import {Map} from "immutable";
import {ModelEventName} from "../model-event-name";

export class NtpServerRepository extends AbstractRepository {
    private static instance: NtpServerRepository;
    private ntpServers: Map<string, Map<string, any>>;

    private constructor(private ntpServerDao: NtpServerDao) {
        super(['NtpServer']);
    }

    public static getInstance() {
        if (!NtpServerRepository.instance) {
            NtpServerRepository.instance = new NtpServerRepository(
                NtpServerDao.getInstance()
            );
        }
        return NtpServerRepository.instance;
    }

    public listNtpServers(): Promise<Array<Object>> {
        return this.ntpServers ? this.ntpServers.toJS() : this.ntpServerDao.list();
    }

    public syncNow(serverAddress: string) {
        return this.ntpServerDao.syncNow(serverAddress);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'NtpServer':
                this.ntpServers = this.dispatchModelEvents(this.ntpServers, ModelEventName.NtpServer, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {
    }

}

