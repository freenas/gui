"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var AbstractModelRepository = (function (_super) {
    __extends(AbstractModelRepository, _super);
    function AbstractModelRepository(model) {
        var _this = _super.call(this, [model]) || this;
        _this.modelEventName = model_event_name_1.ModelEventName[model];
        return _this;
    }
    AbstractModelRepository.prototype.handleStateChange = function (name, state) {
        this.localState = this.dispatchModelEvents(this.localState, this.modelEventName, state);
    };
    AbstractModelRepository.prototype.handleEvent = function (name, data) {
    };
    return AbstractModelRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.AbstractModelRepository = AbstractModelRepository;
