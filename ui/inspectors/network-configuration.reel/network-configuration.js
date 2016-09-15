/**
 * @module ui/network-configuration.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

/**
 * @class NetworkConfiguration
 * @extends Component
 */
exports.NetworkConfiguration = AbstractInspector.specialize(/** @lends NetworkConfiguration# */ {
    exitDocument: {
        value: function() {
            this.superExitDocument();
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            this.superEnterDocument(isFirstTime);
            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this._snapshotDataObjectsIfNecessary();
            }
        }
    },

    save: {
        value: function() {
            this._dataService.saveDataObject(this.object);
            this._dataService.saveDataObject(this.object.general);
        }
    },

    revert: {
        value: function() {
            this.object.general.hostname = this._originalGeneral.hostname;
            this.object.netwait.enabled = this._originalConfiguration.netwait.enabled;
            this.object.netwait.addresses = this._originalConfiguration.netwait.addresses;
            this.object.http_proxy = this._originalConfiguration.http_proxy;
            this.object.dhcp.assign_gateway = this._originalConfiguration.dhcp.assign_gateway;
            this.object.dhcp.assign_dns = this._originalConfiguration.dhcp.assign_dns;
            this.object.gateway.ipv4 = this._originalConfiguration.gateway.ipv4;
            this.object.gateway.ipv6 = this._originalConfiguration.gateway.ipv6;
            if (this.object.status) {
                if (this._originalConfiguration.status) {
                    this.object.status.gateway.ipv4 = this._originalConfiguration.status.gateway.ipv4;
                    this.object.status.gateway.ipv6 = this._originalConfiguration.status.gateway.ipv6;
                } else {
                    this.object.status = null;
                }
            } else if (this._originalConfiguration.status) {
                this.object.status = {};
                this.object.status.gateway.ipv4 = this._originalConfiguration.status.gateway.ipv4;
                this.object.status.gateway.ipv6 = this._originalConfiguration.status.gateway.ipv6;
            }
            this.object.dns.search = this._originalConfiguration.dns.search;
            this.object.dns.addresses = this._originalConfiguration.dns.addresses;
        }
    },
    
    _snapshotDataObjectsIfNecessary: {
        value: function() {
            if (!this._originalConfiguration) {
                this._originalConfiguration = this._dataService.clone(this.object);
            }
            if (!this._originalGeneral) {
                this._originalGeneral = this._dataService.clone(this.object.general);
            }
        }
    }
});
