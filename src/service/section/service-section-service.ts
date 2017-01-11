import {SystemRepository} from '../../repository/system-repository';
import {ServiceRepository} from '../../repository/service-repository';
import {AbstractSectionService} from './abstract-section-service-ng';
import {NetworkRepository} from '../../repository/network-repository';
import {VolumeRepository} from '../../repository/volume-repository';
import * as Promise from 'bluebird';

export class ServiceSectionService extends AbstractSectionService {
    private systemRepository: SystemRepository;
    private serviceRepository: ServiceRepository;
    private networkRepository: NetworkRepository;
    private volumeRepository: VolumeRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.serviceRepository = ServiceRepository.getInstance();
        this.networkRepository = NetworkRepository.getInstance();
        this.volumeRepository = VolumeRepository.getInstance();
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

    public listvolumes() {
        return this.volumeRepository.listVolumes;
    }

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
