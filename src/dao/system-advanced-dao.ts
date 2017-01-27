import {AbstractDao} from './abstract-dao';
import {processor as cleaningProcessor} from '../service/data-processor/cleaner';
import {processor as diffProcessor} from '../service/data-processor/diff';
import {processor as nullProcessor} from '../service/data-processor/null';
import { processor as taskProcessor } from '../service/data-processor/methodCleaner';
import {Model} from '../model';

export class SystemAdvancedDao extends AbstractDao {

    public constructor() {
        super(Model.SystemAdvanced, {
            queryMethod: 'system.advanced.get_config',
            createMethod: 'system.advanced.update'
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
                        Model.SystemAdvanced,
                        object.id
                    )
                ), methodDescriptor);
            if (update || (args && args.length > 0)) {
                return this.middlewareClient.submitTask('system.advanced.update', [update]);
            }
        });
    }

}
