"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractDataObject_1 = require("./AbstractDataObject");
var Replication = (function (_super) {
    __extends(Replication, _super);
    function Replication() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Replication;
}(AbstractDataObject_1.AbstractDataObject));
exports.Replication = Replication;
