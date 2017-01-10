"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var methodCleaner_1 = require("../service/data-processor/methodCleaner");
var cleaner_1 = require("../service/data-processor/cleaner");
var null_1 = require("../service/data-processor/null");
var model_1 = require("../model");
var Promise = require("bluebird");
var CryptoCertificateDao = (function (_super) {
    __extends(CryptoCertificateDao, _super);
    function CryptoCertificateDao() {
        return _super.call(this, model_1.Model.CryptoCertificate) || this;
    }
    CryptoCertificateDao.prototype.listCountryCodes = function () {
        return this.middlewareClient.callRpcMethod('crypto.certificate.get_country_codes');
    };
    CryptoCertificateDao.prototype.import = function (certificate) {
        var _this = this;
        var taskName = 'crypto.certificate.import';
        return Promise.all([
            this.loadPropertyDescriptors(),
            this.loadTaskDescriptor(taskName)
        ]).spread(function (propertyDescriptors, methodDescriptor) {
            var newObject = methodCleaner_1.processor.process(null_1.processor.process(cleaner_1.processor.process(certificate, propertyDescriptors)), methodDescriptor);
            if (newObject) {
                return _this.middlewareClient.submitTask(taskName, [newObject]);
            }
        });
    };
    return CryptoCertificateDao;
}(abstract_dao_1.AbstractDao));
exports.CryptoCertificateDao = CryptoCertificateDao;
