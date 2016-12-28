var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    RoutingService = require("core/service/routing-service").RoutingService;

exports.Calendar = AbstractInspector.specialize({
    events: {
        value: null
    },

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
                this._routingService.navigate('/calendar/calendar-task/_/' + value.id);
            }
        }
    }

});
