import { AbstractDao } from './abstract-dao-ng';

export class VmDao extends AbstractDao {

    public constructor() {
        super('Vm');
    }

    public requestSerialConsole(vmId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('vm.request_serial_console', [vmId]);
    }

    public getHardwareCapabilities() {
        return this.middlewareClient.callRpcMethod("vm.get_hw_vm_capabilities");
    }
}

