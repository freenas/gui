var Component = require("montage/ui/component").Component;

/**
 * @class SystemInfo
 * @extends Component
 */
exports.SystemInfo = Component.specialize({

    enterDocument: {
        value: function (firstTime) {
            if (firstTime) {
                this.populateSystemInfo();
            }
        }
    },

    system: {
        value: null
    },

    populateSystemInfo: {
        value: function () {
            this.system = {
                hostname: 'foo-box',
                cpu: {
                    frequency: '300MHz',
                    cores: '64'
                },
                memory: '655360',
                platform: "iXsystems FreeNAS Mini",
                osVersion: "FreeNAS X v0.1",
                memoryDetails: "1866MHz ECC",
                drivesSize: "20 x 4 TB",
                drivesDetails: "7200rpm STA"
            }
        }
    }

});
