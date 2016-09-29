var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    NetworkSectionService = require("core/service/section/network-section-service").NetworkSectionService;

/**
 * @class NetworkInterface
 * @extends Component
 */
exports.NetworkInterface = AbstractInspector.specialize({
    isAddressSourceDhcp: {
        value: null
    },

    dhcpAlias: {
        value: null
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                this._object = object;
            }
        }
    },

    templateDidLoad: {
        value: function() {
            this.interfaces = this._sectionService.entries;
        }
    },

    enterDocument: {
        value: function() {
            this.$super.enterDocument();
            this._sectionService.initializeInterface(this.object);
            this.addPathChangeListener('object.dhcp', this, '_handleDhcpChange');
        }
    },

    exitDocument: {
        value: function() {
            this.$super.exitDocument();
        }
    },

    _handleDhcpChange: {
        value: function() {
            this._sectionService.handleDhcpChangeOnInterface(this.object);
        }
    },

    save: {
        value: function() {
            return this._sectionService.saveInterface(this.object);
        }
    },

    revert: {
        value: function() {
            var self = this;
            return this.inspector.revert().then(function() {
                self.object.type = self.interfaceType;
            });
        }
    }
});
