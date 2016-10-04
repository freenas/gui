var AbstractInspector = require("ui/abstract/abstract-inspector").AbstractInspector,
    Model = require("core/model/model").Model,
    CascadingList = require("ui/controls/cascading-list.reel").CascadingList;

/**
 * @class NetworkInterfaceCreator
 * @extends Component
 */
exports.NetworkInterfaceCreator = AbstractInspector.specialize({
    newVlan: {
        value: null
    },

    newLagg: {
        value: null
    },

    newBridge: {
        value: null
    },

    parentCascadingListItem: {
        get: function () {
            return CascadingList.findCascadingListItemContextWithComponent(this);
        }
    },


    enterDocument: {
        value: function(isFirstTime) {
            this.super();
            var self = this;
            if (isFirstTime) {
                this._dataService = this.application.dataService;
                this.addPathChangeListener("parentCascadingListItem.selectedObject", this, "_handleSelectionChange");
            }
            this.createNewInterface('Vlan').then(function(vlan) {
                self.newVlan = vlan;
            });
            this.createNewInterface('Lagg').then(function(lagg) {
                lagg.lagg.protocol = 'NONE';
                self.newLagg = lagg;
            });
            this.createNewInterface('Bridge').then(function(bridge) {
                self.newBridge = bridge;
            });
            if (this.parentCascadingListItem) {
                this.parentCascadingListItem.selectedObject = null;
            }
        }
    },

    createNewInterface: {
        value: function(type) {
            var self = this,
                newInterface;
            return this._dataService.getNewInstanceForType(Model.NetworkInterface).then(function(networkInterface) {
                newInterface = networkInterface;
                newInterface.type = type.toUpperCase();
                newInterface._isNewObject = true;
                newInterface.aliases = [];
                // FIXME: Hacks around combination of name not being nullable in the middleware
                // and certain form elements initializing the bound value to null. Remove if
                // either issue is resolved.
                //
                // FIXME: NetworkInterfaceVlan, NetworkInterfaceLagg and NetworkInterfaceBridge should be real classes (needs middleware evolution)
                newInterface.name = "";
                return self._dataService.getNewInstanceForType(Model['NetworkInterface' + type + 'Properties']);
            }).then(function(properties) {
                newInterface[type.toLowerCase()] = properties;
                return newInterface;
            });
        }
    },

    _handleSelectionChange: {
        value: function () {
            if (this.parentCascadingListItem && this.parentCascadingListItem.selectedObject) {
                if (this._inDocument) {
                    this.parentCascadingListItem.cascadingList.pop();
                }
            }
        }
    }

});
