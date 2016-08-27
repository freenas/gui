/**
 * @module ui/sections/replication/replication.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Replication
 * @extends Component
 */
exports.Replication = Component.specialize(/** @lends Replication# */ {
    templateDidLoad: {
        value: function() {
            var self = this;
            this.application.replicationService.listReplicationLinks().then(function(replicationLinks) {
                self.replicationLinks = replicationLinks;
            })
        }
    }
});
