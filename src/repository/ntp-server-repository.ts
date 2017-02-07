import { AbstractRepository } from './abstract-repository';
import { NtpServerDao } from '../dao/ntp-server-dao';
import {Map} from 'immutable';
import {ModelEventName} from '../model-event-name';
import {Model} from '../model';

export class NtpServerRepository extends AbstractRepository {
    private static instance: NtpServerRepository;
    private ntpServers: Map<string, Map<string, any>>;

    private constructor(private ntpServerDao: NtpServerDao) {
        super([Model.NtpServer]);
    }

    public static getInstance() {
        if (!NtpServerRepository.instance) {
            NtpServerRepository.instance = new NtpServerRepository(
                new NtpServerDao()
            );
        }
        return NtpServerRepository.instance;
    }

    public listNtpServers(): Promise<Array<Object>> {
        return this.ntpServers ? Promise.resolve(this.ntpServers.valueSeq().toJS()) : this.ntpServerDao.list();
    }

    public syncNow(serverAddress: string) {
        return this.ntpServerDao.syncNow(serverAddress);
    }

    public saveNtpServer(server: any) {
        return this.ntpServerDao.save(server);
    }

    public getNewNtpServer() {
        return this.ntpServerDao.getNewInstance();
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

