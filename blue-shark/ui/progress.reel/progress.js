/**
 * @module ui/progress.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Progress
 * @extends Component
 */
exports.Progress = Component.specialize(/** @lends Progress# */ {

    _percentageComplete: {
        value: null
    },

    statusClassMap: {
        value: {
            "success": "has-success",
            "error": "has-error",
            "active": "is-active",
            "pending": "is-pending"
        }
    },

    _status: {
        value: null
    },

    status: {
        get: function () {
            return this._status;
        },
        set: function (value) {
            if (value != this._status) {
                this._status = value;
                this._oldStatusClasses.push(this._statusClass);

                this._statusClass = this.statusClassMap[value];

                this.needsDraw = true;
            }
        }
    },

    percentageComplete: {
        set: function (value) {
            this._percentageComplete = value;
            this.needsDraw = true;
        },
        get: function () {
            return this._percentageComplete;
        }
    },

    constructor: {
        value: function () {
            this._oldStatusClasses = [];
        }
    },

    draw: {
        value: function () {
            this.bar.style.transform = "translateX(" + (this._percentageComplete - 100) + "%)";

            this._cleanupClasses();

            if (this._statusClass) {
                this.classList.add(this._statusClass);
            }
        }
    },

    exitDocument: {
        value: function () {
            this._cleanupClasses(true);
        }
    },

    _cleanupClasses: {
        value: function (removeCurrent) {
            var oldClass;

            if (this._oldStatusClasses && this._oldStatusClasses.length > 0) {
                while (oldClass = this._oldStatusClasses.pop()) {
                    this.classList.remove(oldClass);
                }
            }

            if (removeCurrent && this._statusClass) {
                this.classList.remove(this._statusClass);
            }
        }
    }
});
