/**
 * @module ui/table-row-port.reel
 */
var Component = require("montage/ui/component").Component;

/**
 * @class TableRowPort
 * @extends Component
 */
exports.TableRowPort = Component.specialize({
    classValues: {
        value:  [
            "SystemShutdown",
            "VolumeDiskReplaced",
            "UpdateDownloaded",
            "VolumeDegraded",
            "DockerContainerDied",
            "SystemReboot",
            "VolumeUpgradePossible",
            "UpdateInstalled",
            "DirectoryServiceBindFailed",
            "VMwareSnapshotFailed",
            "DiskControllerFirmwareMismatch",
            "UserMessage",
            "UpdateAvailable"
        ]
    },

    severityValues: {
        value: [
            "CRITICAL",
            "WARNING",
            "INFO"
        ]
    }
});
