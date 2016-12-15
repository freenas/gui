import {SystemRepository} from '../repository/system-repository';
import {MiddlewareClient} from './middleware-client';
import {BootPoolRepository} from "../repository/boot-pool-repository";
import {NetworkRepository} from 'core/repository/network-repository';

export class SystemService {
    private static instance: SystemService;

    private constructor(private systemRepository: SystemRepository,
                        private middlewareClient: MiddlewareClient,
                        private bootPoolRepository: BootPoolRepository,
                        private networkRepository: NetworkRepository) {
    }

    public static getInstance() {
        if (!SystemService.instance) {
            SystemService.instance = new SystemService(
                SystemRepository.getInstance(),
                MiddlewareClient.getInstance(),
                BootPoolRepository.getInstance(),
                NetworkRepository.instance
            );
        }
        return SystemService.instance;
    }

    public changeBootPool(bootPool) {
        return this.middlewareClient.submitTask('system_dataset.migrate', [bootPool]);
    }

    public reboot() {
        return this.middlewareClient.submitTask('system.reboot');
    }

    public shutdown() {
        return this.middlewareClient.submitTask('system.shutdown');
    }

    public getVersion() {
        return this.middlewareClient.callRpcMethod('system.info.version');
    }

    public getHardware() {
        return this.middlewareClient.callRpcMethod('system.info.hardware');
    }

    public getUname() {
        return this.middlewareClient.callRpcMethod('system.info.uname_full');
    }

    public getLoad() {
        return this.middlewareClient.callRpcMethod('system.info.load_avg');
    }

    public getTime() {
        return this.systemRepository.getTime();
    }

    public getGeneral() {
        return this.systemRepository.getGeneral();
    }

    public getConfigFileAddress() {
        return this.systemRepository.getConfigFileAddress();
    }

    public restoreFactorySettings() {
        return this.systemRepository.restoreFactorySettings();
    }

    public restoreDatabase(file: File) {
        return this.systemRepository.restoreDatabase(file);
    }

    public getAdvanced() {
        return this.systemRepository.getAdvanced();
    }

    public getBootPoolConfig() {
        return this.bootPoolRepository.getBootPoolConfig();
    }

    public getSystemDatasetPool() {
        return this.systemRepository.getDataset();
    }

    public saveGeneral(general: any) {
        return this.systemRepository.saveGeneral(general);
    }

    public saveAdvanced(advanced: any) {
        return this.systemRepository.saveAdvanced(advanced);
    }

    public getUi() {
        return this.systemRepository.getUi();
    }

    public saveUi(ui: any) {
        return this.systemRepository.saveUi(ui);
    }

    public getMyIps() {
        return this.networkRepository.getMyIps();
    }

    public getDevices(deviceClass: string) {
        return this.systemRepository.getDevices(deviceClass);
    }
}
