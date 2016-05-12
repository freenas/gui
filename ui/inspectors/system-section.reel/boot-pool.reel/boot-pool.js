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

    _bootVolume: {
        value: {
          "groups": {
            "log": [],
            "data": [
              {
                "path": null,
                "status": "ONLINE",
                "guid": "17703625906260201561",
                "type": "mirror",
                "stats": {
                  "write_errors": 0,
                  "ops": [
                    0,
                    5146,
                    4243,
                    2570,
                    0
                  ],
                  "configured_ashift": 9,
                  "allocated": 944953344,
                  "read_errors": 0,
                  "physical_ashift": 0,
                  "fragmentation": 18446744073709552000,
                  "size": 21340618752,
                  "checksum_errors": 0,
                  "timestamp": 38445998724,
                  "bytes": [
                    0,
                    71844352,
                    18700800,
                    16761344,
                    0
                  ],
                  "logical_ashift": 9
                },
                "children": [
                  {
                    "path": "/dev/da0p2",
                    "status": "ONLINE",
                    "guid": "5022510399910871093",
                    "type": "disk",
                    "stats": {
                      "write_errors": 0,
                      "ops": [
                        1,
                        2304,
                        1981,
                        2570,
                        0
                      ],
                      "configured_ashift": 9,
                      "allocated": 0,
                      "read_errors": 0,
                      "physical_ashift": 0,
                      "fragmentation": 0,
                      "size": 0,
                      "checksum_errors": 0,
                      "timestamp": 38445998724,
                      "bytes": [
                        0,
                        39316480,
                        19241472,
                        16761344,
                        0
                      ],
                      "logical_ashift": 9
                    },
                    "children": []
                  },
                  {
                    "path": "/dev/da1p2",
                    "status": "ONLINE",
                    "guid": "10492181922006432126",
                    "type": "disk",
                    "stats": {
                      "write_errors": 0,
                      "ops": [
                        1,
                        2941,
                        1972,
                        2570,
                        0
                      ],
                      "configured_ashift": 9,
                      "allocated": 0,
                      "read_errors": 0,
                      "physical_ashift": 0,
                      "fragmentation": 0,
                      "size": 0,
                      "checksum_errors": 0,
                      "timestamp": 38445998724,
                      "bytes": [
                        0,
                        36567552,
                        19241472,
                        16761344,
                        0
                      ],
                      "logical_ashift": 9
                    },
                    "children": []
                  }
                ]
              }
            ],
            "cache": [],
            "spare": []
          },
          "guid": "17496272137915919411",
          "scan": {
            "start_time": null,
            "bytes_to_process": null,
            "bytes_processed": null,
            "percentage": null,
            "function": null,
            "end_time": null,
            "errors": null,
            "state": null
          },
          "properties": {
            "allocated": {
              "rawvalue": "944953344",
              "source": "NONE",
              "value": "901M"
            },
            "size": {
              "rawvalue": "21340618752",
              "source": "NONE",
              "value": "19.9G"
            },
            "name": {
              "rawvalue": "freenas-boot",
              "source": "NONE",
              "value": "freenas-boot"
            },
            "free": {
              "rawvalue": "20395665408",
              "source": "NONE",
              "value": "19.0G"
            },
            "bootfs": {
              "rawvalue": "freenas-boot/ROOT/FreeNAS-10-MASTER-201604190930",
              "source": "LOCAL",
              "value": "freenas-boot/ROOT/FreeNAS-10-MASTER-201604190930"
            },
            "capacity": {
              "rawvalue": "4",
              "source": "NONE",
              "value": "4%"
            },
            "health": {
              "rawvalue": "ONLINE",
              "source": "NONE",
              "value": "ONLINE"
            },
            "guid": {
              "rawvalue": "17496272137915919411",
              "source": "DEFAULT",
              "value": "17496272137915919411"
            }
          },
          "name": "freenas-boot",
          "id": "freenas-boot",
          "status": "ONLINE",
          "root_vdev": {
            "type": "root",
            "guid": "17496272137915919411",
            "path": null,
            "stats": {
              "write_errors": 0,
              "ops": [
                0,
                5146,
                4243,
                2570,
                0
              ],
              "configured_ashift": 0,
              "allocated": 944953344,
              "read_errors": 0,
              "physical_ashift": 0,
              "fragmentation": 0,
              "size": 21340618752,
              "checksum_errors": 0,
              "timestamp": 38445998724,
              "bytes": [
                0,
                71844352,
                18700800,
                16761344,
                0
              ],
              "logical_ashift": 0
            },
            "status": "ONLINE"
          },
          "error_count": 0,
          "hostname": "ben_freenas.local",
          "root_dataset": {
            "name": "freenas-boot",
            "pool": "freenas-boot",
            "type": "FILESYSTEM",
            "mountpoint": null,
            "id": "freenas-boot",
            "properties": {
              "unique": {
                "rawvalue": "31744",
                "source": "NONE",
                "value": "31K"
              },
              "reservation": {
                "rawvalue": "0",
                "source": "DEFAULT",
                "value": "none"
              },
              "usedbysnapshots": {
                "rawvalue": "0",
                "source": "NONE",
                "value": "0"
              },
              "org.freenas:uuid": {
                "rawvalue": "a6073a7e-5577-402b-ab17-a878bb19e42d",
                "source": "LOCAL",
                "value": "a6073a7e-5577-402b-ab17-a878bb19e42d"
              },
              "name": {
                "rawvalue": "freenas-boot",
                "source": "NONE",
                "value": "freenas-boot"
              },
              "logicalreferenced": {
                "rawvalue": "15872",
                "source": "NONE",
                "value": "15.5K"
              },
              "written": {
                "rawvalue": "31744",
                "source": "NONE",
                "value": "31K"
              },
              "usedbychildren": {
                "rawvalue": "942167552",
                "source": "NONE",
                "value": "899M"
              },
              "version": {
                "rawvalue": "5",
                "source": "NONE",
                "value": "5"
              },
              "creation": {
                "rawvalue": "1460737225",
                "source": "NONE",
                "value": "Fri Apr 15 16:20 2016"
              },
              "logicalused": {
                "rawvalue": "2462564352",
                "source": "NONE",
                "value": "2.29G"
              },
              "available": {
                "rawvalue": "19731525120",
                "source": "NONE",
                "value": "18.4G"
              },
              "compressratio": {
                "rawvalue": "2.66x",
                "source": "NONE",
                "value": "2.66x"
              },
              "snapshot_count": {
                "rawvalue": "18446744073709551615",
                "source": "DEFAULT",
                "value": "none"
              },
              "guid": {
                "rawvalue": "1070424767591427526",
                "source": "NONE",
                "value": "1070424767591427526"
              },
              "mountpoint": {
                "rawvalue": "none",
                "source": "LOCAL",
                "value": "none"
              },
              "filesystem_limit": {
                "rawvalue": "18446744073709551615",
                "source": "DEFAULT",
                "value": "none"
              },
              "canmount": {
                "rawvalue": "off",
                "source": "LOCAL",
                "value": "off"
              },
              "mounted": {
                "rawvalue": "no",
                "source": "NONE",
                "value": "no"
              },
              "compression": {
                "rawvalue": "lz4",
                "source": "LOCAL",
                "value": "lz4"
              },
              "referenced": {
                "rawvalue": "31744",
                "source": "NONE",
                "value": "31K"
              },
              "usedbydataset": {
                "rawvalue": "31744",
                "source": "NONE",
                "value": "31K"
              },
              "snapshot_limit": {
                "rawvalue": "18446744073709551615",
                "source": "DEFAULT",
                "value": "none"
              },
              "used": {
                "rawvalue": "942199296",
                "source": "NONE",
                "value": "899M"
              },
              "filesystem_count": {
                "rawvalue": "18446744073709551615",
                "source": "DEFAULT",
                "value": "none"
              }
            }
          }
        }
    },

    bootEnvironments: {
        get: function() {
            return this._bootEnvironments;
        }
    },

    bootVolume: {
        get: function() {
            return this._bootVolume;
        }
    }
});
