/**
 * @module ui/share.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Share
 * @extends Component
 */
exports.Share = Component.specialize(/** @lends Share# */ {

    context: {
        value: null
    },

    _getCurrentVolume: {
        value: function () {}
    },

    enterDocument: {
        value: function () {
            this._shareService = this.application.shareService;

            if (!this.object.__shares) {
                this._populateNewShareObjectList();
            }
        }
    },

    _populateNewShareObjectList: {
        value: function () {
            var shareService = this._shareService;

            return Promise.all([
                shareService.createSmbShare(),
                shareService.createNfsShare(),
                shareService.createAfpShare(),
                shareService.createIscsiShare()
            ]).bind(this).then(function (shares) {
                this.object.__shares = this.shares = shares;
            });
        }
    }
});
