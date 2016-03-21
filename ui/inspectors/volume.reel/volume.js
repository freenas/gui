var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = Component.specialize({
    emptyShares: {
        value: null
    },

    _allShares: {
        value: null
    },

    allShares: {
        get: function() {
            return this._allShares;
        },
        set: function(allShares) {
console.log(this._allShares, allShares);
            this._allShares = allShares;
        }
    },

    _shares: {
        value: null
    },

    shares: {
        get: function() {
            return this._shares;
        },
        set: function(shares) {
console.log(this._shares, shares);
            this._shares = shares;
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this.emptyShares = this.application.dataService.getEmptyCollectionForType(Model.Share);
            }
        }
    }
});
