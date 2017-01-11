import { AbstractDao } from './abstract-dao';
import {Model} from "../model";
import Promise = require("bluebird");

export class VmDao extends AbstractDao {

    public constructor() {
        super(Model.Vm);
    }

    public requestSerialConsole(vmId: string): Promise<string> {
        return this.middlewareClient.callRpcMethod('vm.request_serial_console', [vmId]);
    }

    public getHardwareCapabilities() {
        return this.middlewareClient.callRpcMethod("vm.get_hw_vm_capabilities");
    }

    public start(vm: any) {
        return this.middlewareClient.submitTask('vm.start', [vm.id]);
    }

    public stop(vm: any) {
        return this.middlewareClient.submitTask('vm.stop', [vm.id]);
    }

    public reboot(vm: any) {
        return this.middlewareClient.submitTask('vm.reboot', [vm.id]);
    }
}

