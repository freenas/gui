/**
 * @module ui/sections/peering/inspectors/peer.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class Peer
 * @extends Component
 */
exports.Peer = AbstractInspector.specialize(/** @lends Peer# */ {
    credentialsType: {
        get: function() {
            return this.object.type;
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            var self = this;
            this._peeringService = this.application.peeringService;
            this._peeringService.getSupportedTypes().then(function (peerTypes) {
                self.typeOptions = peerTypes;
            })
        }
    },


    enterDocument: {
        value: function() {
            this.super();
            if (this.object && this.object._isNew) {
                var self = this;
                this._peeringService.populateDefaultType(this.object).then(function() {
                    self.dispatchOwnPropertyChange("credentialsType", self.credentialsType);
                });
            }
        }
    },

    save: {
        value: function() {
            if (this.credentialsComponent && typeof this.credentialsComponent.save === "function") {
                this.credentialsComponent.save();
            }
            this.inspector.save();
        }
    }
});
