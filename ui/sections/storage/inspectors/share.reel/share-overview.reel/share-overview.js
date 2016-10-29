var AbstractComponentActionDelegate = require("ui/abstract/abstract-component-action-delegate").AbstractComponentActionDelegate;

/**
 * @class ShareOverview
 * @extends Component
 */
exports.ShareOverview = AbstractComponentActionDelegate.specialize({

    ICON_MODULE_IDS: {
        value: {
            DIRECTORY: 'ui/icons/directory.reel',
            DATASET: 'ui/icons/dataset.reel',
            FILE: 'ui/icons/file.reel',
            ZVOL: 'ui/icons/zvol.reel',
        }
    }

});
