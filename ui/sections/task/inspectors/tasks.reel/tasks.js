/**
 * @module ui/sections/task/inspectors/tasks.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    TaskService = require("core/service/task-service").TaskService,
    EventDispatcherService = require("core/service/event-dispatcher-service").EventDispatcherService,
    ModelEventName = require("core/model-event-name").ModelEventName,
    DataObjectChangeService = require("core/service/data-object-change-service").DataObjectChangeService,
_ = require("lodash");

/**
 * @class Tasks
 * @extends AbstractInspector
 */
exports.Tasks = AbstractInspector.specialize(/** @lends Tasks# */ {

    templateDidLoad: {
        value: function () {
            var self = this;
                this.filter = {};
            this._service = TaskService.getInstance();
            this._dataObjectChangeService = new DataObjectChangeService();
            this._eventDispatcherService = EventDispatcherService.getInstance();
            this._eventDispatcherService.addEventListener(ModelEventName.Task.contentChange, this._handleTaskListUpdate.bind(this));
            this.entries = [];
        }
    },

    enterDocument: {
        value: function (isFirsttime){
            var self = this;
            this.currentView = "EXECUTING";
            this._service.loadEntries().then(function (entries) {
                self.entries = entries.sort(function(a,b) {return (b.id > a.id) ? 1 : ((a.id > b.id) ? - 1 : 0);});
            });
        }
    },

    _handleTaskListUpdate: {
        value: function(state) {
            this._dataObjectChangeService.handleDataChange(this.entries, state);
        }
    }
});
