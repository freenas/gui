var Component = require("montage/ui/component").Component;

/**
 * @class NetworkInterface
 * @extends Component
 */
exports.NetworkInterface = Component.specialize({
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
            if (this._object != object) {
                this._object = object;

                if (object) {
                    var self = this;
                    this.application.networkInterfacesSevice.getNetworkInterfaces().then(function (networkInterfaces) {
                        self.interfaces = networkInterfaces;
                    }).then(function() {
                        self.isAddressSourceDhcp = !!object.dhcp;
                        if (self.isAddressSourceDhcp) {
                            self.dhcpAlias = object.status.aliases.filter(function(x) { return x.type === "INET" })[0];
                        }
                        self.staticIP = object.aliases.slice(0, 1)[0];
                        self.otherAliases = object.aliases.slice(1);
                    });

                }
            }
        }
    },

    _flattenAliases: {
        value: function () {
            this._object.aliases = [this.staticIP].concat(this.otherAliases).filter(function (x) { return !!x });
        }
    },

    save: {
        value: function() {
            this._flattenAliases();
            return this.application.dataService.saveDataObject(this.object);
        }
    },

    exitDocument: {
        value: function() {
            this._flattenAliases();
        }
    }
});
