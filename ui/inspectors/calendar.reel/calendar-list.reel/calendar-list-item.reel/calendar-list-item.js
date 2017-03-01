var Component = require("montage/ui/component").Component,
    PressComposer = require("montage/composer/press-composer").PressComposer,
    _ = require('lodash');

exports.CalendarListItem = Component.specialize(/** @lends CalendarListItem# */ {
    schedule: {
        get: function() {
            if (this.object) {
                var result,
                    everyHour = this.object.hour == '*',
                    everyMinute = this.object.minute == '*',
                    everySecond = this.object.second == '*';
                if (everyHour || everyMinute || everySecond) {
                    this.isTextualSchedule = true;
                    if (everyHour) {
                        result = "Every hour";
                        if (everyMinute) {
                            result = "Every minute";
                            if (everySecond) {
                                result = "Every second";
                            } else {
                                result +=   " at " +
                                    this._normalizeValue(this.object.second);
                            }
                        } else {
                            result +=   " at " +
                                this._normalizeValue(this.object.minute) + ':' +
                                this._normalizeValue(this.object.second);
                        }
                    }
                } else {
                    this.isTextualSchedule = false;
                    result = this._normalizeValue(this.object.hour) + ':' +
                        this._normalizeValue(this.object.minute) + ':' +
                        this._normalizeValue(this.object.second);
                }
                return result;
            }
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener('object', this, '_handleObjectChange');
            }
        }
    },

    prepareForActivationEvents: {
        value: function() {
            var pressComposer = new PressComposer();
            this.addComposer(pressComposer);
            pressComposer.addEventListener("press", this);
            this.element.addEventListener("mouseover", this);
        }
    },

    handlePress: {
        value: function () {
            this.selectedTask = this.object.task;
        }
    },

    _handleObjectChange: {
        value: function(object) {
            var self = this;
            this.classList.forEach(function(className) {
                if (_.startsWith(className, 'type-')) {
                    self.classList.remove(className);
                }
            });
            if (object) {
                this.classList.add('type-' + object.task.task.replace('.', '_').toLowerCase());
                this.dispatchOwnPropertyChange("schedule", this.schedule);
            }
        }
    },

    _normalizeValue: {
        value: function(value) {
            return value < 10 ? '0' + value : value;
        }
    }
});
