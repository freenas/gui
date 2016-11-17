export class CacheService {
    private static instance: CacheService;
    private dataStore: Map<any, Array<any>>;

    private constructor(dataStore: Map<any, Array<any>>) {
        this.dataStore = dataStore || new Map<any, Array<any>>();
    }
    
    public static getInstance(dataStore: Map<any, Array<any>>) {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService(dataStore);
        }
        return CacheService.instance;
    }

    public addToCache(this: CacheService, key: any, values: Array<any>): Array<any> {
        var cache: Array<any>;
        if (!this.dataStore.has(key)) {
            this.dataStore.set(key, values);
            cache = values
        } else {
            cache = this.dataStore.get(key);
            for (var i = 0; i < values.length; i++) {
                cache.push(values[i]);
            }
        }
        return cache;
    }

    public clearCacheEntry(this: CacheService, key: any): boolean {
        var isExistingEntry: boolean = this.dataStore.has(key);
        if (isExistingEntry) {
            this.dataStore.get(key).splice(0);
        }
        return isExistingEntry;
    }

    public getCacheEntry(this: CacheService, key: any): Array<any> {
        return this.dataStore.get(key);
    }
}
