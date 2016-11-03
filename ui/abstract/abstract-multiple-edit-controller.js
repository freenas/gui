var Component = require("montage/ui/component").Component,
    NotificationCenterModule = require("core/backend/notification-center");

exports.AbstractMultipleEditController = Component.specialize({

    _taskIds: {
        value: null
    },

    initialize: {
        value: function(sectionService) {
            this._sectionService = sectionService;

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

            for (var i = 0; i < this.values.length; i++) {
                var value = this.values[i];
                if (!value.persistedId) {   // created
                    promises.push(this._saveRaw(value));
                } else {
                    valuesMap[value.persistedId] = value;
                }
            }
            
            for (var i = 0; i < this._objects.length; i++) {
                var object = this._objects[i];
                var value = valuesMap[object.persistedId];
                if (!value) { // deleted
                    promises.push(this.deleteObject(object));
                } else if (this.isValueUpdated(value, object)) { // updated
                    promises.push(this._saveRaw(value));
                }
            }

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
            this.values = this._objects.map(this.mapObjectToValues);
            return Promise.resolve();
        }
    },

    _saveRaw: {
        value: function(value) {
            var self = this;
            return this.getNewInstance()
                .then(function(object) {
                    object._isNew = !value.persistedId;
                    self.mergeValuesToObject(value, object);
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
     * Returns new model object
     * 
     * @return {Model}
     */
    getNewInstance: {
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
    mapObjectToValues: {    
        value: Function.noop
    },

    /**
     * Merge raw data back to model object
     * 
     * @param  {Object} data   Data to be merged
     * @param  {Model}  object Model object
     * @return {Model}
     */
    mergeValuesToObject: {
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
