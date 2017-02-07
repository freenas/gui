import {AbstractDataObject} from './AbstractDataObject';
import {VolumeDatasetPropertyAtime} from './VolumeDatasetPropertyAtime';
import {VolumeDatasetPropertyCasesensitivity} from './VolumeDatasetPropertyCasesensitivity';
import {VolumeDatasetPropertyDedup} from './VolumeDatasetPropertyDedup';
import {VolumeDatasetPropertyCompression} from './VolumeDatasetPropertyCompression';
import {VolumeDatasetPropertyQuota} from './VolumeDatasetPropertyQuota';
import {VolumeDatasetPropertyRefquota} from './VolumeDatasetPropertyRefquota';
import {VolumeDatasetPropertyVolblocksize} from './VolumeDatasetPropertyVolblocksize';
import {VolumeDatasetPropertyRefreservation} from './VolumeDatasetPropertyRefreservation';
import {VolumeDatasetPropertyReservation} from './VolumeDatasetPropertyReservation';

export class VolumeDatasetProperties extends AbstractDataObject {
    public compression: VolumeDatasetPropertyCompression;
    public atime: VolumeDatasetPropertyAtime;
    public dedup: VolumeDatasetPropertyDedup;
    public quota: VolumeDatasetPropertyQuota;
    public refquota: VolumeDatasetPropertyRefquota;
    public reservation: VolumeDatasetPropertyReservation;
    public refreservation: VolumeDatasetPropertyRefreservation;
    public casesensitivity: VolumeDatasetPropertyCasesensitivity;
    public volblocksize: VolumeDatasetPropertyVolblocksize;
    // public used: VolumeDatasetPropertyUsed;
    // public available: VolumeDatasetPropertyAvailable;
    // public volsize: VolumeDatasetPropertyVolsize;
    // public refcompressratio: VolumeDatasetPropertyRefcompressratio;
    // public numclones: VolumeDatasetPropertyNumclones;
    // public compressratio: VolumeDatasetPropertyCompressratio;
    // public written: VolumeDatasetPropertyWritten;
    // public referenced: VolumeDatasetPropertyReferenced;
    // public readonly: VolumeDatasetPropertyReadonly;
    // public usedbyrefreservation: VolumeDatasetPropertyUsedbyrefreservation;
    // public usedbysnapshots: VolumeDatasetPropertyUsedbysnapshots;
    // public usedbydataset: VolumeDatasetPropertyUsedbydataset;
    // public usedbychildren: VolumeDatasetPropertyUsedbychildren;
    // public logicalused: VolumeDatasetPropertyLogicalused;
    // public logicalreferenced: VolumeDatasetPropertyLogicalreferenced;
    // public origin: VolumeDatasetPropertyOrigin;
}
