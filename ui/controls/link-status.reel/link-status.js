/**
 * @module ui/link-status.reel
 */
var Component = require("montage/ui/component").Component,
    Bindings  = require("montage/core/core").Bindings;;

/**
 * @class LinkStatus
 * @extends Component
 */
exports.LinkStatus = Component.specialize(/** @lends LinkStatus# */ {
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
                Bindings.defineBinding(this, "linkState", {"<-": "status"});
                Bindings.defineBinding(this, "isCardEnabled", {"<-": "enabledState"});
            }
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
                    this.classList.add(className);
                } else {
                    this.classList.remove(statusClass);
                }
            }
        }
    }
});
