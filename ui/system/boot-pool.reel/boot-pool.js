/**
 * @module ui/boot-pool.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class BootPool
 * @extends Component
 */
exports.BootPool = Component.specialize(/** @lends BootPool# */ {
    constructor: {
        value: function BootPool() {
            this.super();
        }
    },

    _bootEnvironments: {
        value: [
                {
                    "created": {
                        "$date": "2016-04-15 09:20:00"
                    },
                    "on_reboot": false,
                    "realname": "default",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "default",
                    "space": "390.0K"
                },
                {
                    "created": {
                        "$date": "2016-04-15 09:24:00"
                    },
                    "on_reboot": false,
                    "realname": "Initial-Install",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "Initial-Install",
                    "space": "2.2M"
                },
                {
                    "created": {
                        "$date": "2016-04-15 09:38:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604151347",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604151347",
                    "space": "2.5M"
                },
                {
                    "created": {
                        "$date": "2016-04-15 10:12:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604151543",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604151543",
                    "space": "20.3M"
                },
                {
                    "created": {
                        "$date": "2016-04-17 00:31:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604162130",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604162130",
                    "space": "20.1M"
                },
                {
                    "created": {
                        "$date": "2016-04-18 09:33:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604180930",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604180930",
                    "space": "19.8M"
                },
                {
                    "created": {
                        "$date": "2016-04-18 15:31:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604181954",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604181954",
                    "space": "20.2M"
                },
                {
                    "created": {
                        "$date": "2016-04-18 16:42:00"
                    },
                    "on_reboot": false,
                    "realname": "FreeNAS-10-MASTER-201604182149",
                    "keep": null,
                    "active": false,
                    "mountpoint": "-",
                    "id": "FreeNAS-10-MASTER-201604182149",
                    "space": "20.5M"
                },
                {
                    "created": {
                        "$date": "2016-04-19 10:02:00"
                    },
                    "on_reboot": true,
                    "realname": "FreeNAS-10-MASTER-201604190930",
                    "keep": null,
                    "active": true,
                    "mountpoint": "/",
                    "id": "FreeNAS-10-MASTER-201604190930",
                    "space": "881.0M"
                }
            ]
    },

    bootEnvironments: {
        get: function() {
            return this._bootEnvironments;
        }
    }
});
