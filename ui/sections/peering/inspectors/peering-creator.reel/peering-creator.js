var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.PeeringCreator = AbstractInspector.specialize({

    newSsh: {
        value: null
    },

    newAmazonS3: {
        value: null
    },

    newFreenas: {
        value: null
    },

    newVmware: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },

    enterDocument: {
        value: function () {
            this._populateNewPeerObjectList();
        }
    },

    _populateNewPeerObjectList: {
        value: function () {
            var self = this;
            Promise.all([
                this._sectionService.getNewPeerWithType(this._sectionService.PEER_TYPES.SSH),
                this._sectionService.getNewPeerWithType(this._sectionService.PEER_TYPES.FREENAS),
                this._sectionService.getNewPeerWithType(this._sectionService.PEER_TYPES.AMAZON_S3),
                this._sectionService.getNewPeerWithType(this._sectionService.PEER_TYPES.VMWARE),
            ]).spread(function (sshPeer, freenasPeer, s3Peer, vmwarePeer) {
                self.newSsh = sshPeer;
                self.newFreenas = freenasPeer;
                self.newAmazonS3 = s3Peer;
                self.newVmware = vmwarePeer;
            });
        }
    }
});
