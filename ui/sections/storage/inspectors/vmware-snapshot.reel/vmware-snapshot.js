var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    VmwareDatasetFilterOp = require("core/model/enumerations/vmware-dataset-filter-op").VmwareDatasetFilterOp;

/**
 * @class VmwareSnapshot
 * @extends Component
 */
exports.VmwareSnapshot = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this.datastoreOptions = [];
            this._sectionService.listPeers().then(function(peers) {
                self.peerOptions = peers;
            });
            this.filterOptions = VmwareDatasetFilterOp.members.map(function(x) {
                return {
                    value: x,
                    label: x
                };
            });
        }
    },

    _context: {
        value: null
    },

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
            this._loadParentDataset();
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
            }
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
            this._loadParentDataset();
        }
    },

    _loadParentDataset: {
        value: function() {
            var dataset = this._getCurrentDataset();
            if (dataset) {
                this._object.dataset = dataset.id;
            }
        }
    },

    _getCurrentDataset: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == this._sectionService.VOLUME_DATASET_TYPE) {
                        return currentSelection[i];
                    }
                }
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
