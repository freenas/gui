"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var tunable_dao_1 = require("../dao/tunable-dao");
var model_event_name_1 = require("../model-event-name");
var model_1 = require("../model");
var TunableRepository = (function (_super) {
    __extends(TunableRepository, _super);
    function TunableRepository(tunableDao) {
        var _this = _super.call(this, [model_1.Model.Tunable]) || this;
        _this.tunableDao = tunableDao;
        return _this;
    }
    TunableRepository.getInstance = function () {
        if (!TunableRepository.instance) {
            TunableRepository.instance = new TunableRepository(new tunable_dao_1.TunableDao());
        }
        return TunableRepository.instance;
    };
    TunableRepository.prototype.listTunables = function () {
        return this.tunables ? Promise.resolve(this.tunables.valueSeq().toJS()) : this.tunableDao.list();
    };
    TunableRepository.prototype.getNewTunable = function () {
        return this.tunableDao.getNewInstance();
    };
    TunableRepository.prototype.handleStateChange = function (name, state) {
        this.tunables = this.dispatchModelEvents(this.tunables, model_event_name_1.ModelEventName.Tunable, state);
    };
    TunableRepository.prototype.handleEvent = function (name, data) { };
    return TunableRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.TunableRepository = TunableRepository;
