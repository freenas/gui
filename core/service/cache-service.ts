export class CacheService {
    private dataStore: Map<any, Array<any>>;
    private static instance: CacheService;

    private constructor(dataStore: Map<any, Array<any>>) {
        this.dataStore = dataStore || new Map<any, Array<any>>();
    }
    
    static getInstance(this: CacheService, dataStore: Map<any, Array<any>>) {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService(dataStore);
        }
        return CacheService.instance;
    }

    addToCache(this: CacheService, key: any, values: Array<any>): boolean {
        var isNewEntry: boolean = !this.dataStore.has(key);
        if (isNewEntry) {
            this.dataStore.set(key, values);
        } else {
            var cache = this.dataStore.get(key);
            Array.prototype.push.apply(cache, values)
        }
        return isNewEntry;
    }

    clearCacheEntry(this: CacheService, key: any): boolean {
        var isExistingEntry: boolean = this.dataStore.has(key);
        if (isExistingEntry) {
            this.dataStore.get(key).splice(0);
        }
        return isExistingEntry;
    }

    getCacheEntry(this: CacheService, key: any): Array<any> {
        return this.dataStore.get(key);
    }
}
