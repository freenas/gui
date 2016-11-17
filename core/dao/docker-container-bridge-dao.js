/**
 * @module core/dao/docker-container-bridge-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class DockerContainerBridgeDao
 * @extends AbstractDao
 */
exports.DockerContainerBridgeDao = AbstractDao.specialize(/** @lends DockerContainerBridgeDao# */ {
    init: {
        value: function DockerContainerBridgeDao() {
            this._model = this.constructor.Model.DockerContainerBridge;
        }
    }
});
