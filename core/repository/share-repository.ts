import { AbstractRepository } from './abstract-repository-ng';
import { ShareDao } from 'core/dao/share-dao';
import {ModelEventName} from "../model-event-name";
import {Map} from "immutable";

export class ShareRepository extends AbstractRepository {
    private static instance: ShareRepository;
    private shares: Map<string, Map<string, any>>;
    private constructor(private shareDao: ShareDao) {
        super(['Share']);
    }

    public static getInstance() {
        if (!ShareRepository.instance) {
            ShareRepository.instance = new ShareRepository(
                new ShareDao()            );
        }
        return ShareRepository.instance;
    }

    public listShares(): Promise<Array<Object>> {
        return this.shareDao.list();
    }

    public getNewShare(volume, shareType) {
        return this.shareDao.getNewInstance().then(function(share) {
            share._isNewObject = true;
            share._tmpId = shareType;
            share._volume = volume;
            share.type = shareType;
            share.enabled = true;
            share.description = '';

            return share;
        });
    }

    public saveShare(object: any, isServiceEnabled: boolean) {
        return this.shareDao.save(object, object._isNew ? [null, isServiceEnabled] : [isServiceEnabled]);
    }

    protected handleStateChange(name: string, state: any) {
        switch (name) {
            case 'Share':
                this.shares = this.dispatchModelEvents(this.shares, ModelEventName.Share, state);
                break;
            default:
                break;
        }
    }

    protected handleEvent(name: string, data: any) {}
}



