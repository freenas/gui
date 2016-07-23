/**
 * @module ui/link-status.reel
 */
var Component = require("montage/ui/component").Component,
    Bindings  = require("montage/core/core").Bindings;

/**
 * @class LinkStatus
 * @extends Component
 */
exports.LinkStatus = Component.specialize(/** @lends LinkStatus# */ {
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
                this._setInterfaceStatus();
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
                this._setInterfaceStatus();
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                Bindings.defineBinding(this, "linkState", {"<-": "status"});
                Bindings.defineBinding(this, "isCardEnabled", {"<-": "enabledState"});
            }
        }
    },

    _setInterfaceStatus: {
        value: function() {
            if (this.isCardEnabled) {
                switch (this.linkState) {
                    case "LINK_STATE_UP":
                        this.interfaceStatus = 'Active';
                        break;
                    case "LINK_STATE_UNKNOWN":
                        this.interfaceStatus = 'Unknown';
                        break;
                    case "LINK_STATE_DOWN":
                        this.interfaceStatus = 'Down';
                        break;
                }
            } else {
                this.interfaceStatus = 'Disabled';
            }
        }
    }
});
