"use strict";
var _ = require("lodash");
var DataObjectChangeService = (function () {
    function DataObjectChangeService() {
    }
    DataObjectChangeService.prototype.handleDataChange = function (uiObjects, state, objectType) {
        state.forEach(function (volume) {
            var entry = _.find(uiObjects, { id: volume.get('id') });
            if (entry) {
                Object.assign(entry, volume.toJS());
            }
            else {
                entry = volume.toJS();
                uiObjects.push(entry);
            }
        });
        if (uiObjects) {
            for (var i = uiObjects.length - 1; i >= 0; i--) {
                var uiObject = uiObjects[i];
                if (!state.has(uiObject.id) && (!objectType || objectType === uiObject._objectType)) {
                    uiObjects.splice(i, 1);
                }
            }
        }
    };
    return DataObjectChangeService;
}());
exports.DataObjectChangeService = DataObjectChangeService;
