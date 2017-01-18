import {AbstractDao} from "./abstract-dao";
import {Model} from '../model';

export class ShareIscsiTargetDao extends AbstractDao {
    public constructor() {
        super(Model.ShareIscsiTarget, {
            queryMethod: 'share.iscsi.target.query'
        });
    }
}
