import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class VmDao extends AbstractDao {

    public constructor() {
        super(Model.Vm);
    }

    public requestSerialConsole(vm: any): Promise<string> {
        return this.middlewareClient.callRpcMethod('vm.request_serial_console', [vm.id]);
    }

    public requestWebvncConsole(vm: any): Promise<string> {
        return this.middlewareClient.callRpcMethod('vm.request_webvnc_console', [vm.id]);
    }

    public getHardwareCapabilities() {
        return this.middlewareClient.callRpcMethod("vm.get_hw_vm_capabilities");
    }

    public start(vm: any) {
        return this.middlewareClient.submitTask('vm.start', [vm.id]);
    }

    public stop(vm: any, force: boolean) {
        return this.middlewareClient.submitTask('vm.stop', [vm.id, force]);
    }

    public reboot(vm: any) {
        return this.middlewareClient.submitTask('vm.reboot', [vm.id]);
    }
}

