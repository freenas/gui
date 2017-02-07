import {AbstractDao} from './abstract-dao';
import { processor as taskProcessor } from '../service/data-processor/methodCleaner';
import { processor as cleaningProcessor } from '../service/data-processor/cleaner';
import { processor as nullProcessor } from '../service/data-processor/null';
import {Model} from '../model';
import {CryptoCertificate} from '../model/CryptoCertificate';

export class CryptoCertificateDao extends AbstractDao<CryptoCertificate> {
    public constructor() {
        super(Model.CryptoCertificate, {
        	eventName: 'entity-subscriber.crypto.certificate.changed'
        });
    }

    public listCountryCodes(): Promise<Array<Object>> {
        return this.middlewareClient.callRpcMethod('crypto.certificate.get_country_codes');
    }

    public collect(id: string, certTarFileName: string) {
        return this.middlewareClient.submitTaskWithDownload('crypto.certificate.export', [id, certTarFileName]);
    }

    public import(certificate: any) {
        let taskName = 'crypto.certificate.import';
        return Promise.all([
            this.loadPropertyDescriptors(),
            this.loadTaskDescriptor(taskName)
        ]).spread((propertyDescriptors, methodDescriptor) => {
            let newObject = taskProcessor.process(
                nullProcessor.process(
                    cleaningProcessor.process(
                        certificate,
                        propertyDescriptors
                    )
                ),
                methodDescriptor
            );
            if (newObject) {
                return this.middlewareClient.submitTask(taskName, [newObject]);
            }
        });

    }
}
