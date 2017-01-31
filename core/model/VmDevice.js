"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractDataObject_1 = require("./AbstractDataObject");
var VmDevice = (function (_super) {
    __extends(VmDevice, _super);
    function VmDevice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VmDevice;
}(AbstractDataObject_1.AbstractDataObject));
exports.VmDevice = VmDevice;
