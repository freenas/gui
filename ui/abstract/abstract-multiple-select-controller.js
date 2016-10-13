var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate,
    TextInput = require("montage/ui/text-input").TextInput;


exports.AbstractMultipleSelectController = AbstractComponentActionDelegate.specialize({

    templateDidLoad: {
        value: function () {
            this.defineBinding("fieldMultipleSelect.control.controller", {"<-": "this"});

            if (this.canAddNewEntryExpression) {
                this.defineBinding("fieldMultipleSelect.canAddNewEntry", {"<-": this.canAddNewEntryExpression});
            }
        }
    },

    canAddNewEntryExpression: {
        value: null
    },

    handleAction: {
        value: function (event) {
            if (event.target instanceof TextInput) {
                this._addNewEntry();
            }
        }
    },

    handleMultipleSelectAddAction: {
        value: function (multipleSelect, event) {
            this._addNewEntry();
        }
    },

    _addNewEntry: {
        value: function () {
            var valuesController = this._getValuesController();

            if (valuesController && this._canAddCurrentEntry()) {
                var value = this._extractCurrentEntry();

                if (typeof value === "string" && value.length) {
                    valuesController.push(value);
                }
            }
        }
    },

    _canAddCurrentEntry: {
        value: function () {
            return this.fieldMultipleSelect && this.fieldMultipleSelect.control ? 
                !this.fieldMultipleSelect.control.addButtonDisabled: true;
        }
    },

    _getValuesController: {
        value: function () {
            return this.fieldMultipleSelect && this.fieldMultipleSelect.control ? 
                this.fieldMultipleSelect.control.valuesController : null;
        }
    },

    _extractCurrentEntry: {
        value: function () {
            var formattedCurrentEntry = this.getFormattedCurrentEntry() || "";
            
            if (document.activeElement && document.activeElement.blur) {
                document.activeElement.blur();
            }

            this.cleanCurrenEntry();

            return formattedCurrentEntry;
        }
    },

    getFormattedCurrentEntry: {
        value: Function.noop
    },

    getFormattedCurrentEntry: {
        value: Function.noop
    }

});
