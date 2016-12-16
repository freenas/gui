var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector;

exports.Calendar = AbstractInspector.specialize({
    events: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this.taskCategories = this._sectionService.CALENDAR_TASK_CATEGORIES;
        }
    }

});
