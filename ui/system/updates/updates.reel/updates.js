/**
 * @module ui/updates.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class Updates
 * @extends Component
 */
exports.Updates = Component.specialize(/** @lends Updates# */ {
    constructor: {
        value: function Updates() {
            this.super();
        }
    },

    _config: {
        value:
            {
              "check_auto": true,
              "update_server": "http://update.freenas.org/FreeNAS",
              "train": "FreeNAS-10-Nightlies"
            }
    },

    _trains: {
        value: [
                  {
                    "name": "FreeNAS-9.3-STABLE",
                    "current": false,
                    "description": null,
                    "sequence": null
                  },
                  {
                    "name": "FreeNAS-10-Nightlies",
                    "current": true,
                    "description": "Installed OS",
                    "sequence": "120da5424ffa96ff197238e4c682b899"
                  },
                  {
                    "name": "FreeNAS-9.10-STABLE",
                    "current": false,
                    "description": null,
                    "sequence": null
                  },
                  {
                    "name": "FreeNAS-9.10-Nightlies",
                    "current": false,
                    "description": null,
                    "sequence": null
                  }
                ]
    },
    }
});
