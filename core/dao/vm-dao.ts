import { AbstractDao } from './abstract-dao-ng';

export class VmDao extends AbstractDao {
    private static instance: VmDao;

    private constructor() {
        super(AbstractDao.Model.Vm);
    }

    public static getInstance() {
        if (!VmDao.instance) {
            VmDao.instance = new VmDao();
        }
        return VmDao.instance;
    }

    public requestSerialConsole(vmId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('vm.request_serial_console', [vmId]);
    }

    public getHardwareCapabilities() {
        return this.middlewareClient.callRpcMethod("vm.get_hw_vm_capabilities");
    }
}

