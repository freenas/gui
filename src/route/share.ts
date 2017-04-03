import {ShareRepository} from '../repository/share-repository';
import {VolumeRepository} from '../repository/volume-repository';
import {ModelEventName} from '../model-event-name';
import {AbstractRoute} from './abstract-route';
import {Model} from '../model';
import * as _ from 'lodash';

export class ShareRoute extends AbstractRoute {
    private static instance: ShareRoute;

    private constructor(private shareRepository: ShareRepository,
                        private volumeRepository: VolumeRepository) {
        super();
    }

    public static getInstance() {
        if (!ShareRoute.instance) {
            ShareRoute.instance = new ShareRoute(
                ShareRepository.getInstance(),
                VolumeRepository.getInstance()
            );
        }
        return ShareRoute.instance;
    }


    public list(volumeId: string, stack: Array<any>) {
        let columnIndex = 2,
            volumePrefix = volumeId + '/',
            mountPrefix = '/mnt/' + volumePrefix,
            shareFilter = function(share) {
                return  _.startsWith(share.target_path + '/', volumePrefix) ||
                        _.startsWith(share.target_path + '/', mountPrefix);
        };
        return this.loadListInColumn(
            stack,
            columnIndex,
            columnIndex - 1,
            '/share',
            Model.Share,
            this.shareRepository.listShares(),
            {
                filter: shareFilter,
                sort: 'name'
            }
        );
    }

    public get(volumeId: string, shareId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Share;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread((volumes: Array<any>, shares: Array<any>, uiDescriptor) => {
            let columnIndex = 3;
            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            let share = _.find(shares, {id: shareId});
            share._volume = _.find(volumes, {id: volumeId});

            stack.push({
                object: share,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: stack[columnIndex - 1],
                path: stack[columnIndex - 1].path + '/_/' + encodeURIComponent(shareId)
            });
            return stack;
        });
    }

    public selectNewType(volumeId: string, stack: Array<any>) {
        let columnIndex = 3;
        let self = this,
            objectType = Model.Share,
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: stack[columnIndex - 1],
                isCreatePrevented: true,
                path: stack[columnIndex - 1].path + '/create'
            };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes: Array<any>, uiDescriptor) {
            let volume = _.find(volumes, {id: volumeId});
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.all([
                self.shareRepository.getNewShare(volume, 'smb'),
                self.shareRepository.getNewShare(volume, 'nfs'),
                self.shareRepository.getNewShare(volume, 'afp'),
                self.shareRepository.getNewShare(volume, 'iscsi'),
                self.shareRepository.getNewShare(volume, 'webdav')
            ]).then(function(shares: Array<any>) {
                (shares as any)._objectType = objectType;
                context.object = shares;

                return self.updateStackWithContext(stack, context);
            });
        });
    }

    public create(volumeId: string, type: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Share,
            columnIndex = 3,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + type
            };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes: Array<any>, uiDescriptor) {
            let share: any = _.find(parentContext.object, {type: type});
            share._volume = _.find(volumes, {id: volumeId});
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;


            return self.updateStackWithContext(stack, context);
        });
    }
}

