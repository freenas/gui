var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    CalendarSectionService = require("core/service/section/calendar-section-service").CalendarSectionService;

exports.Calendar = AbstractInspector.specialize({
    events: {
        value: null
    },

    _inspectorTemplateDidLoad: {
        value: function() {
            this._forceSectionService(new CalendarSectionService());
        }
    },

    enterDocument: {
        value: function () {
            var self = this;
            this._sectionService.getCalendarInstance().then(function(calendar) {
                self.calendar = calendar;
            });
        }
    }

});
