var AbstractComponentActionDelegate = require("core/ui/abstract-component-action-delege").AbstractComponentActionDelegate,
    ShareService = require("core/service/share-service").ShareService;

/**
 * @class ShareOverview
 * @extends Component
 */
exports.ShareOverview = AbstractComponentActionDelegate.specialize(/** @lends ShareOverview# */{

    showTargetTypes: {
        value: false
    },

    _object: {
        value: null
    },

    object: {
        set: function (object) {
            if (this._object !== object) {
                this._object = object;
                this.dispatchOwnPropertyChange("possibleTargetTypes", this.possibleTargetTypes);
            }
        },
        get: function () {
            return this._object;
        }
    },

    _targetType: {
        value: null
    },

    targetType: {
        set: function (targetType) {
            if (this._targetType !== targetType) {
                this._targetType = targetType;
                this.dispatchOwnPropertyChange("iconModuleId", this.iconModuleId);
            }
        },
        get: function () {
            return this._targetType;
        }
    },

    possibleTargetTypes: {
        get: function () {
            //not using the global object ShareService in order to avoid to create a closure.
            return !this.object || this.object.type !== this.application.shareService.constructor.SHARE_TYPES.ISCSI ?
                this.constructor.POSSIBLE_TARGET_TYPES.DEFAULT : this.constructor.POSSIBLE_TARGET_TYPES.ISCSI;
        }
    },

    iconModuleId: {
        get: function () {
            //not using the global object ShareService in order to avoid to create a closure.
            return this.targetType !== this.application.shareService.constructor.TARGET_TYPES.DIRECTORY ?
                this.constructor.ICON_MODULE_IDS.DATASET : this.constructor.ICON_MODULE_IDS.DIRECTORY ;
        }
    },

    handleDisplayPossibleTargetTypesAction: {
        value: function() {
            this.showTargetTypes = !this.showTargetTypes;
        }
    },

    handlePossibleTargetTypeButtonAction: {
        value: function (event) {
            this.targetType = event.target.label;
            this.showTargetTypes = false;
        }
    }

}, {

    POSSIBLE_TARGET_TYPES: {
        value: {
            DEFAULT: [ShareService.TARGET_TYPES.DATASET, ShareService.TARGET_TYPES.DIRECTORY],
            ISCSI: [ShareService.TARGET_TYPES.ZVOL, ShareService.TARGET_TYPES.FILE]
        }
    },

    ICON_MODULE_IDS: {
        value: {
            DIRECTORY: 'ui/icons/directory.reel',
            DATASET: 'ui/icons/dataset.reel'
        }
    }

});
