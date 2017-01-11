var Component = require("montage/ui/component").Component;

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
                switch (this.rows[0].property) {
                    case "class": 
                        return {
                            property: "severity",
                            operator: null,
                            value: null,
                            _disabled: true
                        }
                    case "severity":
                        return {
                            property: "class",
                            operator: null,
                            value: null,
                            _disabled: true
                        }
                }
            }
        }
    }
});