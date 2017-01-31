const VmGuestType = {
    linux64: 'linux64' as 'linux64',
    freebsd32: 'freebsd32' as 'freebsd32',
    freebsd64: 'freebsd64' as 'freebsd64',
    netbsd64: 'netbsd64' as 'netbsd64',
    openbsd32: 'openbsd32' as 'openbsd32',
    openbsd64: 'openbsd64' as 'openbsd64',
    windows64: 'windows64' as 'windows64',
    solaris64: 'solaris64' as 'solaris64',
    other: 'other' as 'other'
};
type VmGuestType = (typeof VmGuestType)[keyof typeof VmGuestType];
export {VmGuestType};
