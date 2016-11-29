/**
 * @module ui/table-row-port.reel
 */
var Component = require("montage/ui/component").Component,
    AlertClassId = require("core/model/enumerations/alert-class-id").AlertClassId,
    AlertSeverity = require("core/model/enumerations/alert-severity").AlertSeverity;

/**
 * @class TableRowPredicate
 * @extends Component
 */
exports.TableRowPredicate = Component.specialize({

    classOperators: {
        value: [
                    {
                        "label": "'=='",
                        "value": "=="
                    },
                    {
                        "label": "'!='",
                        "value": "!="
                    }
                ]
    },

    templateDidLoad: {
        value: function () {
            this.classValues = AlertClassId.members.map(function (x) {
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
