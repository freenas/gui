import {AbstractModelRepository} from './abstract-model-repository';
import {ShareIscsiTarget} from '../model/ShareIscsiTarget';
import {ShareIscsiTargetDao} from '../dao/share-iscsi-target-dao';
export class ShareIscsiTargetRepository extends AbstractModelRepository<ShareIscsiTarget> {
    private static instance: ShareIscsiTargetRepository;

    private constructor(private shareIscsiTargetDao: ShareIscsiTargetDao) {
        super(shareIscsiTargetDao);
    }

    public static getInstance() {
        if (!ShareIscsiTargetRepository.instance) {
            ShareIscsiTargetRepository.instance = new ShareIscsiTargetRepository(
                new ShareIscsiTargetDao()
            );
        }
        return ShareIscsiTargetRepository.instance;
    }
}
