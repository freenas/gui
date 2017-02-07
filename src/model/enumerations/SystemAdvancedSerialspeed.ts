const SystemAdvancedSerialspeed = {
    110: '110' as '110',
    300: '300' as '300',
    600: '600' as '600',
    1200: '1200' as '1200',
    2400: '2400' as '2400',
    4800: '4800' as '4800',
    9600: '9600' as '9600',
    14400: '14400' as '14400',
    19200: '19200' as '19200',
    38400: '38400' as '38400',
    57600: '57600' as '57600',
    115200: '115200' as '115200'
};
type SystemAdvancedSerialspeed = (typeof SystemAdvancedSerialspeed)[keyof typeof SystemAdvancedSerialspeed];
export {SystemAdvancedSerialspeed};
