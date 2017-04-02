import {AccountRepository} from '../repository/account-repository';
import {Group} from '../model/Group';
import {User} from '../model/User';

export class AccountService {

    private static instance: AccountService;

    public constructor(private accountRepository: AccountRepository) {}

    public static getInstance(): AccountService {
        if (!AccountService.instance) {
            AccountService.instance = new AccountService(
                AccountRepository.getInstance()
            );
        }
        return AccountService.instance;
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

    private handleSearchQuery(searchQuery: Promise<any>, options?: any) {
        return searchQuery.then((entries) => {
            if (options && options.labelPath && options.valuePath) {
                entries = entries.map(entry => {
                    return {
                        label: entry[options.labelPath],
                        value: entry[options.valuePath]
                    };
                });
            }

            return entries;
        });
    }

}
