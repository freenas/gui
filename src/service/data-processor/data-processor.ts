export interface DataProcessor {
    process(object: Object, ...context: any[]): Object;
}
