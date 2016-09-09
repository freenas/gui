var Montage = require("montage").Montage,
    Uuid = require("montage/core/uuid").Uuid;

var SelectionService = exports.SelectionService = Montage.specialize({
    _selection: {
        value: {
            sections: {},
            tasks: {}
        }
    },

    _currentSection: {
        value: null
    },

    getCurrentSelection: {
        value: function() {
            return this.getSectionSelection(this._currentSection);
        }
    },

    getSectionSelection: {
        value: function(sectionName) {
            return this._selection.sections[sectionName];
        }
    },

    saveSectionSelection: {
        value: function(sectionName, selection) {
            this._selection.sections[sectionName] = {
                path: selection
            };
            this._currentSection = sectionName;
        }
    },

    getTaskSelection: {
        value: function(taskId) {
            return this._selection.tasks[taskId];
        }
    },

    saveTemporaryTaskSelection: {
        value: function(object) {
            var temporaryId = Uuid.generate();
            this._selection.tasks[temporaryId] = {
                section: this._currentSection,
                path: this._selection.sections[this._currentSection].path.slice()
            };
            return temporaryId;
        }
    },

    persistTaskSelection: {
        value: function(temporaryId, taskId) {
            var taskSelection = this._selection.tasks[temporaryId];
            if (taskSelection) {
                this._selection.tasks[taskId] = taskSelection;
                delete this._selection.tasks[temporaryId];
            }
        }
    },

    removeTaskSelection: {
        value: function(taskId) {
            delete this._selection.tasks[taskId];
        }
    },

    restoreTaskSelection: {
        value: function(taskId) {
            var section,
                taskSelection = this._selection.tasks[taskId];
            if (taskSelection) {
                section = taskSelection.section;
                this._selection.sections[section] = {
                    path: taskSelection.path.slice(),
                    error: taskSelection.error
                };
            }
            return section;
        }
    },

    addErrorToTaskSelection: {
        value: function(error, taskId) {
            var taskSelection = this._selection.tasks[taskId];
            if (taskSelection) {
                taskSelection.error = error;
            }
        }
    }

}, {
    instance: {
        get: function() {
            if (!this._instance) {
                this._instance = new SelectionService();
            }
            return this._instance;
        }
    }
});
