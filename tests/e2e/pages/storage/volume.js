module.exports = {
    elements: {
        root: 'div.CascadingList-repetition',
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
};
