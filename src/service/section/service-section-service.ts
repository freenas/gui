import {SystemRepository} from '../../repository/system-repository';
import {ServiceRepository} from '../../repository/service-repository';
import {AbstractSectionService} from './abstract-section-service-ng';
import {NetworkRepository} from '../../repository/network-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import {User} from '../../model/User';
import {UserRepository} from '../../repository/UserRepository';
import {AccountRepository} from '../../repository/account-repository';

export class ServiceSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private serviceRepository: ServiceRepository;
    private networkRepository: NetworkRepository;
    private volumeRepository: VolumeRepository;
    private accountRepository: AccountRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.serviceRepository = ServiceRepository.getInstance();
        this.networkRepository = NetworkRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
        this.accountRepository = AccountRepository.getInstance();
    }

    public getSystemGeneral() {
        return this.systemRepository.getGeneral();
    }

    public saveService(service: any) {
        return this.serviceRepository.saveService(service);
    }

    public getDyndnsProviders() {
        return this.serviceRepository.listDyndnsProviders();
    }

    public listNetworkInterfaces() {
        return this.networkRepository.listNetworkInterfaces();
    }

    public provideDcIp() {
        return this.serviceRepository.provideDcIp();
    }

    public provideDcUrl() {
        return this.serviceRepository.provideDcUrl();
    }

    public listUsers() {
        return this.accountRepository.listUsers();
    }

    public listGroups() {
        return this.accountRepository.listGroups();
    }

    public listVolumes() {
        return this.volumeRepository.listVolumes();
    }

    public getNextSequenceForStream(streamId: string) {}

    protected loadEntries(): Promise<Array<any>> {
        return this.serviceRepository.listServicesCategories();
    }

    protected loadExtraEntries(): Promise<Array<any>> {
        return undefined;
    }

    protected loadSettings(): Promise<any> {
        return undefined;
    }

    protected loadOverview(): Promise<any> {
        return undefined;
    }
}
