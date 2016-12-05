/**
 * @module ui/snapshot.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class Snapshot
 * @extends Component
 */
exports.Snapshot = AbstractInspector.specialize(/** @lends Snapshot# */ {

    pathDisplayMode: {
        value: null
    },

    _context: {
        value: null
    },

    context: {
        get: function() {
            return this._context;
        },
        set: function(context) {
            if (this._context != context) {
                this._context = context;
            }
            this._loadVolume();
            this._loadParentDataset();
        }
    },

    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function (object) {
            if (this._object !== object) {
                this._object = object;

                if (object) {
                    if (object.id == void 0) {
                        this._object.replicable = true;
                        this.pathDisplayMode = "select";
                    } else {
                        this.pathDisplayMode = "display";
                    }
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
                this._dataService = this.application.dataService;
            }

            this._loadVolume();
            this._loadParentDataset();
            this._loadExpirationDate();
            this._resetRepetition();
        }
    },

    revert: {
        value: function() {
            var self = this;
            this.inspector.revert().then(function() {
                self._loadExpirationDate();
            });
        }
    },

    save: {
        value: function() {
            var self = this,
                created = this.object.properties ? (+this.object.properties.creation.rawvalue * 1000) : Date.now(),
                expires = this._expirationType === 'at' ? this._expirationDate.getTime() :
                    this._expirationType === 'after' ? (Date.now() + this._lifetime * 1000) : 0;

            this.object.lifetime = expires ? Math.round((expires - created) / 1000) : null;

            return this._createCalendarTaskIfNeeded().then(function() {
                return self.object._isNew ? self.inspector.save(self.object._recursive) : self.inspector.save();
            });
        }
    },

    delete: {
        value: function() {
            var self = this;
 
            return this.inspector.delete(this.extraDeleteFlags[0].checked);
        }
    },

    _loadVolume: {
        value: function() {
            this.volume = this._getCurrentVolume();
            if (this._object && this.volume) {
                this._object.volume = this.volume.id;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == Model.Volume) {
                        return currentSelection[i];
                    }
                }
            }
        }
    },

    _loadExpirationDate: {
        value: function() {
            var now = new Date(),
                defaultExpirationDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
                expirationDate = null;

            if (!this.object._isNew) {
                if (this._object.lifetime && this._object.properties) {
                    expirationDate = new Date((+this.object.properties.creation.rawvalue + this.object.lifetime) * 1000);    
                }
            } else {
                expirationDate = defaultExpirationDate;
            }

            this._expirationType = expirationDate ? 'at' : 'never';
            this._expirationDate = expirationDate || defaultExpirationDate;
            this._lifetime = Math.ceil((this._expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) * (60 * 60 * 24);
        }
    },

    _loadParentDataset: {
        value: function() {
            var dataset = this._getCurrentDataset();
            if (dataset) {
                this._object.dataset = dataset.id;
                this.pathDisplayMode = "display";
            }
        }
    },

    _getCurrentDataset: {
        value: function() {
            if (this._context) {
                var currentSelection = this.application.selectionService.getCurrentSelection();
                for (var i = this._context.columnIndex - 1; i >= 0; i--) {
                    if (currentSelection[i].constructor.Type == Model.VolumeDataset) {
                        return currentSelection[i];
                    }
                }
            }
        }
    },

    _getRepeatDuration: {
        value: function() {
            if (this._repetition) {
                for (var i = 1, length = this.constructor.DURATION_UNITS.length; i < length; i++) {
                    var count = this._repetition / this.constructor.DURATION_UNITS[i].value;
                    if (count < 1 || Math.round(count) !== count) {
                        break;
                    }
                }

                return {
                    unit: this.constructor.DURATION_UNITS[i-1].unit,
                    count: this._repetition / this.constructor.DURATION_UNITS[i-1].value
                };
            }
            return null;
        }
    },

    _createScheduleWithRepeatDuration: {
        value: function(duration) {
            var date = new Date(),
                schedule = {
                    day:    date.getDate(),
                    hour:   date.getHours(),
                    minute: date.getMinutes(),
                    second: 0
                };

            for (var i = this.constructor.DURATION_UNITS.length - 1; i >= 0; i--) {
                var unit = this.constructor.DURATION_UNITS[i].unit;
                if (unit === duration.unit) {
                    schedule[unit] = '*/' + duration.count;
                    break;
                }
                schedule[unit] = '*';
            }

            if (duration.unit === 'week') {
                schedule.day = '*';
                schedule.day_of_week = date.getDay();
            }

            return schedule;
        }
    },

    _createCalendarTaskIfNeeded: {
        value: function() {
            var self = this,
                duration = this._getRepeatDuration();

            if (duration) {
                return this._calendarService.getNewTask(new Date(), 'volume.snapshot_dataset').then(function(task) {
                    task.name = self.object.name;
                    task.args = [
                        self.object.dataset,
                        self.object._recursive,
                        self.object.lifetime,
                        self.object.name + '-auto',
                        self.object.replicable
                    ];
                    task.enabled = true;
                    task.schedule = self._createScheduleWithRepeatDuration(duration);
                    return self._dataService.saveDataObject(task);
                });
            }
            return Promise.resolve();
        }
    },

    _resetRepetition: {
        value: function() {
            this._repetition = null;
        }
    }

}, {
    EXPIRATION_TYPES: {
        value: [
            {
                value: 'never',
                label: 'Never'
            },
            {
                value: 'at',
                label: 'At'
            },
            {
                value: 'after',
                label: 'After'
            }
        ]
    },

    DURATION_UNITS: {
        value: [
            {
                unit: "second",
                value: 1,
            },
            {
                unit: "minute",
                value: 60
            },
            {
                unit: "hour",
                value: 3600
            },
            {
                unit: "day",
                value: 86400
            },
            {
                unit: "week",
                value: 604800
            }
        ]
    }
});
