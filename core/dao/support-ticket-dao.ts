import {AbstractDao} from "./abstract-dao";import {Model} from '../model';
export class SupportTicketDao extends AbstractDao {
    public constructor() {
        super(Model.SupportTicket, {
            createMethod: 'support.submit'
        });
    }
}
