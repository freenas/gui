import {SystemRepository} from '../repository/system-repository';
import {MiddlewareClient} from './middleware-client';
import {BootPoolRepository} from '../repository/boot-pool-repository';
import {NetworkRepository} from '../repository/network-repository';

export class SystemService {
    private static instance: SystemService;

    private bootPoolPromise: Promise<any>;

    public static readonly SHORT_DATE_FORMATS = [
        'MM/DD/YY',
        'DD/MM/YY',
        'YY/MM/DD'
    ];

    public static readonly MEDIUM_DATE_FORMATS = [
        'MMM, DD YY',
        'DD MMM YY',
        'YY MMM DD'
    ];

    public static readonly LONG_DATE_FORMATS = [
        'MMMM DD, YYYY',
        'DD MMMM YYYY',
        'YYYY MMMM DD'
    ];

    public static readonly FULL_DATE_FORMATS = [
        'dddd, MMMM DD, YYYY',
        'dddd DD MMMM YYYY',
        'YYYY MMMM DD dddd'
    ];

    public static readonly SHORT_TIME_FORMATS = [
        'h:m',
        'H:m'
    ];

    public static readonly MEDIUM_TIME_FORMATS = [
        'hh:mm:ss A',
        'A hh:mm:ss',
        'HH:mm:ss'
    ];

    public static readonly LONG_TIME_FORMATS = [
        'hh:mm:ss A z',
        'A hh:mm:ss z',
        'HH:mm:ss z'
    ];

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
                NetworkRepository.getInstance()
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
        return this.bootPoolPromise || (this.bootPoolPromise = this.bootPoolRepository.getBootPoolConfig());
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

    public getDebugFileAddress() {
        return this.systemRepository.getDebugFileAddress();
    }

    public addDiskToBootPool(newDisk: any, oldDisk?: string) {
        if (!oldDisk) {
            return this.middlewareClient.submitTask('boot.disk.attach', [newDisk.path]);
        }
        return Promise.resolve();
    }

    public getCertificateFileAddress(id: string, certTarFileName: string) {
        return this.systemRepository.getCertificateFileAddress(id, certTarFileName);
    }
}
