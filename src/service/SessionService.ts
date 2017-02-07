import {EventDispatcherService} from './event-dispatcher-service';
import {Events} from '../Events';
import {LoginInfo} from '../model/LoginInfo';
import {AccountRepository} from '../repository/account-repository';
import {Session} from '../model/Session';

export class SessionService {
    private static instance: SessionService;
    private openedSession: Session;

    private constructor(
        private eventDispatcherService: EventDispatcherService = EventDispatcherService.getInstance(),
        private userRepository: AccountRepository = AccountRepository.getInstance()
    ) {
        this.eventDispatcherService.addEventListener(Events.userLoggedIn, this.handleUserLoggedIn.bind(this));
    }

    public static getInstance(): SessionService {
        if (!SessionService.instance) {
            SessionService.instance = new SessionService();
        }
        return SessionService.instance;
    }

    public get session() {
        return this.openedSession;
    }

    private handleUserLoggedIn(loginInfo: LoginInfo) {
        this.openedSession = ({
            url: loginInfo.url
        } as Session);
        this.userRepository.findUserWithName(loginInfo.username).then(user => {
            this.openedSession.user = user;
            this.eventDispatcherService.dispatch(Events.sessionOpened, this.openedSession);
        });
    }
}
