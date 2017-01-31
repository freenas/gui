const ShareTargettype = {
    DATASET: 'DATASET' as 'DATASET',
    ZVOL: 'ZVOL' as 'ZVOL',
    DIRECTORY: 'DIRECTORY' as 'DIRECTORY',
    FILE: 'FILE' as 'FILE'
};
type ShareTargettype = (typeof ShareTargettype)[keyof typeof ShareTargettype];
export {ShareTargettype};
