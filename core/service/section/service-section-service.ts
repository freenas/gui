import {SystemRepository} from "../../repository/system-repository";
import {ServiceRepository} from "../../repository/service-repository";
import {AbstractSectionService} from "./abstract-section-service-ng";
import * as Promise from "bluebird";

export class ServiceSectionService extends AbstractSectionService{
    private systemRepository: SystemRepository;
    private serviceRepository: ServiceRepository;

    protected init() {
        this.systemRepository = SystemRepository.getInstance();
        this.serviceRepository = ServiceRepository.getInstance();
    }

    public getSystemGeneral() {
        return this.systemRepository.getGeneral();
    }

    public saveService(service: any) {
        return this.serviceRepository.saveService(service);
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
