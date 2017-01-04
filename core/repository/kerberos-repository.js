"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var kerberos_keytab_dao_1 = require("../dao/kerberos-keytab-dao");
var kerberos_realm_dao_1 = require("../dao/kerberos-realm-dao");
var model_1 = require("../model");
var abstract_repository_ng_1 = require("./abstract-repository-ng");
var model_event_name_1 = require("../model-event-name");
var KerberosRepository = (function (_super) {
    __extends(KerberosRepository, _super);
    function KerberosRepository(kerberosKeytabDao, kerberosRealmDao) {
        var _this = _super.call(this, [
            model_1.Model.KerberosKeytab,
            model_1.Model.KerberosRealm
        ]) || this;
        _this.kerberosKeytabDao = kerberosKeytabDao;
        _this.kerberosRealmDao = kerberosRealmDao;
        return _this;
    }
    KerberosRepository.getInstance = function () {
        if (!KerberosRepository.instance) {
            KerberosRepository.instance = new KerberosRepository(new kerberos_keytab_dao_1.KerberosKeytabDao(), new kerberos_realm_dao_1.KerberosRealmDao());
        }
        return KerberosRepository.instance;
    };
    KerberosRepository.prototype.getNewKerberosRealm = function () {
        return this.kerberosRealmDao.getNewInstance();
    };
    KerberosRepository.prototype.getKerberosRealmEmptyList = function () {
        return this.kerberosRealmDao.getEmptyList();
    };
    KerberosRepository.prototype.getKerberosKeytabEmptyList = function () {
        return this.kerberosKeytabDao.getEmptyList();
    };
    KerberosRepository.prototype.getNewKerberosKeytab = function () {
        return this.kerberosKeytabDao.getNewInstance();
    };
    KerberosRepository.prototype.listKerberosRealms = function () {
        return this.kerberosRealmDao.list();
    };
    KerberosRepository.prototype.listKerberosKeytabs = function () {
        return this.kerberosKeytabDao.list();
    };
    KerberosRepository.prototype.saveKerberosRealm = function (kerberosRealm) {
        return this.kerberosRealmDao.save(kerberosRealm);
    };
    KerberosRepository.prototype.deleteKerberosRealm = function (kerberosRealm) {
        return this.kerberosRealmDao.delete(kerberosRealm);
    };
    KerberosRepository.prototype.saveKerberosKeytab = function (kerberosKeytab) {
        return this.kerberosKeytabDao.save(kerberosKeytab);
    };
    KerberosRepository.prototype.handleStateChange = function (name, state) {
        switch (name) {
            case model_1.Model.KerberosRealm:
                this.realms = this.dispatchModelEvents(this.realms, model_event_name_1.ModelEventName.KerberosRealm, state);
                break;
            case model_1.Model.KerberosKeytab:
                this.keytabs = this.dispatchModelEvents(this.keytabs, model_event_name_1.ModelEventName.KerberosKeytab, state);
                break;
        }
    };
    KerberosRepository.prototype.handleEvent = function (name, data) {
    };
    return KerberosRepository;
}(abstract_repository_ng_1.AbstractRepository));
exports.KerberosRepository = KerberosRepository;
