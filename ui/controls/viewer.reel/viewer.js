var Component = require("montage/ui/component").Component;

/**
 * @class Viewer
 * @extends Component
 */
exports.Viewer = Component.specialize({
    searchExpanded: {
        value: false
    },

    handleSearchToggleAction: {
        value: function () {
            if (this.searchExpanded) {
                this.searchExpanded = false;
            } else {
                this.searchExpanded = true;
                this.searchField.element.select();
            }
        }
    },

    handleSearchClearButtonAction: {
        value: function () {
            this.searchField.value = null;
        }
    },

    handleCreateButtonAction: {
        value: function () {
            console.log("create");
        }
    }
});
