var Component = require("montage/ui/component").Component;

/**
 * @class CalendarTask
 * @extends Component
 */
exports.CalendarTask = Component.specialize({
    templateDidLoad: {
        value: function() {
            this.taskCategories = [{ name: '---', value: null }].concat(this.application.calendarService.taskCategories);
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (this.object && this.object.task) {
                this.classList.add('type-' + this.object.task.replace('.', '_').toLowerCase());
            }
            if (this.object._isNew) {
                this.object.args = [];
            }
        }
    },

    exitDocument: {
        value: function() {
            if (this.object && this.object.task) {
                this.classList.remove('type-' + this.object.task.replace('.', '_').toLowerCase());
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
