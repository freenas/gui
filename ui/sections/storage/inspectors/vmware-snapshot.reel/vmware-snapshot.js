var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    VmwareDatasetFilterOp = require("core/model/enumerations/VmwareDatasetFilterOp").VmwareDatasetFilterOp;

exports.VmwareSnapshot = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this.datastoreOptions = [];
            this._sectionService.listPeers().then(function(peers) {
                self.peerOptions = peers;
                self._handlePeerChange();
            });
            this.filterOptions = this.cleanupEnumeration(VmwareDatasetFilterOp).map(function(x) {
                return {
                    value: x,
                    label: x
                };
            });
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            if (isFirstTime) {
                this.addPathChangeListener("object.peer", this, "_handlePeerChange");
            }
            if (this.object.vm_filter_op === null) {
                this.object.vm_filter_op = "NONE";
            }
        }
    },

    revert: {
        value: function() {
            this.super();
            if (this.object.vm_filter_op === null) {
                this.object.vm_filter_op = "NONE";
            }
        }
    },

    _handlePeerChange: {
        value: function() {
            var self = this,
                peer;
            this.datastoreOptions = [];

            if (this.object.peer) {
                for (var i = 0, length = this.peerOptions.length; i < length; i++) {
                    if (this.peerOptions[i].id === this.object.peer) {
                        peer = this.peerOptions[i];
                        break;
                    }
                }
                var tmp = this.object.datastore;
                this._sectionService.listVmwareDatastores(peer, false).then(function(datastores) {
                    self.datastoreOptions = datastores.map(function(x) {
                        return { label: x.name, value: x.name };
                    });
                    self.object.datastore = null;
                    self.object.datastore = tmp;
                });
            }
        }
    }
});
