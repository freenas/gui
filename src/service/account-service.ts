import {AccountRepository} from '../repository/account-repository';
import {Group} from '../model/Group';
import {User} from '../model/User';

export class AccountService {

    private static instance: AccountService;
    private groupWheelPromise: Promise<Group>;

    public constructor(private accountRepository: AccountRepository) {}

    public static getInstance(): AccountService {
        if (!AccountService.instance) {
            AccountService.instance = new AccountService(
                AccountRepository.getInstance()
            );
        }
        return AccountService.instance;
    }

    public getWheelGroup(): Promise<Group> {
        if (!this.groupWheelPromise) {
            this.groupWheelPromise = this.searchGroupWithCriteria({ name: 'wheel' }).then((groups) => {
                return groups[0];
            });
        }

        return this.groupWheelPromise;
    }

    public listLocalUsers(options?: any): Promise<Array<User>> {
        return this.handleSearchQuery(
            this.accountRepository.listLocalUsers(),
            options
        );
    }

    public listLocalGroups(options?: any): Promise<Array<Group>> {
        return this.handleSearchQuery(
            this.accountRepository.listLocalGroups(),
            options
        );
    }

    public listSystemUsers(): Promise<Array<User>> {
        return this.accountRepository.listSystemUsers();
    }

    public listSystemGroups(): Promise<Array<Group>> {
        return this.accountRepository.listSystemGroups();
    }

    public searchUser(value: string, options?: any) {
        return this.handleSearchQuery(
            this.accountRepository.searchUser(value),
            options
        );
    }

    public searchUserWithCriteria(criteria: any, options?: any) {
        return this.handleSearchQuery(
            this.accountRepository.searchUserWithCriteria(criteria),
            options
        );
    }

    public searchGroup(value: string, options?: any) {
        return this.handleSearchQuery(
            this.accountRepository.searchGroup(value),
            options
        );
    }

    public searchGroupWithCriteria(criteria: any, options?: any) {
        return this.handleSearchQuery(
            this.accountRepository.searchGroupWithCriteria(criteria),
            options
        );
    }

    public formatAccountName(account, namePath) {
        let label = account[namePath];
        if (account.origin && account.origin.domain && account.origin.domain !== 'local') {
            label += '@' + account.origin.domain;
        }
        return label;
    }

    public extractPropertyFormAccount(account, propertyName) {
        if (propertyName === 'name' || propertyName === 'username') {
            return this.formatAccountName(account, propertyName);
        }
        return account[propertyName];
    }

    private handleSearchQuery(searchQuery: Promise<any>, options?: any) {
        return searchQuery.then((values) => {
            if (options && options.labelPath && options.valuePath) {
                values = values.map(value => {
                    return {
                        label: this.extractPropertyFormAccount(value, options.labelPath),
                        value: this.extractPropertyFormAccount(value, options.valuePath)
                    };
                });
            }
            return values;
        });
    }

}
