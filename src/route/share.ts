import {ShareRepository} from "../repository/share-repository";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {VolumeRepository} from "../repository/volume-repository";
import {ModelEventName} from "../model-event-name";
import {DataObjectChangeService} from "../service/data-object-change-service";
import {AbstractRoute} from "./abstract-route";
import Promise = require("bluebird");
import _ = require("lodash");
import {Model} from "../model";

export class ShareRoute extends AbstractRoute {
    private static instance: ShareRoute;

    private constructor(private shareRepository: ShareRepository,
                        private volumeRepository: VolumeRepository,
                        eventDispatcherService: EventDispatcherService,
                        private modelDescriptorService: ModelDescriptorService,
                        private dataObjectChangeService: DataObjectChangeService) {
        super(eventDispatcherService);
    }

    public static getInstance() {
        if (!ShareRoute.instance) {
            ShareRoute.instance = new ShareRoute(
                ShareRepository.getInstance(),
                VolumeRepository.getInstance(),
                EventDispatcherService.getInstance(),
                ModelDescriptorService.getInstance(),
                new DataObjectChangeService()
            );
        }
        return ShareRoute.instance;
    }


    public list(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Share;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, shares, uiDescriptor) {
            while (stack.length > 2) {
                let oldContext = stack.pop();
                if (oldContext && oldContext.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[oldContext.objectType].listChange, oldContext.changeListener);
                }
            }

            let shareFilter = function(share) {
                return  _.startsWith(share.target_path + '/', volumeId + '/') ||
                        _.startsWith(share.target_path + '/', '/mnt/' + volumeId + '/');
            };
            let filteredShares = _.filter(shares, shareFilter);
            filteredShares._objectType = objectType;

            let context = {
                object: filteredShares,
                userInterfaceDescriptor: uiDescriptor,
                columnIndex: 2,
                objectType: objectType,
                parentContext: stack[1],
                path: stack[1].path + '/share',
                changeListener: self.eventDispatcherService.addEventListener(ModelEventName.Share.listChange, function(state) {
                    self.dataObjectChangeService.handleDataChange(filteredShares, state);
                    for (let i = filteredShares.length - 1; i >= 0; i--) {
                        if (!shareFilter(filteredShares[i])) {
                            filteredShares.splice(i, 1);
                        }
                    }
                })
            };

            stack.push(context);
            return stack;
        });
    }

    public get(volumeId: string, shareId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Share;
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.shareRepository.listShares(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, shares, uiDescriptor) {
            while (stack.length > 3) {
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
                columnIndex: 3,
                objectType: objectType,
                parentContext: stack[2],
                path: stack[2].path + '/share/_/' + encodeURIComponent(shareId)
            });
            return stack;
        });
    }

    public selectNewType(volumeId: string, stack: Array<any>) {
        let self = this,
            objectType = Model.Share,
            context: any = {
                columnIndex: 3,
                objectType: objectType,
                parentContext: stack[2],
                isCreatePrevented: true,
                path: stack[2].path + '/create'
            };
        return Promise.all([
            this.volumeRepository.listVolumes(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(volumes, uiDescriptor) {
            let volume = _.find(volumes, {id: volumeId});
            context.userInterfaceDescriptor = uiDescriptor;
            return Promise.all([
                self.shareRepository.getNewShare(volume, 'smb'),
                self.shareRepository.getNewShare(volume, 'nfs'),
                self.shareRepository.getNewShare(volume, 'afp'),
                self.shareRepository.getNewShare(volume, 'iscsi'),
                self.shareRepository.getNewShare(volume, 'webdav')
            ]).then(function(shares) {
                shares._objectType = objectType;
                context.object = shares;

                return self.updateStackWithContext(stack, context);
            })
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
        ]).spread(function(volumes, uiDescriptor) {
            let share = _.find(parentContext.object, {type: type});
            share._volume = _.find(volumes, {id: volumeId});
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;


            return self.updateStackWithContext(stack, context);
        });
    }
}

