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
            var type;
            if (this.object) {
                type = this.object.type === "freenas" && this.object._isNew ? "ssh" : this.object.type;
            }
            return type;
        }
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this._peeringService = this.application.peeringService;
            this.typeOptions = this._peeringService.getSupportedTypes().map(function(x) {
                return {
                    label: x,
                    value: x
                };
            });
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
