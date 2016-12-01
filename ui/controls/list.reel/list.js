var Component = require("montage/ui/component").Component;

var DEFAULT_LIST_ITEM_MODULE_ID = 'ui/controls/list.reel/list-item.reel';

/**
 * @class List
 * @extends Component
 */
exports.List = Component.specialize({

    _content: {
        value: null
    },

    content: {
        set: function (content) {
            if (this._content !== content) {
                this._content = content;

                if (content) {
                    var self = this;

                    this.application.delegate.userInterfaceDescriptorForObject(content).then(function (UIDescriptor) {
                        var collectionItemComponentModule = UIDescriptor ? UIDescriptor.collectionItemComponentModule : null;

                        self.listItemModuleId = collectionItemComponentModule ?
                            (collectionItemComponentModule.id || collectionItemComponentModule['%']) : DEFAULT_LIST_ITEM_MODULE_ID;


                    }).catch(function (error) {
                        console.warn(error);
                        self.listItemModuleId = DEFAULT_LIST_ITEM_MODULE_ID;
                    });
                } else {
                    this.listItemModuleId = DEFAULT_LIST_ITEM_MODULE_ID;
                }
            }
        },
        get: function () {
            return this._object;
        }
    },

    enterDocument: {
        value: function() {
            if (this.selectedObject && this.controller.selection[0] !== this.selectedObject) {
                this.dispatchOwnPropertyChange("selectedObject", this.selectedObject);
            }
        }
    }
});
