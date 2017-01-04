"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var model_1 = require("../model");
var CalendarTaskDao = (function (_super) {
    __extends(CalendarTaskDao, _super);
    function CalendarTaskDao() {
        return _super.call(this, model_1.Model.CalendarTask, {
            queryMethod: 'calendar_task.query',
            updateMethod: 'calendar_task.update',
            createMethod: 'calendar_task.create',
            eventName: 'entity-subscriber.calendar_task.changed'
        }) || this;
    }
    return CalendarTaskDao;
}(abstract_dao_1.AbstractDao));
exports.CalendarTaskDao = CalendarTaskDao;
