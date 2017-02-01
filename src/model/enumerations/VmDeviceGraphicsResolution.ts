const VmDeviceGraphicsResolution = {
    '1920x1200': '1920x1200' as '1920x1200',
    '1920x1080': '1920x1080' as '1920x1080',
    '1600x1200': '1600x1200' as '1600x1200',
    '1600x900': '1600x900' as '1600x900',
    '1280x1024': '1280x1024' as '1280x1024',
    '1280x720': '1280x720' as '1280x720',
    '1024x768': '1024x768' as '1024x768',
    '800x600': '800x600' as '800x600',
    '640x480': '640x480' as '640x480'
};
type VmDeviceGraphicsResolution = (typeof VmDeviceGraphicsResolution)[keyof typeof VmDeviceGraphicsResolution];
export {VmDeviceGraphicsResolution};
