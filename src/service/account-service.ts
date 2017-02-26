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

    public listLocalUsers(): Promise<Array<User>> {
        return this.accountRepository.listLocalUsers();
    }

    public listLocalGroups(): Promise<Array<Group>> {
        return this.accountRepository.listLocalGroups();
    }

    public listSystemUsers(): Promise<Array<User>> {
        return this.accountRepository.listSystemUsers();
    }

    public listSystemGroups(): Promise<Array<Group>> {
        return this.accountRepository.listSystemGroups();
    }

    public searchUser(value) {
        return this.accountRepository.searchUser(value);
    }

    public searchGroup(value) {
        return this.accountRepository.searchGroup(value);
    }

}
