import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import { processor as cleaningProcessor } from '../service/data-processor/cleaner';
import { processor as diffProcessor } from '../service/data-processor/diff';
import { processor as nullProcessor } from '../service/data-processor/null';
import { processor as taskProcessor } from '../service/data-processor/methodCleaner';

export class SystemUiDao extends AbstractDao {
    public constructor() {
        super(Model.SystemUi, {
            queryMethod: 'system.ui.get_config'
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
                        Model.SystemUi,
                        object.id
                    )
                ), methodDescriptor);
            if (update || (args && args.length > 0)) {
                return this.middlewareClient.submitTask('system.ui.update', [update]);
            }
        });
    }

}
