export class ModelEventName {
    public static NtpServer = new ModelEventName('NtpServer');
    public static Disk = new ModelEventName('Disk');
    public static Volume = new ModelEventName('Volume');
    public static User = new ModelEventName('User');
    public static Group = new ModelEventName('Group');
    public static Directory = new ModelEventName('Directory');

    public listChange: string;
    public add: Function;
    public remove: Function;
    public change: Function;

    private constructor(modelName: string) {
        this.listChange = modelName + 'ListChange';
        this.add = (id) => modelName + 'Add.' + id;
        this.remove = (id) => modelName + 'Remove.' + id;
        this.change = (id) => modelName + '.' + id;
    }
}
