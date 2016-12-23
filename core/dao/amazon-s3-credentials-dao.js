"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_dao_ng_1 = require("./abstract-dao-ng");
var AmazonS3CredentialsDao = (function (_super) {
    __extends(AmazonS3CredentialsDao, _super);
    function AmazonS3CredentialsDao() {
        _super.call(this, 'AmazonS3Credentials');
    }
    return AmazonS3CredentialsDao;
}(abstract_dao_ng_1.AbstractDao));
exports.AmazonS3CredentialsDao = AmazonS3CredentialsDao;
