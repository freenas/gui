import {AbstractSectionService} from "./abstract-section-service-ng";
import {AccountRepository} from "../../repository/account-repository";
import {Seq} from "immutable";
import {KerberosRepository} from "../../repository/kerberos-repository";
import {ShellRepository} from "../../repository/shell-repository";

export class AccountsSectionService extends AbstractSectionService {
    private accountRepository: AccountRepository;
    private kerberosRepository: KerberosRepository;
    private shellRepository: ShellRepository;

    private entriesPromise: Promise<any>;

    protected init() {
        this.accountRepository = AccountRepository.getInstance();
        this.kerberosRepository = KerberosRepository.getInstance();
        this.shellRepository = ShellRepository.getInstance();

        this.eventDispatcherService.addEventListener('usersChange', this.handleUsersChange.bind(this));
        this.eventDispatcherService.addEventListener('groupsChange', this.handleGroupsChange.bind(this));
        this.eventDispatcherService.addEventListener('directoriesChange', this.handleDirectoriesChange.bind(this));
    }

    public listGroups(): Promise<Array<Object>> {
        return this.accountRepository.listGroups();
    }

    public getDirectoryServiceConfig(): Promise<Object> {
        return this.accountRepository.getDirectoryServiceConfig();
    }

    public getNewKerberosRealm() {
        return this.kerberosRepository.getNewKerberosRealm();
    }

    public getNewKerberosKeytab() {
        return this.kerberosRepository.getNewKerberosKeytab();
    }

    public getKerberosRealmEmptyList() {
        return this.kerberosRepository.getKerberosRealmEmptyList();
    }

    public getKerberosKeytabEmptyList() {
        return this.kerberosRepository.getKerberosKeytabEmptyList();
    }

    public listKerberosRealms() {
        return this.kerberosRepository.listKerberosRealms();
    }

    public saveKerberosRealm(object: Object) {
        return this.kerberosRepository.saveKerberosRealm(object);
    }

    public saveKerberosKeytabWithKeytabStringBase64(kerberosKeytab, keytabStringBase64) {
        kerberosKeytab.keytab = {"$binary": keytabStringBase64};
        return this.kerberosRepository.saveKerberosKeytab(kerberosKeytab);
    }

    public listShells() {
        return this.shellRepository.listShells();
    }

    protected loadEntries() {
        let self = this;
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
        ]).then(function (data) {
            let users = data[0].filter((x) => !x.builtin),
                groups = data[1].filter((x) => !x.builtin),
                system = data[0].filter((x) => x.builtin).concat(data[1].filter((x) => x.builtin)),
                directoryServices = data[2];
            users._objectType = 'User';
            users._order = 0;
            groups._objectType = 'Group';
            groups._order = 1;
            system._objectType = 'AccountSystem';
            system._order = 2;
            directoryServices._objectType = 'DirectoryServices';
            directoryServices._order = 3;
            let entries = [
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
    }

    protected loadExtraEntries() {
    }

    protected loadOverview() {
        this.overview = this.overview || {};
        return this.overview;
    }

    protected loadSettings() {}

    private handleUsersChange(state: Map<string, Map<string, any>>) {
        this.updateCategory(this.entries[0], 'User', state.valueSeq().filter((x) => !x.get('builtin')));
        this.updateCategory(this.entries[2], 'User', state.valueSeq().filter((x) => x.get('builtin')));
        this.updateOverview(this.entries);
    }

    private handleGroupsChange(state: Map<string, Map<string, any>>) {
        this.updateCategory(this.entries[1], 'Group', state.valueSeq().filter((x) => !x.get('builtin')));
        this.updateCategory(this.entries[2], 'Group', state.valueSeq().filter((x) => x.get('builtin')));
        this.updateOverview(this.entries);
    }

    private updateOverview(entries: Array<any>) {
        this.overview = this.overview || {};
        this.overview.users = entries[0];
        this.overview.groups = entries[1];
        this.overview.system = entries[2];
        this.overview.directories = entries[3];
        this.eventDispatcherService.dispatch('accountsOverviewChange', this.overview);
    }

    private updateCategory(entries: Array<Object>, objectType: string, state: Seq.Indexed<Map<string, any>>) {
        let self = this,
            ids = state.map((x) => x.get('id'));
        state.forEach(function (user) {
            let entry = self.findObjectWithId(entries, user.get('id'));
            if (entry) {
                Object.assign(entry, user.toJS());
            } else {
                entry = user.toJS();
                entry._objectType = objectType;
                entries.push(entry)
            }
        });
        for (let i = entries.length - 1; i >= 0; i--) {
            if (entries[i]._objectType === objectType && !ids.includes(entries[i].id)) {
                entries.splice(i, 1);
            }
        }
    }

    private handleDirectoriesChange(directories: Map<string, Map<string, any>>) {

    }
}
