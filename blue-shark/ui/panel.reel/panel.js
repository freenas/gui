/**
 * @module ui/panel.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Panel
 * @extends Component
 */
exports.Panel = Component.specialize(/** @lends Panel# */ {
    _status: {
        value: null
    },

    status: {
        get: function() {
            return this._status;
        },
        set: function(value) {
            if (value != this._status) {
                switch(value) {
                    case 'warn':
                        this.classList.add('is-warning');
                        this.classList.remove('is-error');
                        this._status = value;
                        break;
                    case 'error':
                        this.classList.add('is-error');
                        this.classList.remove('is-warning');
                        this._status = value;
                        break;
                    case 'default':
                        this.classList.remove('is-error');
                        this.classList.remove('is-warning');
                        this._status = value;
                        break;
                }
            }
        }
    }
});
