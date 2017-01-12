/**
 * @module ui/docker-network.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class DockerNetwork
 * @extends Component
 */
exports.DockerNetwork = AbstractInspector.specialize({

     _inspectorTemplateDidLoad: {
        value: function () {
            var self = this;

            return Promise.all([
                this._sectionService.listDockerHosts(),
                this._sectionService.listDockerContainers()
            ]).then(function (data) {
                self._dockerHosts = data[0];
                self._dockerContainers = data[1];
            });
        }
    }

});
