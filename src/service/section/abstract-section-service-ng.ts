import {SectionRepository} from '../../repository/section-repository';
import {Section} from '../../model/models/section';
import {EventDispatcherService} from '../event-dispatcher-service';
import * as Promise from "bluebird";

export abstract class AbstractSectionService {
    private static readonly sectionRepository: SectionRepository = SectionRepository.instance;
    protected eventDispatcherService: EventDispatcherService;
    public instanciationPromise: Promise<AbstractSectionService>;
    public section: Section;
    public entries: Array<any>;
    public extraEntries: Array<any>;
    public overview: any;

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

    protected abstract loadEntries(): Promise<Array<any>>

    protected abstract loadExtraEntries(): Promise<Array<any>>

    protected abstract loadSettings(): Promise<any>

    protected abstract loadOverview(): Promise<any>

    protected findObjectWithId(entries: Array<any>, id: string) {
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
        ]).spread(function(section, sectionSettings, entries: Array<any>, extraEntries, settings, overview) {
            (sectionSettings as any).section = section;
            (sectionSettings as any).settings = settings;
            self.section = section;
            self.section.settings = sectionSettings;
            self.entries = self.section.entries = entries;
            self.extraEntries = self.section.extraEntries = extraEntries;
            self.overview = self.section.overview = overview;
            return self;
        });
    }
}
