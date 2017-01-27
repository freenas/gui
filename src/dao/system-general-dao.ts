import { AbstractDao } from './abstract-dao';
import { processor as cleaningProcessor } from '../service/data-processor/cleaner';
import { processor as diffProcessor } from '../service/data-processor/diff';
import { processor as nullProcessor } from '../service/data-processor/null';
import { processor as taskProcessor } from '../service/data-processor/methodCleaner';
import {Model} from '../model';

export class SystemGeneralDao extends AbstractDao {

    public constructor() {
        super(Model.SystemGeneral, {
            queryMethod: 'system.general.get_config',
            createMethod: 'system.general.update'
        });
    }

    public save(object: any, args?: Array<any>) {
        return Promise.all([
            this.loadPropertyDescriptors(),
            this.loadTaskDescriptor(this.updateMethod)
        ]).spread((propertyDescriptors, methodDescriptor) => {
            let update = taskProcessor.process(
                nullProcessor.process(
                    diffProcessor.process(
                        cleaningProcessor.process(
                            object,
                            propertyDescriptors
                        ),
                        Model.SystemGeneral,
                        object.id
                    )
                ), methodDescriptor);
            if (update || (args && args.length > 0)) {
                return this.middlewareClient.submitTask('system.advanced.update', [update]);
            }
        });
    }

    public listTimezones(): Promise<Array<string>> {
        return this.middlewareClient.callRpcMethod('system.general.timezones');
    }

    public listKeymaps(): Promise<Array<Array<string>>> {
        return this.middlewareClient.callRpcMethod('system.general.keymaps');
    }
}
