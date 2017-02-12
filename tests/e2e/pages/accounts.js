module.exports = {
    elements: {
        tasksList: 'div.Sideboard div.Tasks div.Notifications-items',
        root: 'div.CascadingList-repetition',

        entriesList: 'div.CascadingListItem:nth-child(1) div.AccountCategory',

        userCategory: 'div.CascadingListItem:nth-child(1) div.AccountCategory-user',
        usersViewer: 'div.CascadingListItem:nth-child(2) div.Viewer',
        usersEntries: 'div.CascadingListItem:nth-child(2) div.List-item',
        userCreateButton: 'div.CascadingListItem:nth-child(2) div.Viewer-createButton',
        userInspector: 'div.CascadingListItem:nth-child(3) div.User',
        userSave: 'div.CascadingListItem:nth-child(3) div.User button.InspectorFooter-save',
        usernameField: 'div.CascadingListItem:nth-child(3) div.User div[data-montage-id=usernameEdit] .Field',
        usernameControl: 'div.CascadingListItem:nth-child(3) div.User div[data-montage-id=usernameEdit] input',
        userCreationNotification: '.Tasks .Notification.user_create',
        userCreationTask: '.Tasks .Notification.user_create .TaskNotification',
        userCreationTaskActive: '.Tasks .Notification.user_create .TaskNotification .Progress-active',

        userFoo: 'div.CascadingListItem:nth-child(2) .User',
        userFooLabel: 'div.CascadingListItem:nth-child(2) .User .ListItem-label',
        userFooSubLabel: 'div.CascadingListItem:nth-child(2) .User .ListItem-subLabel',
        usersDomainToggle: 'div.CascadingListItem:nth-child(2) .UserListOptions .ToggleSwitch',

        fullNameControl: 'div.CascadingListItem:nth-child(3) div.User div[data-montage-id=fullNameEdit] input',
        userUpdateNotification: '.Tasks .Notification.user_update',
        userUpdateTask: '.Tasks .Notification.user_update .TaskNotification',
        userUpdateTaskActive: '.Tasks .Notification.user_update .TaskNotification .Progress-active',

        userDelete: 'div.CascadingListItem:nth-child(3) div.User button.InspectorFooter-delete',
        userDeleteConfirmation: 'div.CascadingListItem:nth-child(3) .InspectorConfirmation',
        userDeleteHome: 'div.CascadingListItem:nth-child(3) .InspectorConfirmation .FieldCheckbox:nth-child(1) .Checkbox',
        userDeleteGroup: 'div.CascadingListItem:nth-child(3) .InspectorConfirmation .FieldCheckbox:nth-child(2) .Checkbox',
        userConfirmDelete: 'div.CascadingListItem:nth-child(3) .InspectorConfirmation .InspectorConfirmation-confirm',
        userCancelDelete: 'div.CascadingListItem:nth-child(3) .InspectorConfirmation .InspectorConfirmation-cancel',
        userDeleteNotification: '.Tasks .Notification.user_delete',
        userDeleteTask: '.Tasks .Notification.user_delete .TaskNotification',
        userDeleteTaskActive: '.Tasks .Notification.user_delete .TaskNotification .Progress-active',
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


