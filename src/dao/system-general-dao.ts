import { AbstractDao } from './abstract-dao';
import { processor as cleaningProcessor } from '../service/data-processor/cleaner';
import { processor as diffProcessor } from '../service/data-processor/diff';
import { processor as nullProcessor } from '../service/data-processor/null';
import {Model} from "../model";
import Promise = require("bluebird");

export class SystemGeneralDao extends AbstractDao {

    public constructor() {
        super(Model.SystemGeneral, {
            queryMethod: 'system.general.get_config',
            createMethod: 'system.general.update'
        });
    }

    public save(object: any, args?: Array<any>) {
        let update = nullProcessor.process(
            diffProcessor.process(
                cleaningProcessor.process(
                    object,
                    this.propertyDescriptors
                ),
                'SystemGeneral',
                object.id
            )
        );
        if (update || (args && args.length > 0)) {
            return this.middlewareClient.submitTask('system.general.update', [update]);
        }
    }

    public listTimezones(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('system.general.timezones');
    }

    public listKeymaps(): Promise<Array<Array<string>>> {
        return this.middlewareClient.callRpcMethod('system.general.keymaps');
    }
}
