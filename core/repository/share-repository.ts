import { AbstractRepository } from './abstract-repository-ng';
import { ShareDao } from 'core/dao/share-dao';

export class ShareRepository extends AbstractRepository {
    private static instance: ShareRepository;
    private shares: immutable.Map<string, Map<string, any>>;

    private constructor(private shareDao: ShareDao) {
        super(['Share']);
    }

    public static getInstance() {
        if (!ShareRepository.instance) {
            ShareRepository.instance = new ShareRepository(
                ShareDao.getInstance()            );
        }
        return ShareRepository.instance;
    }

    public listShares(): Promise<Array<Object>> {
        return this.shareDao.list();
    }

    protected handleStateChange(name: string, state: any) {
        let self = this;
        switch (name) {
            case 'Share':
                this.eventDispatcherService.dispatch('sharesChange', state);
                state.forEach(function(share, id){
                    if (!self.shares || !self.shares.has(id)) {
                        self.eventDispatcherService.dispatch('shareAdd.' + id, share);
                    } else if (self.shares.get(id) !== share) {
                        self.eventDispatcherService.dispatch('shareChange.' + id, share);
                    }
                });
                if (this.shares) {
                    this.shares.forEach(function(share, id){
                        if (!state.has(id) || state.get(id) !== share) {
                            self.eventDispatcherService.dispatch('shareRemove.' + id, share);
                        }
                    });
                }
                this.shares = state;
                break;
            default:
                break;
        }
    }
}



