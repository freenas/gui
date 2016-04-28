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
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    var self = this;
                    this.application.networkInterfacesSevice.getNetworkInterfaces().then(function (networkInterfaces) {
                        self.interfaces = networkInterfaces;
                    }).then(function() {
                        var aliasesLength = object.aliases.length;

                        if ((self.isAddressSourceDhcp = !!object.dhcp)) {
                            self.dhcpAlias = object.status.aliases.filter(function(x) { return x.type === "INET" })[0];
                        }

                        if (aliasesLength) {
                            self.staticIP = object.aliases.slice(0, 1)[0];

                            if (aliasesLength > 1) {
                                self.otherAliases = object.aliases.slice(1);
                            }
                        }
                    });
                }
            }
        }
    },

    _flattenAliases: {
        value: function () {
            var aliases = this._object.aliases,
                otherAliases = this.otherAliases,
                aliasesLength = aliases.length,
                otherAliasesLength = otherAliases.length;

            for (var i = 0, j = 1; i < otherAliasesLength; i++ , j++) {
                if (j < aliasesLength) {
                    if (aliases[j] !== otherAliases[i]) {
                        aliases[j] = otherAliases[i];
                    }
                } else {
                    aliases[j] =  otherAliases[i];
                }
            }

            if (++otherAliasesLength < aliases.length) { //aliases's length may have changed
                aliases.splice(j, aliasesLength - otherAliasesLength);
            }
        }
    },

    save: {
        value: function() {
            this._flattenAliases();
            return this.application.dataService.saveDataObject(this.object);
        }
    }
});
