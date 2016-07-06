var Component = require("montage/ui/component").Component;

/**
 * @class CalendarTask
 * @extends Component
 */
exports.CalendarTask = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.taskCategories = this.application.calendarService.taskCategories;
            }
            if (this.object && this.object.name) {
                this.classList.add('type-' + this.object.name.replace('.', '_').toLowerCase());
            }
            if (this.object._isNew) {
                this.object.args = [];
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.object && this.object.name) {
                this.classList.remove('type-' + this.object.name.replace('.', '_').toLowerCase());
            }
        }
    },
    
    save: {
        value: function() {
            this.object.args = this.object.args.filter(function(x) { 
                return !!x || (typeof x !== "undefined" && typeof x !== "object") ; 
            });
            this.application.dataService.saveDataObject(this.object);
        }
    }

});
