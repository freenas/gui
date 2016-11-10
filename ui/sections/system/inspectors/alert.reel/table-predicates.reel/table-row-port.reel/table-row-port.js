/**
 * @module ui/table-row-port.reel
 */
var Component = require("montage/ui/component").Component,
    AlertClassId = require("core/model/enumerations/alert-class-id").AlertClassId,
    AlertSeverity = require("core/model/enumerations/alert-severity").AlertSeverity;

/**
 * @class TableRowPort
 * @extends Component
 */
exports.TableRowPort = Component.specialize({

    enterDocument: {
        value: function (isFirstTime) {
            var self = this;
            this.classValues = AlertClassId.members.map(function (x) {
                console.log(x);
                return {
                    label: x,
                    value: x
                };
            });
            this.severityValues = AlertSeverity.members.map(function (x) {
                return {
                    label: x,
                    value: x
                };
            });
        }
    }

});
