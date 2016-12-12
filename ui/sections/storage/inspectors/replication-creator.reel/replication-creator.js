/**
 * @module ui/replication-creator.reel
 */
var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model;

/**
 * @class ReplicationCreator
 * @extends AbstractInspector
 */
exports.ReplicationCreator = AbstractInspector.specialize(/** @lends ReplicationCreator# */ {

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
        }
    },
    
    enterDocument: {
        value: function(isFirstTime) {
            var self = this;

            if (isFirstTime) {
                this._calendarService = this.application.calendarService;
                this._dataService = this.application.dataService;
            }

            this.object._transportOptions = {};
            this.object._replicationOptions = {};

            this._loadParentDataset();
            this._resetRepetition();

            return this.application.peeringService.list().then(function(peers) {
                self.peers = peers;
                if (peers && peers.length) {
                    self.object._replicationOptions.peer = peers[0].id;
                }
            });
        }
    },

    save: {
        value: function() {
            var transportOptions = this._buildTransportOptions();

            return Promise.all([
                this._sectionService.replicateDataset(this.object._dataset, this.object._replicationOptions, transportOptions),
                this._createCalendarTaskIfNeeded(transportOptions)
            ]);
        }
    },

    _buildTransportOptions: {
        value: function() {
            var transportOptions = [];
            if (this.object._transportOptions.encrypt) {
                transportOptions.push({
                    "%type": "encrypt-replication-transport-plugin",
                    type: this.object._transportOptions.encrypt
                });
            }
            if (this.object._transportOptions.compress) {
                transportOptions.push({
                    "%type": "compress-replication-transport-plugin",
                    level: this.object._transportOptions.compress
                });
            }
            if (this.object._transportOptions.throttle) {
                transportOptions.push({
                    "%type": "throttle-replication-transport-plugin",
                    buffer_size: this.object._transportOptions.throttle
                });
            }
            return transportOptions;
        }
    },

    _loadParentDataset: {
        value: function() {
            var dataset = this._getCurrentDataset();
            if (dataset) {
                this.object._dataset = dataset.id;
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
        value: function(transportOptions) {
            var self = this,
                duration = this._getRepeatDuration();

            if (duration) {
                return this._calendarService.getNewTask(new Date(), 'replication.replicate_dataset').then(function(task) {
                    task.name = self.object._dataset + '@auto-rep';
                    task.args = [
                        self.object._dataset,
                        self.object._replicationOptions,
                        transportOptions
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
