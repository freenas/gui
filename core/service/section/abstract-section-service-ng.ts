import {SectionRepository} from 'core/repository/section-repository';
import {Section} from 'core/model/models/section';
import {EventDispatcherService} from 'core/service/event-dispatcher-service';

export abstract class AbstractSectionService {
    private static readonly sectionRepository: SectionRepository = SectionRepository.instance;
    protected eventDispatcherService: EventDispatcherService;
    public instanciationPromise: Promise<AbstractSectionService>;
    public section: Section;
    public entries: Array<Object>;
    public extraEntries: Array<Object>;
    public overview: Object;

    protected constructor() {
        this.eventDispatcherService = EventDispatcherService.getInstance();
        let self = this,
            initReturn = this.init();
        if (!Promise.is(initReturn)) {
            initReturn = Promise.resolve();
        }
        this.instanciationPromise = initReturn.then(function () {
            return self.load();
        });
    }

    protected abstract init(...args: any[])

    protected abstract loadEntries()

    protected abstract loadExtraEntries()

    protected abstract loadSettings()

    protected abstract loadOverview()

    protected findObjectWithId(entries: Array<Object>, id: string) {
        for (let entry of entries) {
            if (entry.id === id) {
                return entry;
            }
        }
        return null;
    }


    private load(): Promise<AbstractSectionService> {
        let self = this;
        return Promise.all([
            AbstractSectionService.sectionRepository.getNewSection(),
            AbstractSectionService.sectionRepository.getNewSectionSettings(),
            self.loadEntries(),
            self.loadExtraEntries(),
            self.loadSettings(),
            self.loadOverview()
        ]).then(function (data) {
            self.section = data[0];
            self.section.settings = data[1];
            self.entries = self.section.entries = data[2];
            self.extraEntries = self.section.extraEntries = data[3]
            self.section.settings.section = self.section;
            self.section.settings.settings = data[4];
            self.overview = self.section.overview = data[5];
            return self;
        });
    }
}
