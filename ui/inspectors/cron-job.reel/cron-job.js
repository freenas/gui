var Component = require("montage/ui/component").Component,
    CalendarSectionService = require("core/service/section/calendar-section-service").CalendarSectionService;

/**
 * @class CronJob
 * @extends Component
 */
exports.CronJob = Component.specialize({
    hourOptions: {
        value: null
    },
    minuteOptions: {
        value: null
    },
    dayOptions: {
        value: null
    },
    monthOptions: {
        value: null
    },
    selection: {
        value: null
    },

    templateDidLoad: {
        value: function() {
            var self = this;
            this._canDrawGate.setField(this.constructor._CAN_DRAW_FIELD, false);
            CalendarSectionService.instance.then(function(sectionService) {
                self._sectionService = sectionService;
                self.monthOptions = sectionService.MONTHS;
                self.dayOptions = sectionService.DAYS;
                self.hourOptions = sectionService.HOURS;
                self.minuteOptions = sectionService.MINUTES;
            }).then(function() {
                self._canDrawGate.setField(self.constructor._CAN_DRAW_FIELD, true);
            });
        }
    }

}, {
    _CAN_DRAW_FIELD: {
        value: 'isServiceLoaded'
    }
});
