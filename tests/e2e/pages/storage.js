module.exports = {
    elements: {
        tasksList: 'div.Sideboard div.Tasks div.Notifications-items',

        root: 'div.CascadingList-repetition',
        volumeCreateButton: 'div.CascadingListItem:nth-child(1) div[data-montage-id=createButton]',
        volumeCreator: 'div.CascadingListItem:nth-child(2) div.VolumeCreator',
        newVolumeId: 'div.CascadingListItem:nth-child(2) div.VolumeCreator div[data-montage-id=name] input.TextField',
        topologizerProfile: 'div.CascadingListItem:nth-child(2) div.VolumeCreator div.Topologizer-profiles',
        dataVdev: 'div.CascadingListItem:nth-child(2) div.Topology-data div.TopologyDropZone div.Vdev',
        volumeCreatorSave: 'div.CascadingListItem:nth-child(2) div.VolumeCreator button.InspectorFooter-save',
        volumeCreationTask: 'div.Sideboard div.Tasks div.Notifications-items div.TaskNotification:nth-child(1)',
        firstVolume: 'div.CascadingListItem:nth-child(1) div.Viewer-list div.ListItem',
        firstVolumeLabel: 'div.CascadingListItem:nth-child(1) div.Viewer-list div.ListItem div.ListItem-label',

        volumeInspectorCascadingListItemTitle: 'div.CascadingListItem:nth-child(2) div.CascadingListItem-title',
        volumeInspector: 'div.CascadingListItem:nth-child(2) div.Volume',
        volumeDetachButton: 'div.CascadingListItem:nth-child(2) div.Volume button[value=Detach]',
        detachedVolumeInspector: 'div.CascadingListItem:nth-child(2) div.DetachedVolume',
        volumeImportButton: 'div.CascadingListItem:nth-child(2) div.DetachedVolume button[value=Import]',
        volumeDeleteButton: 'div.CascadingListItem:nth-child(2) div.Volume button.InspectorFooter-delete',
        confirmationMessage: 'div.CascadingListItem:nth-child(2) div.Volume div.InspectorConfirmation-message',
        confirmActionButton: 'div.CascadingListItem:nth-child(2) div.Volume div.InspectorConfirmation button[data-montage-id=confirmDelete]',

        volumesList: 'div.CascadingListItem:nth-child(1) div.Viewer div.Viewer-list div[data-montage-id=repetition]',
        sharesOption: 'div.CascadingListItem:nth-child(2) div[data-montage-id=shares].InspectorOption',
        sharesList: 'div.CascadingListItem:nth-child(3) div.Viewer div.Viewer-list div[data-montage-id=repetition]',
        sharesCreate: 'div.CascadingListItem:nth-child(3) div.Viewer div[data-montage-id=createButton]',
        shareCreator: 'div.CascadingListItem:nth-child(4) div.ShareCreator',
        shareCreatorSmb: 'div.CascadingListItem:nth-child(4) div.ShareCreator div[data-montage-id=smb]',
        shareInspector: 'div.CascadingListItem:nth-child(4) div.Share',
        shareInspectorSmb: 'div.CascadingListItem:nth-child(4) div.SmbShare',
        shareOverview: 'div.CascadingListItem:nth-child(4) div.ShareOverview',
        shareTypeSelectedValue: 'div.CascadingListItem:nth-child(4) div[data-montage-id=targetTypeSelect] span.Select-currentOption',
    },
    commands: [
        {
            pause: function(ms) {
                this.api.pause(ms);
                return this;
            }
        }
    ]
}

