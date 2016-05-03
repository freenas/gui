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
                        if ((self.isAddressSourceDhcp = !!object.dhcp)) {
                            self.dhcpAlias = object.status.aliases.filter(function(x) { return x.type === "INET" })[0];
                        }

                        self.handleAliasesChange();
                    });
                }
            }
        }
    },

    enterDocument: {
        value: function () {
            this._subscribeToAliasesChanges();
        }
    },

    exitDocument: {
        value: function () {
            this._unsubscribeToAliasesChangesIfNeeded();

            // set to null in order to apply hypothetical changes from the middleware
            // if the same object is coming back.
            this._object = null;
        }
    },

    _unsubscribeToAliasesChangesIfNeeded: {
        value: function () {
            if (this._unsubscribeToAliasesChanges) {
                this._unsubscribeToAliasesChanges();
                this._unsubscribeToAliasesChanges = null;
            }
        }
    },

    /**
     * @private
     */
    _subscribeToAliasesChanges: {
        value: function () {
            this._unsubscribeToAliasesChanges = this.addRangeAtPathChangeListener("object.aliases", this, "handleAliasesChange");
        }
    },

    handleAliasesChange: {
        value: function () {
            if (this.object) {
                var aliases = this.object.aliases,
                    aliasesLength = aliases.length;

                if (aliasesLength) {
                    this.staticIP = aliases.slice(0, 1)[0];

                    if (aliasesLength > 1) {
                        this.otherAliases = aliases.slice(1);
                    }
                }
            }
        }
    },

    _flattenAliases: {
        value: function () {
            this._unsubscribeToAliasesChangesIfNeeded();

            var aliases = this._object.aliases,
                otherAliases = this.otherAliases,
                aliasesLength = aliases.length,
                otherAliasesLength = otherAliases.length;

            for (var i = 0, j = 1; i < otherAliasesLength; i++ , j++) {
                if (j < aliasesLength) {
                    if (aliases[j] !== otherAliases[i]) {
                        aliases.splice(j, 1, otherAliases[i]);
                    }
                } else {
                    aliases.push(otherAliases[i]);
                }
            }

            if (++otherAliasesLength < aliases.length) { //aliases's length may have changed
                aliases.splice(j, aliasesLength - otherAliasesLength);
            }

            this._subscribeToAliasesChanges();
        }
    },

    save: {
        value: function() {
            this._flattenAliases();
            return this.application.dataService.saveDataObject(this.object);
        }
    }
});
