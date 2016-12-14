/**
 * @module ui/disconnection-modal.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class DisconnectionModal
 * @extends Component
 */
exports.DisconnectionModal = Component.specialize(/** @lends DisconnectionModal# */ {

    _isConnected: {
        value: null
    },

    isConnected: {
        get: function () {
            return this._isConnected;
        },
        set: function (value) {
            if (value == 'DISCONNECTED') {
                if (window.location.hash.length === 0) {
                    window.location.hash = '#';
                }
                if (window.location.hash.indexOf(';disconnected') === -1) {
                    window.location.hash += ';disconnected';
                }
                location.reload();
            }
            if(this._isConnected != value) {
                this._isConnected = value;
            }
        }
    }
});
