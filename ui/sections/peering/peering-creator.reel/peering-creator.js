/**
 * @module ui/sections/peering/peering-creator.reel
 */
var Component = require("montage/ui/component").Component,
    Model = require("core/model/model").Model;

/**
 * @class PeeringCreator
 * @extends Component
 */
exports.PeeringCreator = Component.specialize(/** @lends PeeringCreator# */ {

    newSsh: {
        value: null
    },

    newAmazonS3: {
        value: null
    },

    newFreenas: {
        value: null
    },

    newVmware: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },

    enterDocument: {
        value: function (isFirstTime) {
            if (isFirstTime) {
                this._selectionService = this.application.selectionService;
                this._peeringService = this.application.peeringService;
            }

            this._populateNewPeerObjectList();
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

    _populateNewPeerObjectList: {
        value: function () {
            var volume = this._getCurrentVolume(),
                peeringService = this._peeringService;

            Promise.all([
                peeringService.populateObjectPeeringSsh(),
                peeringService.populateObjectPeeringFreenas(),
                peeringService.populateObjectPeeringAmazonS3(),
                peeringService.populateObjectPeeringVmware(),
            ]).bind(this).then(function (peeringCredentials) {
                this.newSsh = peeringCredentials[0];
                this.newFreenas = peeringCredentials[1];
                this.newAmazonS3 = peeringCredentials[2];
                this.newVmware = peeringCredentials[3];
            });
        }
    }
});
