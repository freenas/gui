/**
 * @module ui/sections/peering/peering.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Peering
 * @extends Component
 */
exports.Peering = Component.specialize(/** @lends Peering# */ {
    templateDidLoad: {
        value: function() {
            var self = this;
            this._peeringService = this.application.peeringService;
            this._peeringService.list().then(function(peers) {
                self.peers = peers;
            })
        }
    }
});
