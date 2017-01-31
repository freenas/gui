import {AbstractDao} from './abstract-dao';
import {Model} from '../model';
import {ShareIscsiTarget} from '../model/ShareIscsiTarget';

export class ShareIscsiTargetDao extends AbstractDao<ShareIscsiTarget> {
    public constructor() {
        super(Model.ShareIscsiTarget, {
            queryMethod: 'share.iscsi.target.query'
        });
    }
}
