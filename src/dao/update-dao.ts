import { AbstractDao } from './abstract-dao';
import {Model} from "../model";

export class UpdateDao extends AbstractDao {

    public constructor() {
        super(Model.Update, {
            queryMethod: 'update.get_config'
        });
    }

    public trains() {
        return this.middlewareClient.callRpcMethod('update.trains');
    }

    public updateInfo() {
        return this.middlewareClient.callRpcMethod('update.update_info');
    }

    public verify() {
        return this.middlewareClient.submitTask('update.verify');
    }

    public check() {
        return this.middlewareClient.submitTask('update.check');
    }

    public checkfetch() {
        return this.middlewareClient.submitTask('update.checkfetch');
    }

    public updatenow(reboot: boolean) {
        return this.middlewareClient.submitTask('update.updatenow', [reboot]);
    }

    public apply(reboot: boolean) {
        return this.middlewareClient.submitTask('update.apply', [reboot]);
    }
}

