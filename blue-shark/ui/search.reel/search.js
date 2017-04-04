/**
 * @module ui/search.reel
 */
var Component = require("montage/ui/component").Component
    _ = require("lodash");

/**
 * @class Search
 * @extends Component
 */
exports.Search = Component.specialize(/** @lends Search# */ {

    _value: {
        value: null
    },

    value: {
        set: function (value) {
            this._value = value ? this.valuePath ? value[this.valuePath] || value : value : null;
            this.displayedValue = value ? this.labelPath ? value[this.labelPath] || value : value : 'none';
        },
        get: function () {
            return this._value;
        }
    },

    enterDocument: {
        value: function (firstTime) {
            if (!this.controller || typeof this.controller.search !== 'function') {
                throw new Error('Search component needs a controller that implements an `search` method.');
            }

            if (firstTime) {
                this.addPathChangeListener("_searchInput.value", this, "handleSearchChange");
            }
        }
    },

    exitDocument: {
        value: function () {
            this._resetState();
        }
    },

    handleSearchChange: {
        value: function (value) {
            if (value !== null && value !== void 0 && !value.length) {
                this._results = this.initialOptions;
            }
        }
    },

    handleAction: {
        value: function (event) {
            var target = event.target;

            if (target === this._searchButton || target === this._searchInput) {
                this._search(this._searchInput.value);
            } else if (target === this._changeButton) {
                this.switchValue = 'write';
                this._selectComponent.selectedValues = null;
                this._results = this.initialOptions;
                this._searchInput.focus();

            } else if (target === this._cancelButton || target === this._validButton || target === this._noneButton) {
                if (target === this._validButton) {
                    var self = this,
                        selectedValue = this._selectComponent.selectedValues[0];

                    this.value = _.find(this._results, function (result) {
                        return result[self.valuePath] === selectedValue;
                    });
                }

                if (target === this._noneButton) {
                    this.value = null;
                }

                this._resetState();
            }
        }
    },

    controller: {
        value: null
    },

    _resetState: {
        value: function () {
            this._searchInput.value = this._results = null;
            this.isSearching = false;
            this.switchValue = 'read';
        }
    },

    _search: {
        value: function (value) {
            if (typeof value === 'string' && value.length) {
                this._handleSearchAction(this.controller.search(value));
            }
        }
    },

    _handleSearchAction: {
        value: function (searchAction) {
            this.isSearching = true;

            if (Promise.is(searchAction)) {
                var self = this;

                searchAction.then(function (results) {
                    if (self._inDocument) {
                        self._results = results;
                    }
                }).finally(function () {
                    self.isSearching = false;
                });
            } else {
                this._results = searchAction;
                this.isSearching = false;
            }
        }
    }

});
