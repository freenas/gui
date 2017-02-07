const VmConfigBootloader = {
    BHYVELOAD: 'BHYVELOAD' as 'BHYVELOAD',
    GRUB: 'GRUB' as 'GRUB',
    UEFI: 'UEFI' as 'UEFI',
    UEFI_CSM: 'UEFI_CSM' as 'UEFI_CSM'
};
type VmConfigBootloader = (typeof VmConfigBootloader)[keyof typeof VmConfigBootloader];
export {VmConfigBootloader};
