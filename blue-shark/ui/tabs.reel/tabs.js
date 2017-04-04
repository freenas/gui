/**
 * @module ui/tabs.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Tabs
 * @extends Component
 */
exports.Tabs = Component.specialize({
    _selectedTab: {
        value: null
    },

    selectedTab: {
        get: function() {
            return this._selectedTab;
        },
        set: function(selectedTab) {
            if (this._selectedTab !== selectedTab) {
                this._selectedTab = selectedTab;
                if (selectedTab) {
                    this.selection = selectedTab.value;
                }
            }
        }
    },

    _selection: {
        value: null
    },

    selection: {
        get: function() {
            return this._selection;
        },
        set: function(selection) {
            if (this._selection !== selection) {
                this._selection = selection;
                this.selectedTab = this.options.filter(function(x) { return x.value == selection; })[0];
            }
        }
    }
});
