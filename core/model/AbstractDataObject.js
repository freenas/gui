"use strict";
var AbstractDataObject = (function () {
    function AbstractDataObject() {
        this._objectType = this.constructor.toString().split(/\(|s+/)[0].split(/ |s+/)[1];
    }
    AbstractDataObject.getClassName = function () {
        if (!this.className) {
            this.className = this.toString().split(/\(|s+/)[0].split(/s+/)[1];
        }
        return this.className;
    };
    AbstractDataObject.getEventNames = function () {
        if (!this.eventNames) {
            this.eventNames = new ModelEventName(this.getClassName());
        }
        return this.eventNames;
    };
    return AbstractDataObject;
}());
exports.AbstractDataObject = AbstractDataObject;
var ModelEventName = (function () {
    function ModelEventName(modelName) {
        this.listChange = modelName + 'ListChange';
        this.contentChange = modelName + 'ContentChange';
        this.add = function (id) { return modelName + 'Add.' + id; };
        this.remove = function (id) { return modelName + 'Remove.' + id; };
        this.change = function (id) { return modelName + '.' + id; };
    }
    return ModelEventName;
}());
