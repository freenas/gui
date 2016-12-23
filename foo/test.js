module.exports = {
 'test case': function(client) {
     client.globals.waitForConditionTimeout = 10000;
   return client
     .resizeWindow(1024, 1018)
     .url('http://localhost:3000/#;host=pch-mini.local')
     .waitForElementPresent(".TextField.SignIn-userName.g-margin-bottom--half")
     .click(".TextField.SignIn-userName.g-margin-bottom--half")
     .waitForElementPresent(".TextField.SignIn-userName.g-margin-bottom--half")
     .setValue(".TextField.SignIn-userName.g-margin-bottom--half", "root")
     .waitForElementPresent(".TextField.SignIn-userName.g-margin-bottom--double")
     .setValue(".TextField.SignIn-userName.g-margin-bottom--double", "root")
     .waitForElementPresent("button[value='Sign In']")
     .click("button[value='Sign In']")
     .waitForElementPresent(".MainNavigationItem.MainNavigationItem-storage .MainNavigationItem-label.montage-Text")
     .click(".MainNavigationItem.MainNavigationItem-storage .MainNavigationItem-label.montage-Text")
     .waitForElementPresent(".List-item.active .ListItem")
     .click(".List-item.active .ListItem")
     .waitForElementPresent(".InspectorOption.g-margin-top--subtract.montage--active.selected .ListItem-label.montage-Text")
     .click(".InspectorOption.g-margin-top--subtract.montage--active.selected .ListItem-label.montage-Text")
     .waitForElementPresent(".Viewer-createButton.montage--active .Viewer-createButton-label.montage-Text")
     .click(".Viewer-createButton.montage--active .Viewer-createButton-label.montage-Text")
     .waitForElementPresent(".InspectorOption.montage--active.selected .ListItem-label.montage-Text")
     .click(".InspectorOption.montage--active.selected .ListItem-label.montage-Text")
     .waitForElementPresent(".Field.is-mandatory .TextField")
     .click(".Field.is-mandatory .TextField")
     .waitForElementPresent(".Field.is-mandatory .TextField")
     .setValue(".Field.is-mandatory .TextField", "foo")
     .waitForElementPresent(".Share .FieldCheckbox.wizard-is-hidden:nth-child(5) .Checkbox-label.montage-Text")
     .click(".Share .FieldCheckbox.wizard-is-hidden:nth-child(5) .Checkbox-label.montage-Text")
     .waitForElementPresent("input#checkbox-1481847359234")
     .click("input#checkbox-1481847359234")
     .waitForElementPresent(".Button.InspectorFooter-save.Button--primary.is-visible.montage--active .Button-label.montage-Text")
     .click(".Button.InspectorFooter-save.Button--primary.is-visible.montage--active .Button-label.montage-Text")

 }
};
