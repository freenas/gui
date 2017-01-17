/**
 * @module ui/docker-logs.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerLogs
 * @extends Component
 */
exports.DockerLogs = AbstractInspector.specialize(/** @lends DockerLogs# */ {

    enterDocument: {
        value: function () {
            var self = this,
                dockerContainerId = this.context.parentContext.object.id;

            return this._sectionService.getSerialTokenWithDockerContainerId(dockerContainerId).then(function(token) {
                self.token = token;
            });
        }
    }
});
