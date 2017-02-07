/ (=> isLogged ? /dashboard : /login)
/login (=> isLogged ? /dashboard : null)

/dashboard
/dashboard/config

/storage
/storage/volumes/create
/storage/volumes/_/:volume.id
/storage/volumes/_/:volume.id/shares
/storage/volumes/_/:volume.id/shares/create
/storage/volumes/_/:volume.id/shares/create/:share.type
/storage/volumes/_/:volume.id/shares/_/:share.type/:share.name
/storage/volumes/_/:volume.id/snapshots
/storage/volumes/_/:volume.id/snapshots/create
/storage/volumes/_/:volume.id/snapshots/_/:snapshot.id
/storage/volumes/_/:volume.id/topology
/storage/volumes/_/:volume.id/topology/disks/_/:disk.id
/storage/volumes/_/:volume.id/datasets
/storage/volumes/_/:volume.id/datasets/create
/storage/volumes/_/:volume.id/datasets/_/:dataset.id
/storage/volumes/_/:volume.id/datasets/_/:dataset.id/snapshots
/storage/volumes/_/:volume.id/datasets/_/:dataset.id/replication
/storage/volumes/_/:volume.id/datasets/_/:dataset.id/vmware-snapshots
/storage/volumes/_/:volume.id/datasets/_/:dataset.id/vmware-snapshots/create
/storage/volumes/_/:volume.id/datasets/_/:dataset.id/vmware-snapshots/_/:vmware_snapshot.id
/storage/import
/storage/import/encrypted

/accounts
/accounts/users
/accounts/users/create
/accounts/users/_/:user.username
/accounts/groups
/accounts/groups/create
/accounts/groups/_/:group.name
/accounts/system
/accounts/system/user/_/:user.username
/accounts/system/group/_/:group.name
/accounts/directories
/accounts/directories/_/active-directory
/accounts/directories/_/freeipa
/accounts/directories/_/ldap
/accounts/directories/_/nis
/accounts/directories/_/kerberos-realm
/accounts/directories/_/kerberos-tabs
/accounts/directories/settings

/network
/network/interfaces/_/:interface.id
/network/interfaces/create
/network/settings

/system
/system/_/overview
/system/_/preferences
/system/_/boot_pool
/system/_/updates
/system/_/languages_and_region
/system/_/web_ui
/system/_/certificates
/system/_/certificates/create
/system/_/certificates/_/:certificate.id
/system/_/alerts_and_reporting
/system/_/alerts_and_reporting/create
/system/_/alerts_and_reporting/_/:alert_filter.id
/system/_/alerts_and_reporting/settings
/system/_/console
/system/_/debug
/system/_/tunables
/system/_/tunables/create
/system/_/tunables/_/:tunable.id
/system/_/ntp
/system/_/ntp/create
/system/_/ntp/_/:ntpserver.id
/system/_/support

/services
/services/_/file_transfer
/services/_/file_transfer/_/ftp
/services/_/file_transfer/_/rsyncd
/services/_/file_transfer/_/tftpd
/services/_/management
/services/_/management/_/dc
/services/_/management/_/dyndns
/services/_/management/_/lldp
/services/_/management/_/smartd
/services/_/management/_/snmp
/services/_/management/_/sshd
/services/_/management/_/ups
/services/_/sharing
/services/_/sharing/_/afp
/services/_/sharing/_/iscsi
/services/_/sharing/_/nfs
/services/_/sharing/_/smb
/services/_/sharing/_/webdav

/console

/calendar

/peering
/peering/create
/peering/_/:peer.id

/vms
/vms/create
/vms/:vm.id

/docker
/docker/_/hosts/
/docker/_/images
/docker/_/images/pull
/docker/_/images/_/:image.id
/docker/_/collections
/docker/_/collections/create
/docker/_/collections/:collection.id
/docker/_/containers
/docker/_/containers/create
/docker/_/containers/:container.id
/docker/settings

/wizard (=> /wizard/_/region)
/wizard/_/region
/wizard/_/volume
/wizard/_/directories
/wizard/_/user
/wizard/_/share
/wizard/_/mail
