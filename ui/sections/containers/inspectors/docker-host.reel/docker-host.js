/**
 * @module ui/docker-host.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerHost
 * @extends Component
 */
exports.DockerHost = AbstractInspector.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this.DEFAULT_STRING = this._sectionService.DEFAULT_STRING;

                this._sectionService.listDatastores().then(function(datastores) {
                    self._datastores = datastores;
                });
            }

            this._sectionService.initializeDockerHost(this.object);
        }
    }
});
