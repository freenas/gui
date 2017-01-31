const UpdateProgressOperation = {
    DOWNLOADING: 'DOWNLOADING' as 'DOWNLOADING',
    INSTALLING: 'INSTALLING' as 'INSTALLING'
};
type UpdateProgressOperation = (typeof UpdateProgressOperation)[keyof typeof UpdateProgressOperation];
export {UpdateProgressOperation};
