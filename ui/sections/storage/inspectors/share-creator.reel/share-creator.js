var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

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

    newWebdavShare: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },

    enterDocument: {
        value: function(isFirstTime) {
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
                this._shareService = this.application.shareService;
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "_handleSelectionChange");
            }

            this._populateNewShareObjectList();
            if (this.parentCascadingListItem) {
                this.parentCascadingListItem.selectedObject = null;
            }
        }
    },

    _getCurrentVolume: {
        value: function() {
            var currentSelection = this._selectionService.getCurrentSelection();

            for (var i = currentSelection.length - 1; i >= 0; i--) {
                if (currentSelection[i].constructor.Type == Model.Volume) {
                    return currentSelection[i];
                }
            }
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
                shareService.createIscsiShare(volume),
                shareService.createWebdavShare(volume)
            ]).bind(this).then(function (shares) {
                this.newSmbShare = shares[0];
                this.newNfsShare = shares[1];
                this.newAfpShare = shares[2];
                this.newIscsiShare = shares[3];
                this.newWebdavShare = shares[4];
                //todo: can draw
            });
        }
    },

    _handleSelectionChange: {
        value: function () {
            if (this.parentCascadingListItem && this.parentCascadingListItem.selectedObject) {
                if (this._inDocument) {
                    this.parentCascadingListItem.cascadingList.pop();
                }
            }
        }
    }
});
