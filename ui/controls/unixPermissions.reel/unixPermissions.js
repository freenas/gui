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
                this._calculateModeBits();
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
            if (this._modeBits != mode && mode.length == 3) {
                this._modeBits = mode;
                this._calculateFlags();
            }
        }
    },

    _calculateFlags: {
        value: function() {
            if (this._modeBits.length == 3) {
                this._assignFlagsForSingleType(+this._modeBits[0], this.modes.user);
                this._assignFlagsForSingleType(+this._modeBits[1], this.modes.group);
                this._assignFlagsForSingleType(+this._modeBits[2], this.modes.others);
            }
        }
    },

    _assignFlagsForSingleType: {
        value: function(octal, userType) {
            var binary = ("000" + octal.toString(2)).slice(-3);
            userType.read = !!+binary[0];
            userType.write = !!+binary[1];
            userType.execute = !!+binary[2];
        }
    },

    _calculateModeBits: {
        value: function () {
            var modeBits = "";
            if (this.modes) {
                modeBits += this._getModeForUserType(this.modes.user);
                modeBits += this._getModeForUserType(this.modes.group);
                modeBits += this._getModeForUserType(this.modes.others);
            }
            this._modeBits = this.modeBits = modeBits;
        }
    },

    _getModeForUserType: {
        value: function(userType) {
            return  userType.read*4 +
                    userType.write*2 +
                    userType.execute;
        }
    },

    handleAction: {
        value: function(event) {
            this._calculateModeBits();
        }
    }
});
