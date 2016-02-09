var Component = require("montage/ui/component").Component;

/**
 * @class ViewMode
 * @extends Component
 */
exports.ViewMode = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.searchField.addEventListener("input", this, false);
            }
        }
    },

    _type: {
        value: null
    },

    type: {
        get: function () {
            return this._type;
        },
        set: function (value) {
            this._type = value;
            if (this._dataController) {
                this._dataController.selection = [];
            }
        }
    },

    _filter: {
        value: null
    },

    filter: {
        get: function () {
            return this._filter;
        },
        set: function (value) {
            this._filter = value;
            this.handleInput();
        }
    },

    _dataController: {
        value: null
    },

    dataController: {
        get: function () {
            return this._dataController;
        },
        set: function (value) {
            this._dataController = value;
            this.handleInput();
        }
    },

    handleInput: {
        value: function () {
            var filterPath = "",
                i;

            if (this._dataController) {
                if (this.searchFields && this.searchFields.length && this.searchField.value) {
                    filterPath = "(";
                    for (i = 0; i < this.searchFields.length; i++) {
                        if (i) {
                            filterPath += "+' '+";
                        }
                        filterPath += this.searchFields[i];
                    }
                    filterPath += ").toLowerCase().contains('" + this.searchField.value.toLowerCase() + "')";
                    this._dataController.filterPath = filterPath;
                }
                if (this._filter === "Built-in") {
                    filterPath += "&& !!isBuiltIn";
                } else {
                    if (this._filter === "Local") {
                        filterPath += "&& !isBuiltIn";
                    }
                }
                if (filterPath !== "") {
                    this._dataController.filterPath = filterPath;
                } else {
                    this._dataController.filterPath = undefined;
                }
            }
        }
    }

});
