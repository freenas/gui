import {SectionRepository} from '../../repository/section-repository';
import {EventDispatcherService} from '../event-dispatcher-service';
import {DataObjectChangeService} from '../data-object-change-service';

export abstract class AbstractSectionService {
    private static readonly sectionRepository: SectionRepository = SectionRepository.getInstance();
    protected eventDispatcherService: EventDispatcherService;
    protected dataObjectChangeService: DataObjectChangeService;
    public instanciationPromise: Promise<AbstractSectionService>;
    public section: any;
    public entries: Array<any>;
    public extraEntries: Array<any>;
    public overview: any;

    public constructor() {
        this.dataObjectChangeService = new DataObjectChangeService();
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

    public abstract getNextSequenceForStream(streamId: string)


    protected findObjectWithId(entries: Array<any>, id: string) {
        for (let entry of entries) {
            if (entry.id === id) {
                return entry;
            }
        }
        return null;
    }


    private load(): Promise<AbstractSectionService> {
        return Promise.all([
            AbstractSectionService.sectionRepository.getNewSection(),
            AbstractSectionService.sectionRepository.getNewSectionSettings(),
            this.loadEntries(),
            this.loadExtraEntries(),
            this.loadSettings(),
            this.loadOverview()
        ]).spread((section: any, sectionSettings: any, entries: Array<any>, extraEntries: Array<any>, settings: any, overview: any) => {
            (sectionSettings as any).section = section;
            (sectionSettings as any).settings = settings;
            this.section = section;
            this.section.settings = sectionSettings;
            this.entries = this.section.entries = entries;
            this.extraEntries = this.section.extraEntries = extraEntries;
            this.overview = this.section.overview = overview;
            return this;
        });
    }
}
