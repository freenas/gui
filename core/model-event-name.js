"use strict";
var ModelEventName = (function () {
    function ModelEventName(modelName) {
        this.listChange = modelName + 'ListChange';
        this.contentChange = modelName + 'ContentChange';
        this.add = function (id) { return modelName + 'Add.' + id; };
        this.remove = function (id) { return modelName + 'Remove.' + id; };
        this.change = function (id) { return modelName + '.' + id; };
    }
    ModelEventName.NtpServer = new ModelEventName('NtpServer');
    ModelEventName.Disk = new ModelEventName('Disk');
    ModelEventName.Volume = new ModelEventName('Volume');
    ModelEventName.VolumeSnapshot = new ModelEventName('VolumeSnapshot');
    ModelEventName.VolumeDataset = new ModelEventName('VolumeDataset');
    ModelEventName.User = new ModelEventName('User');
    ModelEventName.Group = new ModelEventName('Group');
    ModelEventName.Directory = new ModelEventName('Directory');
    ModelEventName.Alert = new ModelEventName('Alert');
    ModelEventName.Task = new ModelEventName('Task');
    ModelEventName.CalendarTask = new ModelEventName('CalendarTask');
    ModelEventName.Peer = new ModelEventName('Peer');
    ModelEventName.Vm = new ModelEventName('Vm');
    ModelEventName.Share = new ModelEventName('Share');
    ModelEventName.VmwareDataset = new ModelEventName('VmwareDataset');
    ModelEventName.Replication = new ModelEventName('Replication');
    ModelEventName.CryptoCertificate = new ModelEventName('CryptoCertificate');
    ModelEventName.Tunable = new ModelEventName('Tunable');
    ModelEventName.NetworkInterface = new ModelEventName('NetworkInterface');
    ModelEventName.KerberosRealm = new ModelEventName('KerberosRealm');
    ModelEventName.KerberosKeytab = new ModelEventName('KerberosKeytab');
    ModelEventName.DetachedVolume = new ModelEventName('DetachedVolume');
    ModelEventName.RsyncdModule = new ModelEventName('RsyncdModule');
    return ModelEventName;
}());
exports.ModelEventName = ModelEventName;
