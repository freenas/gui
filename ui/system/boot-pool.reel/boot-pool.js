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
        value: [{
                    "realname": "default",
                    "space": "390.0K",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "default"
                },
                {
                    "realname": "Initial-Install",
                    "space": "2.2M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "Initial-Install"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604151347",
                    "space": "2.5M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604151347"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604151543",
                    "space": "20.3M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604151543"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604162130",
                    "space": "20.1M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604162130"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604180930",
                    "space": "19.8M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604180930"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604181954",
                    "space": "20.2M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604181954"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604182149",
                    "space": "20.5M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "-",
                    "active": false,
                    "on_reboot": false,
                    "id": "FreeNAS-10-MASTER-201604182149"
                },
                {
                    "realname": "FreeNAS-10-MASTER-201604190930",
                    "space": "881.0M",
                    "created": {},
                    "keep": null,
                    "mountpoint": "/",
                    "active": true,
                    "on_reboot": true,
                    "id": "FreeNAS-10-MASTER-201604190930"
                }]
    },

    bootEnvironments: {
        get: function() {
            return this._bootEnvironments;
        }
    }
});
