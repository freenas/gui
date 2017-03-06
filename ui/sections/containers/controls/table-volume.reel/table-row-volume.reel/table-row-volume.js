var Component = require("montage/ui/component").Component;

exports.TableRowVolume = Component.specialize({
    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.addPathChangeListener("object._source", this, "handleSourceChange")
            }
        }
    },

    handleSourceChange: {
        value: function () {
            if (this.object && this.object._source !== this.object.source && this.object._source) {
                this.object.source = this.object._source;
            }
        }
    }

});
