import {AbstractDao} from "./abstract-dao-ng";
export class SupportTicketDao extends AbstractDao {
    public constructor() {
        super('SupportTicket', {
            createMethod: 'support.submit'
        });
    }
}
