import {SystemRepository} from "../../repository/system-repository";
import {ServiceRepository} from "../../repository/service-repository";
import {AbstractSectionService} from "./abstract-section-service-ng";
import * as Promise from "bluebird";
import {NetworkRepository} from "../../repository/network-repository";

export class ServiceSectionService extends AbstractSectionService{
    private systemRepository: SystemRepository;
    private serviceRepository: ServiceRepository;
    private networkRepository: NetworkRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.serviceRepository = ServiceRepository.getInstance();
        this.networkRepository = NetworkRepository.getInstance();
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
