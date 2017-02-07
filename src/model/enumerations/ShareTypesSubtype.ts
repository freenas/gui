const ShareTypesSubtype = {
    FILE: 'FILE' as 'FILE',
    BLOCK: 'BLOCK' as 'BLOCK'
};
type ShareTypesSubtype = (typeof ShareTypesSubtype)[keyof typeof ShareTypesSubtype];
export {ShareTypesSubtype};
