var Component = require("montage/ui/component").Component;

/**
 * @class TableCell
 * @extends Component
 */
exports.TableCell = Component.specialize({

    value: {
        value: null
    },

    _componentModuleId: {
        value: null
    },

    componentModuleId: {
        set: function (componentModuleId) {
            if (this._componentModuleId !== componentModuleId) {
                this._componentModuleId = componentModuleId;
            }
        },
        get: function () {
            return this._componentModuleId || this.constructor.DEFAULT_COMPONENT_MODULE_ID;
        }
    }

}, {

    DEFAULT_COMPONENT_MODULE_ID: {
        value: "ui/controls/table.reel/table-cell.reel/table-cell-text.js"
    }

});
