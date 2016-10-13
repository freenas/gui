var AbstractDropZoneComponent = require("blue-shark/core/drag-drop/abstract-dropzone-component").AbstractDropZoneComponent;

exports.DayColumn = AbstractDropZoneComponent.specialize({
    templateDidLoad: {
        value: function() {
            this.super();
            this._calendarService = this.application.calendarService;
        }
    },

    handleComponentDrop: {
        value: function(taskCategoryComponent, event) {
            var self = this;
            this._calendarService.getNewTask(this._getDateFromEvent(event), taskCategoryComponent.object.value).then(function(task) {
                self.selectedTask = task;
            });
        }
    },

    _getDateFromEvent: {
        value: function(event) {
            var self = this,
                date = new Date(this.data.rawDate),
                targetBoundingRect = this.element.getBoundingClientRect(),
                dropPosition = this._getDropPosition(event),
                timeInMinutes = (dropPosition.y - targetBoundingRect.top) / targetBoundingRect.height * 1440;
            date.setHours(Math.floor(timeInMinutes / 60));
            date.setMinutes(timeInMinutes % 60);
            return date;
        }
    },

    _getDropPosition: {
        value: function(event) {
            var targetBoundingRect = event.target.element.getBoundingClientRect();
            return {
                x: event.translateX + targetBoundingRect.left,
                y: event.translateY + targetBoundingRect.top
            };
        }
    }
});
