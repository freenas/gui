var Component = require("montage/ui/component").Component;

exports.SectionRoot = Component.specialize({
    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.addPathChangeListener("selectedObject", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedEntry", this, "_handleSelectionChange");
                this.addPathChangeListener("selectedExtraEntry", this, "_handleSelectionChange");
            }
        }
    },

    _handleSelectionChange: {
        value: function(value) {
            if (value) {
                if (this.selectedEntry !== value) {
                    this.selectedEntry = null;
                }
                if (this.selectedExtraEntry !== value) {
                    this.selectedExtraEntry = null;
                }
            }
            if (this.selectedObject !== value) {
                this.selectedObject = value;
            } else {
                this.selectedEntry = this.selectedExtraEntry = value;
            }
        }
    }
});
