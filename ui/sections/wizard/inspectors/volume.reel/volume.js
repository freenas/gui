/**
 * @module ui/volume.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Volume
 * @extends Component
 */
exports.Volume = Component.specialize(/** @lends Volume# */ {

    profile: {
        value: null
    },

    profiles: {
        value: null
    },

    templateDidLoad: {
        value: function () {
            this._sectionService = this.context.sectionService;
            this.profiles = this._sectionService.getProfiles();
        }
    },

    enterDocument:{
        value: function (isFirstTime) {
            if (isFirstTime) {
                self = this;

                this.addPathChangeListener("profile", this, "handleProfileChange");

                this._sectionService.listAvailableDisks().then(function (disks) {
                    self.availableDisks = disks;
                });
            }

            //Thanks to the binding.
            if (this.object.topology && this.object.topology.data) {
                this.context.isNextStepDisabled = !this.object.id || this.object.topology.data.length === 0;
            }
        }
    },

    handleProfileChange: {
        value: function () {
            if (this.profile) {
                var topologyProfile = this.profiles.get(this.profile);

                if (topologyProfile) {
                    var self = this;

                    this._sectionService.listAvailableDisks().then(function (disks) {
                        if (disks && disks.length) {
                            return self._sectionService.generateTopology(disks, topologyProfile);
                        }
                    }).then(function (topology) {
                        self.object.topology = topology;
                    });
                } else {
                    this.object.topology = null;
                }
            } else {
                this.object.topology = null;
            }
        }
    }

});
