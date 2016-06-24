var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class ShareCreator
 * @extends Component
 */
exports.ShareCreator = Component.specialize({

    newSmbShare: {
        value: null
    },

    newNfsShare: {
        value: null
    },

    newAfpShare: {
        value: null
    },

    newIscsiShare: {
        value: null
    },

    _getCurrentVolume: {
        value: function() {
            var currentSelection = this._selectionService.getCurrentSelection();

            for (var i = this.context.columnIndex - 1; i >= 0; i--) {
                if (currentSelection.path[i].constructor.Type == Model.Volume) {
                    return currentSelection.path[i];
                }
            }
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
                this._shareService = this.application.shareService;
            }

            this._populateNewShareObjectList();
        }
    },

    _populateNewShareObjectList: {
        value: function () {
            // cache volume path.
            var volume = this._getCurrentVolume(),
                shareService = this._shareService;

            //todo: block draw gate, in order to avoid some odd behavior.
            Promise.all([
                shareService.createSmbShare(volume),
                shareService.createNfsShare(volume),
                shareService.createAfpShare(volume),
                shareService.createIscsiShare(volume)
            ]).bind(this).then(function (shares) {
                this.newSmbShare = shares[0];
                this.newNfsShare = shares[1];
                this.newAfpShare = shares[2];
                this.newIscsiShare = shares[3];
                //todo: can draw
            });
        }
    }
});
