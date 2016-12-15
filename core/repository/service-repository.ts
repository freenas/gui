import {AbstractRepository} from "./abstract-repository-ng";
import {ServiceDao} from "../dao/service-dao";

export class ServiceRepository extends AbstractRepository {
    private static instance: ServiceRepository;
    private constructor(private serviceDao: ServiceDao) {
        super(['Service']);
    }

    public static getInstance() {
        if (!ServiceRepository.instance) {
            ServiceRepository.instance = new ServiceRepository(
                new ServiceDao()
            );
        }
        return ServiceRepository.instance;
    }

    public saveService(service: any) {
        return this.serviceDao.save(service);
    }

    protected handleStateChange(name: string, data: any) {}
    protected handleEvent(name: string, data: any) {}
}
