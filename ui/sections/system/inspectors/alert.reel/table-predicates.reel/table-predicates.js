var Component = require("montage/ui/component").Component,
    _ = require("lodash");

exports.TablePredicates = Component.specialize({
    tableWillUseNewEntry: {
        value: function () {
            if(this.rows && this.rows.length == 0) {
                return {
                    property: "class",
                    operator: null,
                    value: null,
                    _disabled: false
                }
            } else if(this.rows && this.rows.length == 1){
                var self = this;
                return {
                    property : property = _.head(_.reject(["class", "severity"], function(x) { return x === self.rows[0].property; })),
                    _disabled: true
                }
            }
        }
    }
});

