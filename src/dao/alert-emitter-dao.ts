import {AbstractDao} from './abstract-dao';
import {AlertEmitter} from '../model/AlertEmitter';

export class AlertEmitterDao extends AbstractDao<AlertEmitter> {

    public constructor() {
        super(AlertEmitter.getClassName(), {
            queryMethod: 'alert.emitter.query',
            createMethod: 'alert.emitter.update',
            updateMethod: 'alert.emitter.update'
        });
    }

    sendEmail(mailMessage: any, mailObject: any) {
        return this.middlewareClient.callRpcMethod('alert.emitter.email.send', [mailMessage, mailObject]);
    }
}

