export abstract class AbstractDataObject {
    public id: string;
    public _isNew: boolean;
    public _objectType: string;

    private static className: string;
    private static eventNames: ModelEventName;

    public static getClassName() {
        if (!this.className) {
            this.className = this.toString().split(/\(|s+/)[0].split(/s+/)[1];
        }
        return this.className;
    }

    public static getEventNames() {
        if (!this.eventNames) {
            this.eventNames = new ModelEventName(this.getClassName());
        }
        return this.eventNames;
    }

    public constructor() {
        this._objectType = this.constructor.toString().split(/\(|s+/)[0].split(/ |s+/)[1];
    }

}

class ModelEventName {
    public listChange: string;
    public contentChange: string;
    public add: Function;
    public remove: Function;
    public change: Function;

    public constructor(modelName: string) {
        this.listChange = modelName + 'ListChange';
        this.contentChange = modelName + 'ContentChange';
        this.add = (id) => modelName + 'Add.' + id;
        this.remove = (id) => modelName + 'Remove.' + id;
        this.change = (id) => modelName + '.' + id;
    }
}
