import {AbstractDao} from "./abstract-dao";
export class SupportTicketDao extends AbstractDao {
    public constructor() {
        super('SupportTicket', {
            createMethod: 'support.submit'
        });
    }
}
