var Converter = require("montage/core/converter/converter").Converter;

var SECONDS_PER_MINUTE = 60,
    SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60,
    SECONDS_PER_DAY = SECONDS_PER_HOUR * 24,
    SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;

exports.SecondsToStringConverter = Converter.specialize({
    convert: {
        value: function(seconds) {
            var parts = {
                    weeks:0,
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            if (seconds) {
                seconds = Math.round(seconds);
                seconds = this._extractPart(seconds, parts, 'weeks', SECONDS_PER_WEEK);
                seconds = this._extractPart(seconds, parts, 'days', SECONDS_PER_DAY);
                seconds = this._extractPart(seconds, parts, 'hours', SECONDS_PER_HOUR);
                seconds = this._extractPart(seconds, parts, 'minutes', SECONDS_PER_MINUTE);
                parts.seconds = seconds;
                return this._formatParts(parts);
            } else {
                return '';
            }
        }
    },

    revert: {
        value: function(string) {
            return '';
        }
    },

    _extractPart: {
        value: function(seconds, parts, partName, partDuration) {
            while (seconds >= partDuration) {
                seconds -= partDuration;
                parts[partName]++;
            }
            return seconds;
        }
    },

    _formatParts: {
        value: function(parts) {
            var formattedString = '';
            if (parts.weeks) {
                formattedString += parts.weeks + ' week' + (parts.weeks > 1 ? 's ' : ' ');
            }
            if (parts.days) {
                formattedString += parts.days + ' day' + (parts.days > 1 ? 's ' : ' ');
            }
            if (parts.hours) {
                formattedString += parts.hours + ' hour' + (parts.hours > 1 ? 's ' : ' ');
            }
            if (parts.minutes) {
                formattedString += parts.minutes + ' minute' + (parts.minutes > 1 ? 's ' : ' ');
            }
            if (parts.seconds) {
                formattedString += parts.seconds + ' second' + (parts.seconds > 1 ? 's ' : ' ');
            }
            return formattedString;
        }
    }
});
