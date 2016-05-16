var Component = require("montage/ui/component").Component;

/**
 * @class TableCell
 * @extends Component
 */
exports.TableCell = Component.specialize({

    _columnContext: {
        value: null
    },

    columnContext: {
        set: function (columnContext) {
            if (this._columnContext !== columnContext) {
                this._columnContext = columnContext;

                if (columnContext) {
                    this.componentModuleId = columnContext.componentModuleId;
                }
            }
        },
        get: function () {
            return this._columnContext;
        }
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
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addEventListener("placeholderContentLoaded", this);
            }
        }
    },

    handlePlaceholderContentLoaded: {
        value: function (event) {
            if (event.detail === this.content && this.content.moduleId !== this.constructor.DEFAULT_COMPONENT_MODULE_ID) {
                var loadedComponent = this.content.component;

                this.dispatchEventNamed("customTableCellLoaded", true, true,
                    {
                        loadedComponent: loadedComponent,
                        objectContext: this.objectContext,
                        columnContext: this.columnContext
                    }
                );
            }
        }
    }

}, {

    DEFAULT_COMPONENT_MODULE_ID: {
        value: "ui/controls/table.reel/table-cell.reel/table-cell-text.js"
    }

});
