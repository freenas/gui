import _ = require("lodash");
import Promise = require("bluebird");
import {ModelEventName} from "../model-event-name";
import {EventDispatcherService} from "../service/event-dispatcher-service";
import {ModelDescriptorService} from "../service/model-descriptor-service";
import {PeerRepository} from "../repository/peer-repository";
import {AbstractRoute} from "./abstract-route";

export class PeeringRoute extends AbstractRoute {
    private static instance: PeeringRoute;

    private objectType: string;

    private constructor(private modelDescriptorService: ModelDescriptorService,
                        eventDispatcherService: EventDispatcherService,
                        private peerRepository: PeerRepository) {
        super(eventDispatcherService);
        this.objectType = 'Peer';
    }

    public static getInstance() {
        if (!PeeringRoute.instance) {
            PeeringRoute.instance = new PeeringRoute(
                ModelDescriptorService.getInstance(),
                EventDispatcherService.getInstance(),
                PeerRepository.getInstance()
            );
        }
        return PeeringRoute.instance;
    }

    public get(peerId: string, stack: Array<any>) {
        let self = this,
            objectType = this.objectType,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/peer/_/' + encodeURIComponent(peerId)
            };
        return Promise.all([
            this.peerRepository.listPeers(),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(peers, uiDescriptor) {
            context.object = _.find(peers, {id: peerId});
            context.userInterfaceDescriptor = uiDescriptor;

            while (stack.length > columnIndex) {
                let context = stack.pop();
                if (context && context.changeListener) {
                    self.eventDispatcherService.removeEventListener(ModelEventName[context.objectType].listChange, context.changeListener);
                }
            }

            stack.push(context);
            return stack;
        });
    }

    public selectNewPeerType(stack: Array<any>) {
        let self = this,
            objectType = this.objectType,
            columnIndex = 1,
            parentContext = stack[columnIndex-1],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                isCreatePrevented: true,
                path: parentContext.path + '/create'
            };
        return Promise.all([
            Promise.all(_.map(_.values(PeerRepository.PEER_TYPES), (type) => this.peerRepository.getNewPeerWithType(type))),
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(peers, uiDescriptor) {
            peers._objectType = objectType;
            context.object = _.compact(peers);
            context.userInterfaceDescriptor = uiDescriptor;
            return self.updateStackWithContext(stack, context);
        });
    }

    public create(peerType: string, stack:Array<any>) {
        let self = this,
            objectType = this.objectType,
            columnIndex = 1,
            parentContext = stack[columnIndex],
            context: any = {
                columnIndex: columnIndex,
                objectType: objectType,
                parentContext: parentContext,
                path: parentContext.path + '/' + peerType
            };
        return Promise.all([
            this.modelDescriptorService.getUiDescriptorForType(objectType)
        ]).spread(function(uiDescriptor) {
            let share = _.find(parentContext.object, {_tmpId: peerType});
            context.userInterfaceDescriptor = uiDescriptor;
            context.object = share;
            return self.updateStackWithContext(stack, context);
        });

    }
}
