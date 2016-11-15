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
            this._populateNewShareObjectList();
        }
    },

    _populateNewShareObjectList: {
        value: function () {
            var volume = null,
                shareService = this._shareService;

            Promise.all([
                shareService.createSmbShare(volume),
                shareService.createNfsShare(volume),
                shareService.createAfpShare(volume),
                shareService.createIscsiShare(volume)
            ]).bind(this).then(function (shares) {
                this.shares = shares;
            });
        }
    }
});
