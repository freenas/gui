import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
import {SupportTicket} from '../model/SupportTicket';
export class SupportTicketDao extends AbstractDao<SupportTicket> {
    public constructor() {
        super(Model.SupportTicket, {
            createMethod: 'support.submit'
        });
    }
}
