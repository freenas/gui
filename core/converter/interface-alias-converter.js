/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;
var IPv4WithNetmaskValidator = require("core/converter/validator/ipv4-with-netmask-validator").IPv4WithNetmaskValidator;

/**
 * Converts an interface alias to and from <$IP_ADDRESS>/<$NETMASK> form. Assumes
 * an alias of the shape defined by the FreeNAS Middleware and that the input for
 * reversion is already
 * @class InterfaceAliasConverter
 * @extends Converter
 */
 exports.InterfaceAliasConverter = Converter.specialize({

    constructor: {
        value: function() {
            this.super();
            this.validator = new IPv4WithNetmaskValidator();
        }
    },

    __alias: {
        value: null
    },


    _alias: {
        set: function (alias) {
            this.__alias = alias;
        },
        get: function () {
            return this.__alias || (this.__alias = {});
        }
    },

    convert: {
        value: function (alias) {
            var result;
            if (typeof alias === 'string') {
                result = alias;
            } else {
                this._alias = alias;

                if (alias && alias.address) {
                    result = alias.address;
                    if (alias.netmask) {
                        result += "/" + alias.netmask;
                    }
                }
            }
            return result;
        }
    },

    revert: {
        value: function (value) {
            var result;
            if (this.validator.validate(value)) {
                var aliasParts = value.split("/");
                if (typeof aliasParts[0] === "string") {
                    if (aliasParts[0] === "") {
                        this._alias.address = null;
                        this._alias.type = null;
                    } else {
                        this._alias.address = aliasParts[0];
                        // TODO: Check which type of IP this is; assign `type` accordingly;
                        this._alias.type = "INET";
                    }
                } else {
                    // FIXME: Does this need a fallback case to be safe/have expected
                    // behavior?
                }
                if (aliasParts[1]) {
                    if (typeof aliasParts[1] === "string") {
                        if (aliasParts[1] === "") {
                            this._alias.netmask = null;
                        } else {
                            this._alias.netmask = parseInt(aliasParts[1], 10);
                        }
                    } else {
                        // FIXME: Does this need a fallback case to be safe/have expected
                        // behavior?
                    }
                } else {
                    this._alias.netmask = null;
                }
                result = this.__alias;
            } else {
                result = value;
            }
            return result;
        }
    },

    // TODO: This should accept ipv6 addresses, and should check both ipv4 and
    // ipv6 addresses for their respective netmask requirements. This may be
    // done with additional validators.
    validator: {
        value: null
    }
 });
