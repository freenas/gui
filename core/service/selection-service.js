var Montage = require("montage").Montage;

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

    saveTaskSelection: {
        value: function(taskId, object) {
            this._selection.tasks[taskId] = {
                section: this._currentSection,
                path: this._selection.sections[this._currentSection].path.slice()
            };
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
                    path: taskSelection.path
                };
            }
            return section;
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
