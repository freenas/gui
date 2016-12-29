import _ = require("lodash");
import {EventDispatcherService} from "../service/event-dispatcher-service";

export abstract class AbstractRoute {
    protected constructor(protected eventDispatcherService: EventDispatcherService) {
    }

    protected updateStackWithContext(stack: Array<any>, context: any) {
        this.popStackAtIndex(stack, context.columnIndex)
        stack.push(context);
        return stack;
    }

    private popStackAtIndex(stack: Array<any>, index: number) {
        while (stack.length > index) {
            let context = stack.pop();
            if (context) {
                this.unregisterChangeListeners(context.changeListener);
            }
        }
    }

    private unregisterChangeListeners(changeListeners: Array<Function>|Function) {
        if (changeListeners) {
            for (let listener of _.castArray(changeListeners)) {
                this.eventDispatcherService.removeEventListener((listener as any).eventName, listener);
            }
        }
    }
}
