"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_1 = require("./abstract-dao");
var CryptoCertificateDao = (function (_super) {
    __extends(CryptoCertificateDao, _super);
    function CryptoCertificateDao() {
        _super.call(this, 'CryptoCertificate');
    }
    CryptoCertificateDao.prototype.listCountryCodes = function () {
        return this.middlewareClient.callRpcMethod('crypto.certificate.get_country_codes');
    };
    return CryptoCertificateDao;
}(abstract_dao_1.AbstractDao));
exports.CryptoCertificateDao = CryptoCertificateDao;
