const Model = {
    AccountCategory: 'AccountCategory' as 'AccountCategory',
    AccountSystem: 'AccountSystem' as 'AccountSystem',
    DiskUsage: 'DiskUsage' as 'DiskUsage',
    Alert: 'Alert' as 'Alert',
    AlertFilter: 'AlertFilter' as 'AlertFilter',
    AlertSettings: 'AlertSettings' as 'AlertSettings',
    AmazonS3Credentials: 'AmazonS3Credentials' as 'AmazonS3Credentials',
    BootEnvironment: 'BootEnvironment' as 'BootEnvironment',
    Calendar: 'Calendar' as 'Calendar',
    CalendarCustomSchedule: 'CalendarCustomSchedule' as 'CalendarCustomSchedule',
    CalendarTask: 'CalendarTask' as 'CalendarTask',
    CryptoCertificate: 'CryptoCertificate' as 'CryptoCertificate',
    Database: 'Database' as 'Database',
    Debug: 'Debug' as 'Debug',
    DetachedVolume: 'DetachedVolume' as 'DetachedVolume',
    Directory: 'Directory' as 'Directory',
    DirectoryserviceConfig: 'DirectoryserviceConfig' as 'DirectoryserviceConfig',
    DirectoryServices: 'DirectoryServices' as 'DirectoryServices',
    Disk: 'Disk' as 'Disk',
    DockerCollection: 'DockerCollection' as 'DockerCollection',
    DockerConfig: 'DockerConfig' as 'DockerConfig',
    DockerContainer: 'DockerContainer' as 'DockerContainer',
    DockerContainerBridge: 'DockerContainerBridge' as 'DockerContainerBridge',
    DockerContainerCreator: 'DockerContainerCreator' as 'DockerContainerCreator',
    DockerContainerLogs: 'DockerContainerLogs' as 'DockerContainerLogs',
    DockerContainerSection: 'DockerContainerSection' as 'DockerContainerSection',
    DockerHost: 'DockerHost' as 'DockerHost',
    DockerImage: 'DockerImage' as 'DockerImage',
    DockerImagePull: 'DockerImagePull' as 'DockerImagePull',
    EncryptedVolumeActions: 'EncryptedVolumeActions' as 'EncryptedVolumeActions',
    EncryptedVolumeImporter: 'EncryptedVolumeImporter' as 'EncryptedVolumeImporter',
    FreenasCredentials: 'FreenasCredentials' as 'FreenasCredentials',
    Group: 'Group' as 'Group',
    ImportableDisk: 'ImportableDisk' as 'ImportableDisk',
    Ipmi: 'Ipmi' as 'Ipmi',
    KerberosKeytab: 'KerberosKeytab' as 'KerberosKeytab',
    KerberosRealm: 'KerberosRealm' as 'KerberosRealm',
    Mail: 'Mail' as 'Mail',
    NetworkConfig: 'NetworkConfig' as 'NetworkConfig',
    NetworkHost: 'NetworkHost' as 'NetworkHost',
    NetworkInterface: 'NetworkInterface' as 'NetworkInterface',
    NetworkInterfaceBridgeProperties: 'NetworkInterfaceBridgeProperties' as 'NetworkInterfaceBridgeProperties',
    NetworkInterfaceLaggProperties: 'NetworkInterfaceLaggProperties' as 'NetworkInterfaceLaggProperties',
    NetworkInterfaceVlanProperties: 'NetworkInterfaceVlanProperties' as 'NetworkInterfaceVlanProperties',
    NetworkRoute: 'NetworkRoute' as 'NetworkRoute',
    NtpServer: 'NtpServer' as 'NtpServer',
    Peer: 'Peer' as 'Peer',
    Permissions: 'Permissions' as 'Permissions',
    Replication: 'Replication' as 'Replication',
    ReplicationOptions: 'ReplicationOptions' as 'ReplicationOptions',
    CompressReplicationTransportOption: 'CompressReplicationTransportOption' as 'CompressReplicationTransportOption',
    EncryptReplicationTransportOption: 'EncryptReplicationTransportOption' as 'EncryptReplicationTransportOption',
    ThrottleReplicationTransportOption: 'ThrottleReplicationTransportOption' as 'ThrottleReplicationTransportOption',
    RsyncdModule: 'RsyncdModule' as 'RsyncdModule',
    Section: 'Section' as 'Section',
    SectionSettings: 'SectionSettings' as 'SectionSettings',
    Service: 'Service' as 'Service',
    ServiceDc: 'ServiceDc' as 'ServiceDc',
    ServiceDyndns: 'ServiceDyndns' as 'ServiceDyndns',
    ServicesCategory: 'ServicesCategory' as 'ServicesCategory',
    ServiceUps: 'ServiceUps' as 'ServiceUps',
    Share: 'Share' as 'Share',
    SshCredentials: 'SshCredentials' as 'SshCredentials',
    SupportCategory: 'SupportCategory' as 'SupportCategory',
    SupportTicket: 'SupportTicket' as 'SupportTicket',
    SystemAdvanced: 'SystemAdvanced' as 'SystemAdvanced',
    SystemGeneral: 'SystemGeneral' as 'SystemGeneral',
    SystemSection: 'SystemSection' as 'SystemSection',
    SystemTime: 'SystemTime' as 'SystemTime',
    SystemUi: 'SystemUi' as 'SystemUi',
    Task: 'Task' as 'Task',
    Tunable: 'Tunable' as 'Tunable',
    UnixPermissions: 'UnixPermissions' as 'UnixPermissions',
    Update: 'Update' as 'Update',
    User: 'User' as 'User',
    Vm: 'Vm' as 'Vm',
    VmConfig: 'VmConfig' as 'VmConfig',
    VmDevice: 'VmDevice' as 'VmDevice',
    VmDatastore: 'VmDatastore' as 'VmDatastore',
    VmReadme: 'VmReadme' as 'VmReadme',
    VmVolume: 'VmVolume' as 'VmVolume',
    VmwareCredentials: 'VmwareCredentials' as 'VmwareCredentials',
    VmwareDataset: 'VmwareDataset' as 'VmwareDataset',
    VmwareDatastore: 'VmwareDatastore' as 'VmwareDatastore',
    Volume: 'Volume' as 'Volume',
    VolumeDataset: 'VolumeDataset' as 'VolumeDataset',
    VolumeDatasetProperties: 'VolumeDatasetProperties' as 'VolumeDatasetProperties',
    VolumeDatasetPropertyAtime: 'VolumeDatasetPropertyAtime' as 'VolumeDatasetPropertyAtime',
    VolumeDatasetPropertyCasesensitivity: 'VolumeDatasetPropertyCasesensitivity' as 'VolumeDatasetPropertyCasesensitivity',
    VolumeDatasetPropertyCompression: 'VolumeDatasetPropertyCompression' as 'VolumeDatasetPropertyCompression',
    VolumeDatasetPropertyDedup: 'VolumeDatasetPropertyDedup' as 'VolumeDatasetPropertyDedup',
    VolumeDatasetPropertyQuota: 'VolumeDatasetPropertyQuota' as 'VolumeDatasetPropertyQuota',
    VolumeDatasetPropertyRefquota: 'VolumeDatasetPropertyRefquota' as 'VolumeDatasetPropertyRefquota',
    VolumeDatasetPropertyRefreservation: 'VolumeDatasetPropertyRefreservation' as 'VolumeDatasetPropertyRefreservation',
    VolumeDatasetPropertyReservation: 'VolumeDatasetPropertyReservation' as 'VolumeDatasetPropertyReservation',
    VolumeDatasetPropertyVolblocksize: 'VolumeDatasetPropertyVolblocksize' as 'VolumeDatasetPropertyVolblocksize',
    VolumeImporter: 'VolumeImporter' as 'VolumeImporter',
    VolumeSnapshot: 'VolumeSnapshot' as 'VolumeSnapshot',
    VolumeVdevRecommendations: 'VolumeVdevRecommendations' as 'VolumeVdevRecommendations',
    ZfsTopology: 'ZfsTopology' as 'ZfsTopology',
    ZfsVdev: 'ZfsVdev' as 'ZfsVdev'
};
type Model = (typeof Model)[keyof typeof Model];
export { Model };

