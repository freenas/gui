import {SystemRepository} from "../../repository/system-repository";
import {ServiceRepository} from "../../repository/service-repository";

// TODO: inherit from AbstractSectionService
export class ServiceSectionService {
    private systemRepository: SystemRepository;
    private serviceRepository: ServiceRepository;

    public constructor() {
        this.init();
    }

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
}
