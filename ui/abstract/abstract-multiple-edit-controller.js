var Component = require("montage/ui/component").Component,
    NotificationCenterModule = require("core/backend/notification-center");

exports.AbstractMultipleEditController = Component.specialize({

    _taskIds: {
        value: null
    },

    initialize: {
        value: function(sectionService, dataService) {
            this._sectionService = sectionService;
            this._dataService = dataService;

            return this._load();
        }
    },

    revert: {
        value: function() {
            return this._reset();
        }
    },

    save: {
        value: function() {
            var self = this,
                valuesMap = {},
                promises = [];

            this.values.forEach(function(value) {
                if (!value.persistedId) {   // created
                    promises.push(self._saveRawData(value));
                } else {
                    valuesMap[value.persistedId] = value;
                }
            });
            
            this._objects.forEach(function(object) {
                var value = valuesMap[object.persistedId];
                if (!value) { // deleted
                    promises.push(self.deleteObject(object));
                } else if (self.isValueUpdated(value, object)) { // updated
                    promises.push(self._saveRawData(value));
                }
            });

            return Promise.all(promises).then(function(taskIds) {
                return self._startTaskDoneListener(taskIds);
            });
        }
    },

    handleObjectsRangeChange: {
        value: function(plus, minus, index) {
            return this._reset();
        }
    },

    handleTaskDone: {
        value: function(event) {
            var taskId = event.detail.jobId;
            if (this._taskIds && this._taskIds.length) {
                this._taskIds.delete(taskId);
                if (!this._taskIds.length) {
                    this._reset();
                    this._stopTaskDoneListener();
                }
            }
        }
    },

    _load: {
        value: function() {
            var self = this;
            return this.loadObjects().then(function(objects) {
                self._objects = objects;
                self._objects.addRangeChangeListener(self, "objects");

                return self._reset();
            });
        }
    },

    _reset: {
        value: function() {
            this.values = this._objects.map(this.mapObjectToRawData);
            return Promise.resolve();
        }
    },

    _saveRawData: {
        value: function(value) {
            var self = this,
                type = this.getModelType();

            return this._dataService.getNewInstanceForType(type)
                .then(function(object) {
                    object._isNew = !value.persistedId;
                    self.mergeRawDataToObject(value, object);
                    return self.saveObject(object);
                });
        }
    },

    _startTaskDoneListener: {
        value: function(taskIds) {
            if (taskIds && taskIds.length) {
                this._taskIds = taskIds;

                // Subscribe to task done events to be able to
                // reset UI on the completion of tasks submitted
                NotificationCenterModule.defaultNotificationCenter.addEventListener("taskDone", this);    
            }
        }
    },

    _stopTaskDoneListener: {
        value: function() {
            this._taskIds = null;
            NotificationCenterModule.defaultNotificationCenter.removeEventListener("taskDone", this);
        }
    },

    /**
     * Returns model type for the objects currently being edited
     * 
     * @return {ModelType}
     */
    getModelType: {
        value: Function.noop
    },

    /**
     * Load model objects
     * 
     * @return {Promise}
     */
    loadObjects: {
        value: Function.noop
    },

    /**
     * Save model object
     *
     * @param  {Model}  object Object to save
     * @return {Promise}
     */
    saveObject: {
        value: Function.noop
    },

    /**
     * Delete model object
     * 
     * @param  {Model} object Object to delete
     * @return {Promise}
     */
    deleteObject: {
        value: Function.noop
    },

    /**
     * Creates raw data object from model object
     * 
     * @param  {Model} object Model object to map
     * @return {Object}
     */
    mapObjectToRawData: {    
        value: Function.noop
    },

    /**
     * Merge raw data back to model object
     * 
     * @param  {Object} data   Data to be merged
     * @param  {Model}  object Model object
     * @return {Model}
     */
    mergeRawDataToObject: {
        value: Function.noop
    },

    /**
     * Check if the value is updated from initial model object
     * 
     * @param  {Object} value  Potentionally updated value
     * @param  {Model}  object Original model object
     * @return {bool}
     */
    isValueUpdated: {
        value: Function.noop
    }

});
