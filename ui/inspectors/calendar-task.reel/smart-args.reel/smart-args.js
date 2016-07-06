/**
 * @module ui/scrub-args.reel
 */
var Component = require("montage/ui/component").Component,
    DiskSelftestType = require('core/model/enumerations/disk-selftest-type').DiskSelftestType;

/**
 * @class SmartArgs
 * @extends Component
 */
exports.SmartArgs = Component.specialize(/** @lends SmartArgs# */ {
    enterDocument: {
        value: function() {
            var self = this;
            this.application.storageService.listDisks().then(function(disks) {
                self.disks = disks;
            });
            if (this.args) {
                this.selectedDisks = this._objectToArray(this.args[0]);
            } else {
                this.args = [];
            }
            this.addRangeAtPathChangeListener("selectedDisks", this, "_handleSelectedDisksChange");
            this.testTypes = DiskSelftestType.members;
        }
    },

    _handleSelectedDisksChange: {
        value: function() {
            this.args[0] = this._arrayToObject(this.selectedDisks);
        }
    },

    _objectToArray: {
        value: function(object) {
            var array = [];
            for (var i in object) {
                if (object.hasOwnProperty(i)) {
                    array.push(object[i]);
                }
            }
            return array;
        }
    },

    _arrayToObject: {
        value: function(array) {
            var object = {};
            for (var i = 0, length = array.length; i < length; i++) {
                object[i] = array[i];
            }
            return object;
        }
    }
});
