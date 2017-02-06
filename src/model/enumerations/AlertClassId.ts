const AlertClassId = {
    SystemShutdown: 'SystemShutdown' as 'SystemShutdown',
    SystemReboot: 'SystemReboot' as 'SystemReboot',
    UpdateAvailable: 'UpdateAvailable' as 'UpdateAvailable',
    UpdateDownloaded: 'UpdateDownloaded' as 'UpdateDownloaded',
    UpdateInstalled: 'UpdateInstalled' as 'UpdateInstalled',
    VolumeUpgradePossible: 'VolumeUpgradePossible' as 'VolumeUpgradePossible',
    VolumeDegraded: 'VolumeDegraded' as 'VolumeDegraded',
    VolumeDiskReplaced: 'VolumeDiskReplaced' as 'VolumeDiskReplaced',
    VMwareSnapshotFailed: 'VMwareSnapshotFailed' as 'VMwareSnapshotFailed',
    DockerContainerDied: 'DockerContainerDied' as 'DockerContainerDied',
    DiskControllerFirmwareMismatch: 'DiskControllerFirmwareMismatch' as 'DiskControllerFirmwareMismatch',
    SmartWarn: 'SmartWarn' as 'SmartWarn',
    SmartFail: 'SmartFail' as 'SmartFail',
    UserMessage: 'UserMessage' as 'UserMessage',
    UserLogin: 'UserLogin' as 'UserLogin',
    UserLogout: 'UserLogout' as 'UserLogout',
    DirectoryServiceBindFailed: 'DirectoryServiceBindFailed' as 'DirectoryServiceBindFailed',
    CalendarTaskFailed: 'CalendarTaskFailed' as 'CalendarTaskFailed',
    UpsSignal: 'UpsSignal' as 'UpsSignal',
    CrashDataFound: 'CrashDataFound' as 'CrashDataFound'
};
type AlertClassId = (typeof AlertClassId)[keyof typeof AlertClassId];
export {AlertClassId};
