/**
 * @module core/dao/vmware-dataset-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class VmwareDatasetDao
 * @extends AbstractDao
 */
exports.VmwareDatasetDao = AbstractDao.specialize(/** @lends VmwareDatasetDao# */ {
    init: {
        value: function() {
            this._model = this.constructor.Model.VmwareDataset;
        }
    }
});
