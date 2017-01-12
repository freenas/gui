/**
 * @module ui/virtual-machine-datastore-nfs.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class VirtualMachineDatastoreNfs
 * @extends AbstractInspector
 */
exports.VirtualMachineDatastoreNfs = AbstractInspector.specialize(/** @lends VirtualMachineDatastoreNfs# */ {
    templateDidLoad: {
        value: function() {
            this.versionOptions = this._sectionService.NFS_DATASTORE_VERSIONS;
        }
    }
});
