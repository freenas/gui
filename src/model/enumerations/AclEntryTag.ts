const AclEntryTag = {
    USER_OBJ: 'USER_OBJ' as 'USER_OBJ',
    USER: 'USER' as 'USER',
    GROUP_OBJ: 'GROUP_OBJ' as 'GROUP_OBJ',
    GROUP: 'GROUP' as 'GROUP',
    MASK: 'MASK' as 'MASK',
    OTHER: 'OTHER' as 'OTHER',
    EVERYONE: 'EVERYONE' as 'EVERYONE'
};
type AclEntryTag = (typeof AclEntryTag)[keyof typeof AclEntryTag];
export {AclEntryTag};
