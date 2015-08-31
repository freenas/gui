// Virtual System Generator
// =======================
// Constructs JSON representing the hardware of a system to be used with the
// middleware simulator.

"use strict";

import fs from "fs";
import moment from "moment";

import _ from "lodash";
import createDisks from "./disk.js";
import createVolumes from "./volumes.js";

// These are taken from a real FreeNAS Mini, but they're arbitrary. Want to say
// your virtual system has a Pentium? Go for it!
const systemConstants =
  { memory_size: 17124196352
  , cpu_model: "Intel(R) Atom(TM) CPU  C2750  @ 2.40GHz\u0000"
  , cpu_cores: 8
  , uname_full: "FreeBSD freenas.local 10.1-STABLE FreeBSD 10.1-STABLE #9 a3a2df9(HEAD): Sun Jul  5 21:03:54 PDT 2015     root@build.ixsystems.com:/tank/home/nightlies/freenas-build/_BE/objs/tank/home/nightlies/freenas-build/_BE/trueos/sys/FreeNAS.amd64  amd64\n"
  , version: "FreeNAS 10 New GUI Simulator" // Made up for demonstration only
  , timezone: "America/Los_Angeles"
  , hostname: "freenas.local"
  , language: "English"
  , console_keymap: "us.iso"
  , shells:
    [ "/bin/sh"
    , "/bin/csh"
    , "/usr/local/bin/zsh"
    , "/usr/local/bin/bash"
    , "/usr/local/bin/cli"
    ]
  };

const uiSettings =
  { "webui_http_port": 80
  , "webui_http_redirect_https": false
  , "webui_https_certificate": null
  , "webui_procotol":
    [ "HTTP" ]
  , "webui_listen":
    [ "0.0.0.0"
    , "[::]"
    ]
  , "webui_https_port": null
  };

// For now, start with all shares empty.
const shares =
  { afp_shares: []
  , nfs_shares: []
  , cifs_shares: []
  };

const globalNetworkConfig =
  { dhcp:
    { assign_gateway: true
    , assign_dns: true
    }
  , http_proxy: null
  , autoconfigure: false
  , dns:
    { search: []
    , servers: [ "10.5.0.1"
               , "8.8.8.8"
               , "0:0:0:0:0:ffff:a05:1"
               ]
    }
  , gateway:
    { ipv4: "10.5.0.1"
    , ipv6: "0:0:0:0:0:ffff:a05:1"
    }
  };

const defaultInterfaces = require( "./default-interfaces.json" )[ "interfaces" ];

// These are the system users that will always be present.
const builtinUsers =  require( "./default-users.json" )[ "users" ];

// These are the system groups that will always be present.
const builtinGroups = require( "./default-groups.json" )[ "groups" ];

// This represents the pool created during installation.
var startingPools =
  [ { status: "ONLINE"
  , name: "freenas-boot"
  , scan:
    { errors: 0
    , start_time: "2015-07-06 22:33:22"
    , "bytes_to_process": 1902075904
    , state: "FINISHED"
    , "end_time": "2015-07-06 22:33:36"
    , func: 1
    , "bytes_processed": 1903964160
    , percentage: 99.90082383155823
    }
    , hostname: "freenas.local"
    , "root_dataset":
      { properties:
        { origin:
          { source: null
          , value: null
          }
        , referenced:
          { source: "NONE"
          , value: "144K"
          }
        , numclones:
          { source: null
          , value: null
          }
        , primarycache:
          { source: "DEFAULT"
          , value: "all"
          }
        , logbias:
          { source: "DEFAULT"
          , value: "latency"
          }
        , inconsistent:
          { source: "NONE"
          , value: "0"
          }
        , reservation:
          { source: "DEFAULT"
          , value: "none"
          }
        , casesensitivity:
          { source: "NONE"
          , value: "sensitive"
          }
        , guid:
          { source: "NONE"
          , value: "10539257700055418542"
          }
        , usedbysnapshots:
          { source: "NONE"
          , value: "0"
          }
        , stmf_sbd_lu:
          { source: null
          , value: null
          }
        , mounted:
          { source: "NONE"
          , value: "no"
          }
        , compression:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapdir:
          { source: "DEFAULT"
          , value: "hidden"
          }
        , copies:
          { source: "DEFAULT"
          , value: "1"
          }
        , aclinherit:
          { source: "DEFAULT"
          , value: "restricted"
          }
        , compressratio:
          { source: "NONE"
          , value: "1.00x"
          }
        , recordsize:
          { source: "DEFAULT"
          , value: "128K"
          }
        , mlslabel:
          { source: "NONE"
          , value: ""
          }
        , jailed:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapshot_count:
          { source: "DEFAULT"
          , value: "none"
          }
        , volsize:
          { source: null
          , value: null
          }
        , clones:
          { source: null
          , value: null
          }
        , atime:
          { source: "LOCAL"
          , value: "off"
          }
        , usedbychildren:
          { source: "NONE"
          , value: "1.91G"
          }
        , volblocksize:
          { source: null
          , value: null
          }
        , objsetid:
          { source: "NONE"
          , value: "21"
          }
        , name:
          { source: "NONE"
          , value: "freenas-boot"
          }
        , defer_destroy:
          { source: null
          , value: null
          }
        , type:
          { source: "NONE"
          , value: "filesystem"
          }
        , devices:
          { source: "DEFAULT"
          , value: "on"
          }
        , useraccounting:
          { source: "NONE"
          , value: "1"
          }
        , iscsioptions:
          { source: null
          , value: null
          }
        , setuid:
          { source: "DEFAULT"
          , value: "on"
          }
        , usedbyrefreservation:
          { source: "NONE"
          , value: "0"
          }
        , logicalused:
          { source: "NONE"
          , value: "1.78G"
          }
        , userrefs:
          { source: null
          , value: null
          }
        , creation:
          { source: "NONE"
          , value: "Mon Jul  6 22:29 2015"
          }
        , sync:
          { source: "DEFAULT"
          , value: "standard"
          }
        , volmode:
          { source: "DEFAULT"
          , value: "default"
          }
        , sharenfs:
          { source: "DEFAULT"
          , value: "off"
          }
        , sharesmb:
          { source: "DEFAULT"
          , value: "off"
          }
        , createtxg:
          { source: "NONE"
          , value: "1"
          }
        , mountpoint:
          { source: "LOCAL"
          , value: "none"
          }
        , xattr:
          { source: "DEFAULT"
          , value: "on"
          }
        , utf8only:
          { source: "NONE"
          , value: "off"
          }
        , aclmode:
          { source: "DEFAULT"
          , value: "discard"
          }
        , exec:
          { source: "DEFAULT"
          , value: "on"
          }
        , dedup:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapshot_limit:
          { source: "DEFAULT"
          , value: "none"
          }
        , readonly:
          { source: "DEFAULT"
          , value: "off"
          }
        , version:
          { source: "NONE"
          , value: "5"
          }
        , filesystem_limit:
          { source: "DEFAULT"
          , value: "none"
          }
        , secondarycache:
          { source: "DEFAULT"
          , value: "all"
          }
        , prevsnap:
          { source: "DEFAULT"
          , value: ""
          }
        , available:
          { source: "NONE"
          , value: "12.5G"
          }
        , used:
          { source: "NONE"
          , value: "1.91G"
          }
        , written:
          { source: "NONE"
          , value: "144K"
          }
        , refquota:
          { source: "DEFAULT"
          , value: "none"
          }
        , refcompressratio:
          { source: "NONE"
          , value: "1.00x"
          }
        , quota:
          { source: "DEFAULT"
          , value: "none"
          }
        , vscan:
          { source: "DEFAULT"
          , value: "off"
          }
        , canmount:
          { source: "LOCAL"
          , value: "off"
          }
        , normalization:
          { source: "NONE"
          , value: "none"
          }
        , usedbydataset:
          { source: "NONE"
          , value: "144K"
          }
        , unique:
          { source: "NONE"
          , value: "144K"
          }
        , checksum:
          { source: "DEFAULT"
          , value: "on"
          }
        , redundant_metadata:
          { source: "DEFAULT"
          , value: "all"
          }
        , filesystem_count:
          { source: "DEFAULT"
          , value: "none"
          }
        , refreservation:
          { source: "DEFAULT"
          , value: "none"
          }
        , logicalreferenced:
          { source: "NONE"
          , value: "15.5K"
          }
        , nbmand:
          { source: "DEFAULT"
          , value: "off"
          }
      }
    , children:
      [ { properties:
          { origin:
            { source: null
            , value: null
            }
          , referenced:
            { source: "NONE"
            , value: "11.9M"
            }
          , numclones:
            { source: null
            , value: null
            }
          , primarycache:
            { source: "DEFAULT"
            , value: "all"
            }
          , logbias:
            { source: "DEFAULT"
            , value: "latency"
            }
          , inconsistent:
            { source: "NONE"
            , value: "0"
            }
          , reservation:
            { source: "DEFAULT"
            , value: "none"
            }
          , casesensitivity:
            { source: "NONE"
            , value: "sensitive"
            }
          , guid:
            { source: "NONE"
            , value: "3591208425258712659"
            }
          , usedbysnapshots:
            { source: "NONE"
            , value: "0"
            }
          , stmf_sbd_lu:
            { source: null
            , value: null
            }
          , mounted:
            { source: "NONE"
            , value: "yes"
            }
          , compression:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapdir:
            { source: "DEFAULT"
            , value: "hidden"
            }
          , copies:
            { source: "DEFAULT"
            , value: "1"
            }
          , aclinherit:
            { source: "DEFAULT"
            , value: "restricted"
            }
          , compressratio:
            { source: "NONE"
            , value: "1.00x"
            }
          , recordsize:
            { source: "DEFAULT"
            , value: "128K"
            }
          , mlslabel:
            { source: "NONE"
            , value: ""
            }
          , jailed:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapshot_count:
            { source: "DEFAULT"
            , value: "none"
            }
          , volsize:
            { source: null
            , value: null
            }
          , clones:
            { source: null
            , value: null
            }
          , atime:
            { source: "INHERITED"
            , value: "off"
            }
          , usedbychildren:
            { source: "NONE"
            , value: "0"
            }
          , volblocksize:
            { source: null
            , value: null
            }
          , objsetid:
            { source: "NONE"
            , value: "51"
            }
          , name:
            { source: "NONE"
            , value: "freenas-boot/grub"
            }
          , defer_destroy:
            { source: null
            , value: null
            }
          , type:
            { source: "NONE"
            , value: "filesystem"
            }
          , devices:
            { source: "DEFAULT"
            , value: "on"
            }
          , useraccounting:
            { source: "NONE"
            , value: "1"
            }
          , iscsioptions:
            { source: null
            , value: null
            }
          , setuid:
            { source: "DEFAULT"
            , value: "on"
            }
          , usedbyrefreservation:
            { source: "NONE"
            , value: "0"
            }
          , logicalused:
            { source: "NONE"
            , value: "11.1M"
            }
          , userrefs:
            { source: null
            , value: null
            }
          , creation:
            { source: "NONE"
            , value: "Mon Jul  6 22:29 2015"
            }
          , sync:
            { source: "DEFAULT"
            , value: "standard"
            }
          , volmode:
            { source: "DEFAULT"
            , value: "default"
            }
          , sharenfs:
            { source: "DEFAULT"
            , value: "off"
            }
          , sharesmb:
            { source: "DEFAULT"
            , value: "off"
            }
          , createtxg:
            { source: "NONE"
            , value: "12"
            }
          , mountpoint:
            { source: "LOCAL"
            , value: "legacy"
            }
          , xattr:
            { source: "TEMPORARY"
            , value: "off"
            }
          , utf8only:
            { source: "NONE"
            , value: "off"
            }
          , aclmode:
            { source: "DEFAULT"
            , value: "discard"
            }
          , exec:
            { source: "DEFAULT"
            , value: "on"
            }
          , dedup:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapshot_limit:
            { source: "DEFAULT"
            , value: "none"
            }
          , readonly:
            { source: "DEFAULT"
            , value: "off"
            }
          , version:
            { source: "NONE"
            , value: "5"
            }
          , filesystem_limit:
            { source: "DEFAULT"
            , value: "none"
            }
          , secondarycache:
            { source: "DEFAULT"
            , value: "all"
            }
          , prevsnap:
            { source: "DEFAULT"
            , value: ""
            }
          , available:
            { source: "NONE"
            , value: "12.5G"
            }
          , used:
            { source: "NONE"
            , value: "11.9M"
            }
          , written:
            { source: "NONE"
            , value: "11.9M"
            }
          , refquota:
            { source: "DEFAULT"
            , value: "none"
            }
          , refcompressratio:
            { source: "NONE"
            , value: "1.00x"
            }
          , quota:
            { source: "DEFAULT"
            , value: "none"
            }
          , vscan:
            { source: "DEFAULT"
            , value: "off"
            }
          , canmount:
            { source: "DEFAULT"
            , value: "on"
            }
          , normalization:
            { source: "NONE"
            , value: "none"
            }
          , usedbydataset:
            { source: "NONE"
            , value: "11.9M"
            }
          , unique:
            { source: "NONE"
            , value: "11.9M"
            }
          , checksum:
            { source: "DEFAULT"
            , value: "on"
            }
          , redundant_metadata:
            { source: "DEFAULT"
            , value: "all"
            }
          , filesystem_count:
            { source: "DEFAULT"
            , value: "none"
            }
          , refreservation:
            { source: "DEFAULT"
            , value: "none"
            }
          , logicalreferenced:
            { source: "NONE"
            , value: "11.1M"
            }
          , nbmand:
            { source: "DEFAULT"
            , value: "off"
            }
          }
        , children: []
        , name: "freenas-boot/grub"
        }
      , {
        properties:
        { origin:
          { source: null
          , value: null
          }
        , referenced:
          { source: "NONE"
          , value: "144K"
          }
        , numclones:
          { source: null
          , value: null
          }
        , primarycache:
          { source: "DEFAULT"
          , value: "all"
          }
        , logbias:
          { source: "DEFAULT"
          , value: "latency"
          }
        , inconsistent:
          { source: "NONE"
          , value: "0"
          }
        , reservation:
          { source: "DEFAULT"
          , value: "none"
          }
        , casesensitivity:
          { source: "NONE"
          , value: "sensitive"
          }
        , guid:
          { source: "NONE"
          , value: "13703442620787950322"
          }
        , usedbysnapshots:
          { source: "NONE"
          , value: "0"
          }
        , stmf_sbd_lu:
          { source: null
          , value: null
          }
        , mounted:
          { source: "NONE"
          , value: "no"
          }
        , compression:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapdir:
          { source: "DEFAULT"
          , value: "hidden"
          }
        , copies:
          { source: "DEFAULT"
          , value: "1"
          }
        , aclinherit:
          { source: "DEFAULT"
          , value: "restricted"
          }
        , compressratio:
          { source: "NONE"
          , value: "1.00x"
          }
        , recordsize:
          { source: "DEFAULT"
          , value: "128K"
          }
        , mlslabel:
          { source: "NONE"
          , value: ""
          }
        , jailed:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapshot_count:
          { source: "DEFAULT"
          , value: "none"
          }
        , volsize:
          { source: null
          , value: null
          }
        , clones:
          { source: null
          , value: null
          }
        , atime:
          { source: "INHERITED"
          , value: "off"
          }
        , usedbychildren:
          { source: "NONE"
          , value: "1.87G"
          }
        , volblocksize:
          { source: null
          , value: null
          }
        , objsetid:
          { source: "NONE"
          , value: "37"
          }
        , name:
          { source: "NONE"
          , value: "freenas-boot/ROOT"
          }
        , defer_destroy:
          { source: null
          , value: null
          }
        , type:
          { source: "NONE"
          , value: "filesystem"
          }
        , devices:
          { source: "DEFAULT"
          , value: "on"
          }
        , useraccounting:
          { source: "NONE"
          , value: "1"
          }
        , iscsioptions:
          { source: null
          , value: null
          }
        , setuid:
          { source: "DEFAULT"
          , value: "on"
          }
        , usedbyrefreservation:
          { source: "NONE"
          , value: "0"
          }
        , logicalused:
          { source: "NONE"
          , value: "1.75G"
          }
        , userrefs:
          { source: null
          , value: null
          }
        , creation:
          { source: "NONE"
          , value: "Mon Jul  6 22:29 2015"
          }
        , sync:
          { source: "DEFAULT"
          , value: "standard"
          }
        , volmode:
          { source: "DEFAULT"
          , value: "default"
          }
        , sharenfs:
          { source: "DEFAULT"
          , value: "off"
          }
        , sharesmb:
          { source: "DEFAULT"
          , value: "off"
          }
        , createtxg:
          { source: "NONE"
          , value: "8"
          }
        , mountpoint:
          { source: "INHERITED"
          , value: "none"
          }
        , xattr:
          { source: "DEFAULT"
          , value: "on"
          }
        , utf8only:
          { source: "NONE"
          , value: "off"
          }
        , aclmode:
          { source: "DEFAULT"
          , value: "discard"
          }
        , exec:
          { source: "DEFAULT"
          , value: "on"
          }
        , dedup:
          { source: "DEFAULT"
          , value: "off"
          }
        , snapshot_limit:
          { source: "DEFAULT"
          , value: "none"
          }
        , readonly:
          { source: "DEFAULT"
          , value: "off"
          }
        , version:
          { source: "NONE"
          , value: "5"
          }
        , filesystem_limit:
          { source: "DEFAULT"
          , value: "none"
          }
        , secondarycache:
          { source: "DEFAULT"
          , value: "all"
          }
        , prevsnap:
          { source: "DEFAULT"
          , value: ""
          }
        , available:
          { source: "NONE"
          , value: "12.5G"
          }
        , used:
          { source: "NONE"
          , value: "1.87G"
          }
        , written:
          { source: "NONE"
          , value: "144K"
          }
        , refquota:
          { source: "DEFAULT"
          , value: "none"
          }
        , refcompressratio:
          { source: "NONE"
          , value: "1.00x"
          }
        , quota:
          { source: "DEFAULT"
          , value: "none"
          }
        , vscan:
          { source: "DEFAULT"
          , value: "off"
          }
        , canmount:
          { source: "LOCAL"
          , value: "off"
          }
        , normalization:
          { source: "NONE"
          , value: "none"
          }
        , usedbydataset:
          { source: "NONE"
          , value: "144K"
          }
        , unique:
          { source: "NONE"
          , value: "144K"
          }
        , checksum:
          { source: "DEFAULT"
          , value: "on"
          }
        , redundant_metadata:
          { source: "DEFAULT"
          , value: "all"
          }
        , filesystem_count:
          { source: "DEFAULT"
          , value: "none"
          }
        , refreservation:
          { source: "DEFAULT"
          , value: "none"
          }
        , logicalreferenced:
          { source: "NONE"
          , value: "15.5K"
          }
        , nbmand:
          { source: "DEFAULT"
          , value: "off"
          }
        }
      , children:
        [ { properties:
            { origin:
              { source: null
              , value: null
              }
            , referenced:
              { source: "NONE"
              , value: "1.87G"
              }
            , numclones:
              { source: null
              , value: null
              }
            , primarycache:
              { source: "DEFAULT"
              , value: "all"
              }
            , logbias:
              { source: "DEFAULT"
              , value: "latency"
              }
            , inconsistent:
              { source: "NONE"
              , value: "0"
              }
            , reservation:
              { source: "DEFAULT"
              , value: "none"
              }
            , casesensitivity:
              { source: "NONE"
              , value: "sensitive"
              }
            , guid:
              { source: "NONE"
              , value: "12010045007004163097"
              }
            , usedbysnapshots:
              { source: "NONE"
              , value: "0"
              }
            , stmf_sbd_lu:
              { source: null
              , value: null
              }
            , mounted:
              { source: "NONE"
              , value: "yes"
              }
            , compression:
              { source: "DEFAULT"
              , value: "off"
              }
            , snapdir:
              { source: "DEFAULT"
              , value: "hidden"
              }
            , copies:
              { source: "DEFAULT"
              , value: "1"
              }
            , aclinherit:
              { source: "DEFAULT"
              , value: "restricted"
              }
            , compressratio:
              { source: "NONE"
              , value: "1.00x"
              }
            , recordsize:
              { source: "DEFAULT"
              , value: "128K"
              }
            , mlslabel:
              { source: "NONE"
              , value: ""
              }
            , jailed:
              { source: "DEFAULT"
              , value: "off"
              }
            , snapshot_count:
              { source: "DEFAULT"
              , value: "none"
              }
            , volsize:
              { source: null
              , value: null
              }
            , clones:
              { source: null
              , value: null
              }
            , atime:
              { source: "INHERITED"
              , value: "off"
              }
            , usedbychildren:
              { source: "NONE"
              , value: "0"
              }
            , volblocksize:
              { source: null
              , value: null
              }
            , objsetid:
              { source: "NONE"
              , value: "44"
              }
            , name:
              { source: "NONE"
              , value: "freenas-boot/ROOT/default"
              }
            , defer_destroy:
              { source: null
              , value: null
              }
            , type:
              { source: "NONE"
              , value: "filesystem"
              }
            , devices:
              { source: "DEFAULT"
              , value: "on"
              }
            , useraccounting:
              { source: "NONE"
              , value: "1"
              }
            , iscsioptions:
              { source: null
              , value: null
              }
            , setuid:
              { source: "DEFAULT"
              , value: "on"
              }
            , usedbyrefreservation:
              { source: "NONE"
              , value: "0"
              }
            , logicalused:
              { source: "NONE"
              , value: "1.75G"
              }
            , userrefs:
              { source: null
              , value: null
              }
            , creation:
              { source: "NONE"
              , value: "Mon Jul  6 22:29 2015"
              }
            , sync:
              { source: "DEFAULT"
              , value: "standard"
              }
            , volmode:
              { source: "DEFAULT"
              , value: "default"
              }
            , sharenfs:
              { source: "DEFAULT"
              , value: "off"
              }
            , sharesmb:
              { source: "DEFAULT"
              , value: "off"
              }
            , createtxg:
              { source: "NONE"
              , value: "10"
              }
            , mountpoint:
              { source: "LOCAL"
              , value: "legacy"
              }
            , xattr:
              { source: "TEMPORARY"
              , value: "off"
              }
            , utf8only:
              { source: "NONE"
              , value: "off"
              }
            , aclmode:
              { source: "DEFAULT"
              , value: "discard"
              }
            , exec:
              { source: "DEFAULT"
              , value: "on"
              }
            , dedup:
              { source: "DEFAULT"
              , value: "off"
              }
            , snapshot_limit:
              { source: "DEFAULT"
              , value: "none"
              }
            , readonly:
              { source: "DEFAULT"
              , value: "off"
              }
            , version:
              { source: "NONE"
              , value: "5"
              }
            , filesystem_limit:
              { source: "DEFAULT"
              , value: "none"
              }
            , secondarycache:
              { source: "DEFAULT"
              , value: "all"
              }
            , prevsnap:
              { source: "DEFAULT"
              , value: ""
              }
            , available:
              { source: "NONE"
              , value: "12.5G"
              }
            , used:
              { source: "NONE"
              , value: "1.87G"
              }
            , written:
              { source: "NONE"
              , value: "1.87G"
              }
            , refquota:
              { source: "DEFAULT"
              , value: "none"
              }
            , refcompressratio:
              { source: "NONE"
              , value: "1.00x"
              }
            , quota:
              { source: "DEFAULT"
              , value: "none"
              }
            , vscan:
              { source: "DEFAULT"
              , value: "off"
              }
            , canmount:
              { source: "DEFAULT"
              , value: "on"
              }
            , normalization:
              { source: "NONE"
              , value: "none"
              }
            , usedbydataset:
              { source: "NONE"
              , value: "1.87G"
              }
            , unique:
              { source: "NONE"
              , value: "1.87G"
              }
            , checksum:
              { source: "DEFAULT"
              , value: "on"
              }
            , redundant_metadata:
              { source: "DEFAULT"
              , value: "all"
              }
            , filesystem_count:
              { source: "DEFAULT"
              , value: "none"
              }
            , refreservation:
              { source: "DEFAULT"
              , value: "none"
              }
            , logicalreferenced:
              { source: "NONE"
              , value: "1.75G"
              }
            , nbmand:
              { source: "DEFAULT"
              , value: "off"
              }
            }
          , children: []
          , name: "freenas-boot/ROOT/default"
          }
        ]
      , name: "freenas-boot/ROOT"
      }
      , {
          properties:
          { origin:
            { source: null
            , value: null
            }
          , referenced:
            { source: "NONE"
            , value: "17.8M"
            }
          , numclones:
            { source: null
            , value: null
            }
          , primarycache:
            { source: "DEFAULT"
            , value: "all"
            }
          , logbias:
            { source: "DEFAULT"
            , value: "latency"
            }
          , inconsistent:
            { source: "NONE"
            , value: "0"
            }
          , reservation:
            { source: "DEFAULT"
            , value: "none"
            }
          , casesensitivity:
            { source: "NONE"
            , value: "sensitive"
            }
          , guid:
            { source: "NONE"
            , value: "12731083582611887896"
            }
          , usedbysnapshots:
            { source: "NONE"
            , value: "0"
            }
          , stmf_sbd_lu:
            { source: null
            , value: null
            }
          , mounted:
            { source: "NONE"
            , value: "yes"
            }
          , compression:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapdir:
            { source: "DEFAULT"
            , value: "hidden"
            }
          , copies:
            { source: "DEFAULT"
            , value: "1"
            }
          , aclinherit:
            { source: "DEFAULT"
            , value: "restricted"
            }
          , compressratio:
            { source: "NONE"
            , value: "1.00x"
            }
          , recordsize:
            { source: "DEFAULT"
            , value: "128K"
            }
          , mlslabel:
            { source: "NONE"
            , value: ""
            }
          , jailed:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapshot_count:
            { source: "DEFAULT"
            , value: "none"
            }
          , volsize:
            { source: null
            , value: null
            }
          , clones:
            { source: null
            , value: null
            }
          , atime:
            { source: "INHERITED"
            , value: "off"
            }
          , usedbychildren:
            { source: "NONE"
            , value: "0"
            }
          , volblocksize:
            { source: null
            , value: null
            }
          , objsetid:
            { source: "NONE"
            , value: "101"
            }
          , name:
            { source: "NONE"
            , value: "freenas-boot/.system-9f81b30c"
            }
          , defer_destroy:
            { source: null
            , value: null
            }
          , type:
            { source: "NONE"
            , value: "filesystem"
            }
          , devices:
            { source: "DEFAULT"
            , value: "on"
            }
          , useraccounting:
            { source: "NONE"
            , value: "1"
            }
          , iscsioptions:
            { source: null
            , value: null
            }
          , setuid:
            { source: "DEFAULT"
            , value: "on"
            }
          , usedbyrefreservation:
            { source: "NONE"
            , value: "0"
            }
          , logicalused:
            { source: "NONE"
            , value: "17.6M"
            }
          , userrefs:
            { source: null
            , value: null
            }
          , creation:
            { source: "NONE"
            , value: "Mon Jul  6 22:41 2015"
            }
          , sync:
            { source: "DEFAULT"
            , value: "standard"
            }
          , volmode:
            { source: "DEFAULT"
            , value: "default"
            }
          , sharenfs:
            { source: "DEFAULT"
            , value: "off"
            }
          , sharesmb:
            { source: "DEFAULT"
            , value: "off"
            }
          , createtxg:
            { source: "NONE"
            , value: "85"
            }
          , mountpoint:
            { source: "LOCAL"
            , value: "/var/db/system"
            }
          , xattr:
            { source: "TEMPORARY"
            , value: "off"
            }
          , utf8only:
            { source: "NONE"
            , value: "off"
            }
          , aclmode:
            { source: "DEFAULT"
            , value: "discard"
            }
          , exec:
            { source: "DEFAULT"
            , value: "on"
            }
          , dedup:
            { source: "DEFAULT"
            , value: "off"
            }
          , snapshot_limit:
            { source: "DEFAULT"
            , value: "none"
            }
          , readonly:
            { source: "DEFAULT"
            , value: "off"
            }
          , version:
            { source: "NONE"
            , value: "5"
            }
          , filesystem_limit:
            { source: "DEFAULT"
            , value: "none"
            }
          , secondarycache:
            { source: "DEFAULT"
            , value: "all"
            }
          , prevsnap:
            { source: "DEFAULT"
            , value: ""
            }
          , available:
            { source: "NONE"
            , value: "12.5G"
            }
          , used:
            { source: "NONE"
            , value: "17.8M"
            }
          , written:
            { source: "NONE"
            , value: "17.8M"
            }
          , refquota:
            { source: "DEFAULT"
            , value: "none"
            }
          , refcompressratio:
            { source: "NONE"
            , value: "1.00x"
            }
          , quota:
            { source: "DEFAULT"
            , value: "none"
            }
          , vscan:
            { source: "DEFAULT"
            , value: "off"
            }
          , canmount:
            { source: "DEFAULT"
            , value: "on"
            }
          , normalization:
            { source: "NONE"
            , value: "none"
            }
          , usedbydataset:
            { source: "NONE"
            , value: "17.8M"
            }
          , unique:
            { source: "NONE"
            , value: "17.8M"
            }
          , checksum:
            { source: "DEFAULT"
            , value: "on"
            }
          , redundant_metadata:
            { source: "DEFAULT"
            , value: "all"
            }
          , filesystem_count:
            { source: "DEFAULT"
            , value: "none"
            }
          , refreservation:
            { source: "DEFAULT"
            , value: "none"
            }
          , logicalreferenced:
            { source: "NONE"
            , value: "17.6M"
            }
          , nbmand:
            { source: "DEFAULT"
            , value: "off"
            }
          }
        , children: []
        , name: "freenas-boot/.system-9f81b30c"
        }
      ]
    , name: "freenas-boot"
    }
  , groups:
    { cache: []
    , data:
      [ { status: "ONLINE"
        , path: "/dev/ada2p2"
        , guid: "10996095475947661674"
        , type: "disk"
        , children: []
        }
      ]
    , log: []
    }
  , guid: "13183533626414585519"
  , properties:
    { comment:
      { source: "DEFAULT"
      , value: "-"
      }
    , freeing:
      { source: "LOCAL"
      , value: "0"
      }
    , listsnapshots:
      { source: "DEFAULT"
      , value: "off"
      }
    , leaked:
      { source: "LOCAL"
      , value: "0"
      }
    , version:
      { source: "LOCAL"
      , value: "28"
      }
    , free:
      { source: "NONE"
      , value: "13.0G"
      }
    , delegation:
      { source: "DEFAULT"
      , value: "on"
      }
    , dedupditto:
      { source: "DEFAULT"
      , value: "0"
      }
    , failmode:
      { source: "DEFAULT"
      , value: "wait"
      }
    , autoexpand:
      { source: "DEFAULT"
      , value: "off"
      }
    , allocated:
      { source: "NONE"
      , value: "1.91G"
      }
    , guid:
      { source: "LOCAL"
      , value: "13183533626414585519"
      }
    , altroot:
      { source: "DEFAULT"
      , value: "-"
      }
    , size:
      { source: "NONE"
      , value: "14.9G"
      }
    , fragmentation:
      { source: "NONE"
      , value: "-"
      }
    , capacity:
      { source: "NONE"
      , value: "12%"
      }
    , name:
      { source: "NONE"
      , value: "freenas-boot"
      }
    , maxblocksize:
      { source: "NONE"
      , value: "131072"
      }
    , cachefile:
      { source: "DEFAULT"
      , value: "-"
      }
    , bootfs:
      { source: "LOCAL"
      , value: "freenas-boot/ROOT/default"
      }
    , autoreplace:
      { source: "DEFAULT"
      , value: "off"
      }
    , readonly:
      { source: "NONE"
      , value: "off"
      }
    , dedupratio:
      { source: "NONE"
      , value: "1.00x"
      }
    , health:
      { source: "NONE"
      , value: "ONLINE"
      }
    , expandsize:
      { source: "NONE"
      , value: "-"
      }
    }
  }
  ];

function createSystem () {

  // Select the system config file to use for the virtual FreeNAS instance.
  var systemConfig;
  var configStats;

  try {
    fs.lstatSync( "./simulator/configs/customSystem.js" );
    systemConfig = require( "../configs/customSystem" )();
  } catch ( err ) {
    systemConfig = require( "../configs/defaultSystem" )();
  }

  var newSystem =
    { users: builtinUsers
    , groups: builtinGroups
    , globalNetworkConfig: globalNetworkConfig
    , interfaces: defaultInterfaces
    , pools: startingPools
    , uiSettings: uiSettings
    };

  newSystem = _.merge( newSystem, systemConstants, shares );

  var disks = createDisks( systemConfig[ "disksConfig" ] );

  newSystem[ "disks" ] = _.cloneDeep( disks );

  newSystem[ "volumes" ]
    = createVolumes( systemConfig[ "volumesConfig" ], disks );

  return newSystem;
}

module.exports = createSystem;
