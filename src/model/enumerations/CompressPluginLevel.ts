const CompressPluginLevel = {
    FAST: 'FAST' as 'FAST',
    DEFAULT: 'DEFAULT' as 'DEFAULT',
    BEST: 'BEST' as 'BEST'
};
type CompressPluginLevel = (typeof CompressPluginLevel)[keyof typeof CompressPluginLevel];
export {CompressPluginLevel};
