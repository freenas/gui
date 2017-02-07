import {ServiceRepository} from '../repository/service-repository';

export class PowerManagementService {
    private static instance: PowerManagementService;

    public constructor(private serviceRepository: ServiceRepository) {}

    public static getInstance(): PowerManagementService {
        if (!PowerManagementService.instance) {
            PowerManagementService.instance = new PowerManagementService(
                ServiceRepository.getInstance()
            );
        }
        return PowerManagementService.instance;
    }

    public listDrivers() {
        return this.serviceRepository.listUpsDrivers();
    }

    public listUsbDevices() {
        return this.serviceRepository.listUpsUsbDevices();
    }
}
