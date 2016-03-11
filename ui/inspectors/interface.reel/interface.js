var Component = require("montage/ui/component").Component,
    NetworkInterfaceType = require("core/model/enumerations/network-interface-type").NetworkInterfaceType,
    Model = require("core/model/model").Model,
    Bindings = require("montage/core/core").Bindings;

/**
 * @class Interface
 * @extends Component
 */
exports.Interface = Component.specialize({
    _statusClasses: {
        value: [
            'is-up',
            'is-unknown',
            'is-down',
            'is-disabled'
        ]
    },

    interfaceStatus: {
        value: null
    },

    _linkState: {
        value: null
    },

    linkState: {
        get: function() {
            return this._linkState;
        },
        set: function(linkState) {
            if (this._linkState != linkState) {
                this._linkState = linkState;
                this._assignIconClass();
            }
        }
    },

    _cardEnabled: {
        value: null
    },

    isCardEnabled: {
        get: function() {
            return this._cardEnabled;
        },
        set: function(cardEnabled) {
            if (this._cardEnabled != cardEnabled) {
                this._cardEnabled = cardEnabled;
                this._assignIconClass();
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                Bindings.defineBinding(this, "linkState", {"<-": "object.status.link_state"});
                Bindings.defineBinding(this, "isCardEnabled", {"<-": "object.enabled"});
            }
        }
    },

    _object: {
        value: null
    },

    dhcpAlias: {
        value: null
    },

    staticIP: {
        value: null
    },

    otherAliases: {
        value: null
    },

    ipAddressSource: {
        value: null
    },

    constructor: {
        value: function() {
            this.super();
            this.dhcpAlias =
                {address: "",
                 netmask: null,
                 type: "INET" };
        }
    },

    save: {
        value: function() {
            this.application.dataService.saveDataObject(this.object);
        }
    },

    object: {
        set: function (networkInterface) {
            if (networkInterface && networkInterface.type === NetworkInterfaceType.ETHER) {
                this._object = networkInterface;

                if (networkInterface) {
                    if (networkInterface.dhcp) {
                        this.ipAddressSource = "dhcp";
                        // The first and only ipv4 address in the read-only aliases is
                        // always the one assigned by dhcp if dhcp is enabled.
                        // Otherwise the one pre-set in the inspector applies.
                        for (var i = 0, length = networkInterface.status.aliases.length; i < length; i++) {
                            if (networkInterface.status.aliases[i].type === "INET") {
                                this.dhcpAlias = networkInterface.status.aliases[i];
                                break;
                            }
                        }
                    } else {
                        this.ipAddressSource = "static";
                    }
                    // This always applies, in case they switch off DHCP
                    this.staticIP = networkInterface.aliases.slice(0, 1);
                    this.otherAliases = networkInterface.aliases.slice(1);
                }
            } else {
                this._object = null;
            }
        }
    ,
        get: function () {
            var newObject = new Object(this._object);
            newObject.aliases = this.staticIP.concat(this.otherAliases).filter(function (alias) { return !!alias; });
            return newObject;
        }
    },

    _assignIconClass: {
        value: function() {
            if (this.isCardEnabled) {
                switch (this.linkState) {
                    case "LINK_STATE_UP":
                        this._activateIconClass('is-up');
                        this.interfaceStatus = 'Active';
                        break;
                    case "LINK_STATE_UNKNOWN":
                        this._activateIconClass('is-unknown');
                        this.interfaceStatus = 'Unknown';
                        break;
                    case "LINK_STATE_DOWN":
                        this._activateIconClass('is-down');
                        this.interfaceStatus = 'Down';
                        break;
                }
            } else {
                this._activateIconClass('is-disabled');
                this.interfaceStatus = 'Disabled';
            }
        }
    },

    _activateIconClass: {
        value: function(className) {
            var i, length, statusClass;
            for (i = 0, length = this._statusClasses.length; i < length; i++) {
                statusClass = this._statusClasses[i];
                if (statusClass === className) {
                    this.status.classList.add(className);
                } else {
                    this.status.classList.remove(statusClass);
                }
            }
        }
    }

});
