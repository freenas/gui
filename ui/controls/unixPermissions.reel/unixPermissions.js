var Component = require("montage/ui/component").Component;

/**
 * @class UnixPermissions
 * @extends Component
 */
exports.UnixPermissions = Component.specialize({
    _READ: {
        value: 4
    },

    _WRITE: {
        value: 2
    },

    _EXECUTE: {
        value:1
    },

    _modes: {
        value: null
    },

    modes: {
        get: function() {
            return this._modes
        },
        set: function(modes) {
            if (this._modes != modes) {
                this._modes = modes;
                this.modeBits = this.converter.convert(modes);
            }
        }
    },

    _modeBits: {
        value: null
    },

    modeBits: {
        get: function() {
            return this._modeBits;
        },
        set: function(mode) {
            mode = ''+mode;
            if (this._modeBits != mode && mode.length == 3) {
                this._modeBits = mode;
                this.modes = this.converter.revert(mode);
            }
        }
    },

    handleAction: {
        value: function(event) {
            this.modeBits = this.converter.converter(this.modes);
        }
    }
});
