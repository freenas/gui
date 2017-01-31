const RsyncdModuleMode = {
    READONLY: 'READONLY' as 'READONLY',
    WRITEONLY: 'WRITEONLY' as 'WRITEONLY',
    READWRITE: 'READWRITE' as 'READWRITE'
};
type RsyncdModuleMode = (typeof RsyncdModuleMode)[keyof typeof RsyncdModuleMode];
export {RsyncdModuleMode};
