/**
 * @module ui/containers.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Containers
 * @extends Component
 */
exports.Containers = Component.specialize(/** @lends Containers# */ {
    enterDocument: {
        value: function () {
            this._fetchDataIfNeeded();
        }  
    },

    _fetchDataIfNeeded: {
        value: function () {
            if (!this._containers) {
                var self = this;

                return this.application.dataService.fetchData(Model.DockerContainer).then(function (containers) {
                    self._containers = containers;
                });
            }
        } 
    }

});
