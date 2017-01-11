var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RoutingService = require("core/service/routing-service").RoutingService,
    _ = require("lodash");

exports.Calendar = AbstractInspector.specialize({
    _inspectorTemplateDidLoad: {
        value: function() {
            this._routingService = RoutingService.getInstance();
            this.taskCategories = this._sectionService.CALENDAR_TASK_CATEGORIES;
            this.addPathChangeListener('selectedObject', this, '_handleSelectionChange');
        }
    },

    _handleSelectionChange: {
        value: function(value) {
            if (value) {
                if (value. _isNew) {
                    this.object._newTask = _.cloneDeep(value);
                    this._routingService.navigate('/calendar/calendar-task/create/' + value.task);
                } else {
                    this.object._newTask = null;
                    this._routingService.navigate('/calendar/calendar-task/_/' + value.id);
                }
            }
        }
    },

    enterDocument: {
        value: function () {
            var self = this;
            this._sectionService.getGmtOffset()
                .then(function(gmtOffset) {
                    return self.object._gmtOffset = gmtOffset.slice(0,3);
                });
        }
    }
});
