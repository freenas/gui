var Component = require("montage/ui/component").Component,
    _ = require('lodash');

exports.TableRowVolume = Component.specialize({
    _object: {
        value: null
    },

    object: {
        get: function() {
            return this._object;
        },
        set: function(object) {
            if (this._object !== object) {
                if (object) {
                    object._source = !object.host_path || _.startsWith(object.host_path, '/host/') ? 'host' : 'vm';
                }
                this._object = object;
            }
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("object._source", this, "handleSelectedTypeChange")
            }
        }
    },

    handleSelectedTypeChange: {
        value: function (value) {
            if (this.object && value && !this.object.isLocked && this.object._source !== value) {
                this.object.host_path = "";
            }
        }
    }

});
