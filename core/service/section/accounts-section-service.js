"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_section_service_ng_1 = require("./abstract-section-service-ng");
var account_repository_1 = require("../../repository/account-repository");
var kerberos_repository_1 = require("../../repository/kerberos-repository");
var shell_repository_1 = require("../../repository/shell-repository");
var Promise = require("bluebird");
var model_event_name_1 = require("../../model-event-name");
var ntp_server_repository_1 = require("../../repository/ntp-server-repository");
var system_repository_1 = require("../../repository/system-repository");
var AccountsSectionService = (function (_super) {
    __extends(AccountsSectionService, _super);
    function AccountsSectionService() {
        _super.apply(this, arguments);
    }
    AccountsSectionService.prototype.init = function () {
        this.accountRepository = account_repository_1.AccountRepository.getInstance();
        this.kerberosRepository = kerberos_repository_1.KerberosRepository.getInstance();
        this.shellRepository = shell_repository_1.ShellRepository.getInstance();
        this.ntpServerRepository = ntp_server_repository_1.NtpServerRepository.getInstance();
        this.systemRepository = system_repository_1.SystemRepository.getInstance();
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.User.listChange, this.handleUsersChange.bind(this));
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Group.listChange, this.handleGroupsChange.bind(this));
        this.eventDispatcherService.addEventListener(model_event_name_1.ModelEventName.Directory.listChange, this.handleDirectoriesChange.bind(this));
    };
    AccountsSectionService.prototype.listGroups = function () {
        return this.accountRepository.listGroups();
    };
    AccountsSectionService.prototype.getDirectoryServiceConfig = function () {
        return this.accountRepository.getDirectoryServiceConfig();
    };
    AccountsSectionService.prototype.getNewKerberosRealm = function () {
        return this.kerberosRepository.getNewKerberosRealm();
    };
    AccountsSectionService.prototype.getNewKerberosKeytab = function () {
        return this.kerberosRepository.getNewKerberosKeytab();
    };
    AccountsSectionService.prototype.getKerberosRealmEmptyList = function () {
        return this.kerberosRepository.getKerberosRealmEmptyList();
    };
    AccountsSectionService.prototype.getKerberosKeytabEmptyList = function () {
        return this.kerberosRepository.getKerberosKeytabEmptyList();
    };
    AccountsSectionService.prototype.listKerberosRealms = function () {
        return this.kerberosRepository.listKerberosRealms();
    };
    AccountsSectionService.prototype.saveKerberosRealm = function (object) {
        return this.kerberosRepository.saveKerberosRealm(object);
    };
    AccountsSectionService.prototype.saveKerberosKeytabWithKeytabStringBase64 = function (kerberosKeytab, keytabStringBase64) {
        kerberosKeytab.keytab = { "$binary": keytabStringBase64 };
        return this.kerberosRepository.saveKerberosKeytab(kerberosKeytab);
    };
    AccountsSectionService.prototype.getNewDirectoryForType = function (type) {
        return this.accountRepository.getNewDirectoryForType(type);
    };
    AccountsSectionService.prototype.listNtpServers = function () {
        return this.ntpServerRepository.listNtpServers();
    };
    AccountsSectionService.prototype.syncNtpNow = function (ntpServerAddress) {
        return this.ntpServerRepository.syncNow(ntpServerAddress);
    };
    AccountsSectionService.prototype.listShells = function () {
        return this.shellRepository.listShells();
    };
    AccountsSectionService.prototype.getSystemAdvanced = function () {
        return this.systemRepository.getAdvanced();
    };
    AccountsSectionService.prototype.loadEntries = function () {
        var self = this;
        this.entries = [
            [],
            [],
            [],
            []
        ];
        return this.entriesPromise = Promise.all([
            self.accountRepository.listUsers(),
            self.accountRepository.listGroups(),
            self.accountRepository.getNewDirectoryServices(),
        ]).spread(function (allUsers, allGroups, directoryServices) {
            var users = allUsers.filter(function (x) { return !x.builtin; }), groups = allGroups.filter(function (x) { return !x.builtin; }), system = allUsers.filter(function (x) { return x.builtin; }).concat(allGroups.filter(function (x) { return x.builtin; }));
            users._objectType = 'User';
            users._filter = { builtin: false };
            users._order = 0;
            groups._objectType = 'Group';
            groups._filter = { builtin: false };
            groups._order = 1;
            system._objectType = ['User', 'Group'];
            system._filter = { builtin: true };
            system._order = 2;
            directoryServices._objectType = 'DirectoryServices';
            directoryServices._order = 3;
            var entries = [
                users,
                groups,
                system,
                directoryServices
            ];
            entries._objectType = 'AccountCategory';
            self.entriesTitle = 'Accounts';
            self.updateOverview(entries);
            return entries;
        });
    };
    AccountsSectionService.prototype.loadExtraEntries = function () {
    };
    AccountsSectionService.prototype.loadOverview = function () {
        this.overview = this.overview || {};
        return this.overview;
    };
    AccountsSectionService.prototype.loadSettings = function () { };
    AccountsSectionService.prototype.handleUsersChange = function (state) {
        this.updateCategory(this.entries[0], 'User', state.valueSeq().filter(function (x) { return !x.get('builtin'); }));
        this.updateCategory(this.entries[2], 'User', state.valueSeq().filter(function (x) { return x.get('builtin'); }));
        this.updateOverview(this.entries);
    };
    AccountsSectionService.prototype.handleGroupsChange = function (state) {
        this.updateCategory(this.entries[1], 'Group', state.valueSeq().filter(function (x) { return !x.get('builtin'); }));
        this.updateCategory(this.entries[2], 'Group', state.valueSeq().filter(function (x) { return x.get('builtin'); }));
        this.updateOverview(this.entries);
    };
    AccountsSectionService.prototype.updateOverview = function (entries) {
        this.overview = this.overview || {};
        this.overview.users = entries[0];
        this.overview.groups = entries[1];
        this.overview.system = entries[2];
        this.overview.directories = entries[3];
        this.eventDispatcherService.dispatch('accountsOverviewChange', this.overview);
    };
    AccountsSectionService.prototype.updateCategory = function (entries, objectType, state) {
        var self = this, ids = state.map(function (x) { return x.get('id'); });
        state.forEach(function (user) {
            var entry = self.findObjectWithId(entries, user.get('id'));
            if (entry) {
                Object.assign(entry, user.toJS());
            }
            else {
                entry = user.toJS();
                entry._objectType = objectType;
                entries.push(entry);
            }
        });
        for (var i = entries.length - 1; i >= 0; i--) {
            if (entries[i]._objectType === objectType && !ids.includes(entries[i].id)) {
                entries.splice(i, 1);
            }
        }
    };
    AccountsSectionService.prototype.handleDirectoriesChange = function (directories) {
    };
    return AccountsSectionService;
}(abstract_section_service_ng_1.AbstractSectionService));
exports.AccountsSectionService = AccountsSectionService;
