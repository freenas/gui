export class ModelEventName {
    public static NtpServer = new ModelEventName('NtpServer');
    public static Disk = new ModelEventName('Disk');
    public static Volume = new ModelEventName('Volume');
    public static VolumeSnapshot = new ModelEventName('VolumeSnapshot');
    public static VolumeDataset = new ModelEventName('VolumeDataset');
    public static User = new ModelEventName('User');
    public static Group = new ModelEventName('Group');
    public static Directory = new ModelEventName('Directory');
    public static Alert = new ModelEventName('Alert');
    public static Task = new ModelEventName('Task');
    public static CalendarTask = new ModelEventName('CalendarTask');
    public static Peer = new ModelEventName('Peer');
    public static Vm = new ModelEventName('Vm');
    public static Share = new ModelEventName('Share');
    public static VmwareDataset = new ModelEventName('VmwareDataset');
    public static Replication = new ModelEventName('Replication');
    public static CryptoCertificate = new ModelEventName('CryptoCertificate');
    public static Tunable = new ModelEventName('Tunable');
    public static NetworkInterface = new ModelEventName('NetworkInterface');

    public listChange: string;
    public contentChange: string;
    public add: Function;
    public remove: Function;
    public change: Function;

    private constructor(modelName: string) {
        this.listChange = modelName + 'ListChange';
        this.contentChange = modelName + 'ContentChange';
        this.add = (id) => modelName + 'Add.' + id;
        this.remove = (id) => modelName + 'Remove.' + id;
        this.change = (id) => modelName + '.' + id;
    }
}
