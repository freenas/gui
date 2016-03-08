/**
 * @requires montage/core/converter/converter
 */
var Converter = require("montage/core/converter/converter").Converter;
var Montage = require("montage/core/core").Montage;
var IPv4Validator = require("core/converter/validator/ipv4-validator").IPv4Validator;

/**
 * Converts an interface alias to and from <$IP_ADDRESS>/<$NETMASK> form. Assumes
 * an alias of the shape defined by the FreeNAS Middleware and that the input for
 * reversion is already
 * @class InterfaceAliasConverter
 * @extends Converter
 */
 var InterfaceAliasConverter = exports.InterfaceAliasConverter = Converter.specialize({

    constructor: {
        value: function() {
            this.super();
            this.validator = new IPv4Validator();
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
            this._alias = alias;
            var aliasString = "";

            if (alias && alias.address) {
                aliasString += alias.address;
                if (alias.netmask) {
                    aliasString += "/" + alias.netmask;
                }
            }

            return aliasString;
        }
    },

    revert: {
        value: function (value) {
            var aliasParts = value.split("/");
            if (aliasParts[0]) {
                this._alias.address = aliasParts[0];
                // TODO: Check which type of IP this is; assign `type` accordingly;
                this._alias.type = "INET";
            } else {
                // FIXME: Does this need a fallback case to be safe/have expected
                // behavior?
            }
            if (aliasParts[1]) {
                this._alias.netmask = aliasParts[0];
            } else {
                // FIXME: Does this need a fallback case to be safe/have expected
                // behavior?
            }

            return this.__alias;
        }
    },

    // TODO: This should accept ipv6 addresses, and should check both ipv4 and
    // ipv6 addresses for their respective netmask requirements. This may be
    // done with additional validators.
    validator: {
        value: null
    }
 });
