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

    _update_info: {
        value: {
          "notice": null,
          "notes": null,
          "downloaded": false,
          "changelog": "",
          "operations": [
            {
              "previous_name": "base-os",
              "new_name": "base-os",
              "operation": "upgrade",
              "previous_version": "10-MASTER-201604162130-668203ad6da5e38b090a72879000b32d",
              "new_version": "10-MASTER-201604192039-120da5424ffa96ff197238e4c682b899"
            },
            {
              "previous_name": "freebsd-pkgdb",
              "new_name": "freebsd-pkgdb",
              "operation": "upgrade",
              "previous_version": "10-MASTER-201604162130-668203ad6da5e38b090a72879000b32d",
              "new_version": "10-MASTER-201604192039-120da5424ffa96ff197238e4c682b899"
            },
            {
              "previous_name": "freenas-pkg-tools",
              "new_name": "freenas-pkg-tools",
              "operation": "upgrade",
              "previous_version": "10-MASTER-201604142240-c042d707b5fc68af13493812b2ba23f7",
              "new_version": "10-MASTER-201604192039-120da5424ffa96ff197238e4c682b899"
            },
            {
              "previous_name": "freenasUI",
              "new_name": "freenasUI",
              "operation": "upgrade",
              "previous_version": "10-MASTER-201604160150-40b904c49257cd1fb03cbe5fe02ab150",
              "new_version": "10-MASTER-201604192039-120da5424ffa96ff197238e4c682b899"
            },
            {
              "previous_name": "middleware",
              "new_name": "middleware",
              "operation": "upgrade",
              "previous_version": "10-MASTER-201604160150-40b904c49257cd1fb03cbe5fe02ab150",
              "new_version": "10-MASTER-201604192039-120da5424ffa96ff197238e4c682b899"
            }
          ]
        }
    },

    config: {
        get: function() {
            return this._config;
        }
    },

    trains: {
        get: function() {
            return this._trains;
        }
    },

    update_info: {
        get: function() {
            return this._update_info;
        }
    }
});
