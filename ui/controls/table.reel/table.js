var Component = require("montage/ui/component").Component;

/**
 * @class Table
 * @extends Component
 */
exports.Table = Component.specialize({

    _initOrderBy: {
        value: function () {
            if (this._dataController && this._columns && this._columns[0]) {
                this._orderBy = this._columns[0].expression;
                this._dataController.sortPath = this._orderBy;
            }
        }
    },

    _columns: {
        value: null
    },

    columns: {
        get: function () {
            return this._columns;
        },
        set: function (value) {
            this._columns = value;
            this._initOrderBy();
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
            if (this._dataController !== value) {
                this._dataController = value;
                this._initOrderBy();
            }
        }
    },

    _orderBy: {
        value: null
    },

    _reversed: {
        value: false
    },

    activeColumn: {
        set: function (value) {
            if (value) {
                if (this._orderBy !== value.expression) {
                    this._orderBy = value.expression;
                    this._dataController.sortPath = this._orderBy;
                    this._reversed = false;
                } else {
                    this._reversed = !this._reversed;
                }
                this._dataController.reversed = this._reversed;
            }
        }
    },

    findRowIterationContainingElement: {
        value: function (element) {
            return this.rowRepetition._findIterationContainingElement(element);
        }
    }

});
