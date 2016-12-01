import { SystemRepository } from 'core/repository/system-repository';
import { MiddlewareClient } from 'core/service/middleware-client';

export class SystemService {
    private static instance: SystemService;
    private systemRepository: SystemRepository;
    private middlewareClient: MiddlewareClient;

    private constructor(systemRepository: SystemRepository, middlewareClient: MiddlewareClient) {
        this.systemRepository = systemRepository;
        this.middlewareClient = middlewareClient;
    }

    public static getInstance() {
        if (!SystemService.instance) {
            SystemService.instance = new SystemService(SystemRepository.getInstance(), MiddlewareClient.getInstance());
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
}
