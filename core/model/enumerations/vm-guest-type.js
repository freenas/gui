var Enum = require("montage/core/enum").Enum;

exports.VmGuestType = new Enum().initWithMembersAndValues(["freebsd32","freebsd64","linux64","netbsd64","openbsd32","openbsd64","other","solaris64","windows64"], ["freebsd32","freebsd64","linux64","netbsd64","openbsd32","openbsd64","other","solaris64","windows64"]);
