var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    UnixPermissionsConverter = require("core/converter/unix-permissions-converter").UnixPermissionsConverter;

/**
 * @class UnixPermissions
 * @extends Component
 */
exports.UnixPermissions = AbstractComponentActionDelegate.specialize({
    converter: {
        value: new UnixPermissionsConverter()
    },

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
            mode = ''+mode || '000';
            if (this._modeBits != mode && mode.length == 3) {
                this._modeBits = mode;
                this.modes = this.converter.revert(mode);
            }
        }
    },

    handleAction: {
        value: function () {
            this.modeBits = this.converter.convert(this.modes);
        }
    },

    modeBitsInputDelegate: {
        get: function() {
            var self = this;
            return {
                didEndEditing: function() {
                    self.dispatchOwnPropertyChange('modeBits', self.modeBits);                 
                }
            }
        }
    }
});
