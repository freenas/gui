const AclEntryType = {
    ALLOW: 'ALLOW' as 'ALLOW',
    DENY: 'DENY' as 'DENY'
};
type AclEntryType = (typeof AclEntryType)[keyof typeof AclEntryType];
export {AclEntryType};
