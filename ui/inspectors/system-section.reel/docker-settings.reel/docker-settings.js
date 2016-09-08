/**
 * @module ui/docker-settings.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class DockerSettings
 * @extends Component
 */
exports.DockerSettings = Component.specialize(/** @lends DockerSettings# */ {

    apiForwardingAddress: {
        value: null
    },

    enterDocument: {
        value: function(isFirstTime) {
            var self = this;
                this.apiForwardingAddress = [];
            if(isFirstTime) {
                this.isLoading = true;
                this.application.dockerSettingsService.getDockerHostQueryData().then(function(dockerHosts) {
                    self.dockerHosts = dockerHosts;
                })
                this.application.dockerSettingsService.getDockerConfigData().then(function (dockerConfig) {
                    self.object = dockerConfig;
                    var api_forwarding_list = dockerConfig.api_forwarding.split(",")
                    if(dockerConfig.api_forwarding && dockerConfig.api_forwarding.length > 0) {
                        for (var i in api_forwarding_list) {
                           self.apiForwardingAddress.push({"id": api_forwarding_list[i].trim(), "name": api_forwarding_list[i].trim()});
                        }
                    }
                    self._snapshotDataObjectsIfNecessary();
                });
                self.isLoading = false;
            }
        }
    },

    save: {
        value: function() {
            var configData = {}
            configData["default_host"] = this.object.default_host;
            configData["api_forwarding_enable"] = this.object.api_forwarding_enable;
            configData["api_forwarding"] = this.object.api_forwarding;
            return this.application.dockerSettingsService.saveDockerConfigData(configData);
        }
    },

    revert: {
        value: function() {
            this.object.api_forwarding_enable = this._object.api_forwarding_enable;
            this.object.default_host = this._object.default_host;
            this.object.api_forwarding = this._object.api_forwarding;
        }
    },

    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if(!this._object) {
                this._object = this.application.dataService.clone(this.object);
            }
        }
    }
});
