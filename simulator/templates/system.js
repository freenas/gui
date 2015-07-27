// Virtual System Generator
// =======================
// Constructs JSON representing the hardware of a system to be used with the
// middleware simulator.

"use strict";

var _ = require( "lodash" );
var createDisks = require( "./disk.js" );
var createVolumes = require( "./volumes.js" );

// These are taken from a real FreeNAS Mini, but they're arbitrary. Want to say
// your virtual system has a Pentium? Go for it!
var systemConstants =
  { memory_size: 17124196352
  , cpu_model: "Intel(R) Atom(TM) CPU  C2750  @ 2.40GHz\u0000"
  , cpu_cores: 8
  , uname_full: "FreeBSD freenas.local 10.1-STABLE FreeBSD 10.1-STABLE #9 a3a2df9(HEAD): Sun Jul  5 21:03:54 PDT 2015     root@build.ixsystems.com:/tank/home/nightlies/freenas-build/_BE/objs/tank/home/nightlies/freenas-build/_BE/trueos/sys/FreeNAS.amd64  amd64\n"
  };

// For now, start with all shares empty.
var shares =
  { afp_shares: []
  , nfs_shares: []
  , cifs_shares: []
  };

// These are the system users that will always be present.
var builtinUsers =
  [ { username: "proxy"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.078946
    , "created-at": 1436221971.078946
    , group: 62
    , builtin: true
    , "full_name": "Packet Filter pseudo-user"
    , "logged-in": false
    , id: 6
    , home: "/nonexistent"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "_pflogd"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.085953
    , "created-at": 1436221971.085953
    , group: 64
    , builtin: true
    , "full_name": "pflogd privsep user"
    , "logged-in": false
    , id: 6
    , home: "/var/empty"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "_dhcp"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.087667
    , "created-at": 1436221971.087667
    , group: 65
    , builtin: true
    , "full_name": "dhcp programs"
    , "logged-in": false
    , id: 6
    , home: "/var/empty"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "uucp"
    , sshpubkey: null
    , shell: "/usr/local/libexec/uucp/uucico"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.089358
    , "created-at": 1436221971.089358
    , group: 66
    , builtin: true
    , "full_name": "UUCP pseudo-user"
    , "logged-in": false
    , id: 6
    , home: "/var/spool/uucppublic"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "pop"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.091019
    , "created-at": 1436221971.091019
    , group: 6
    , builtin: true
    , "full_name": "Post Office Owner"
    , "logged-in": false
    , id: 6
    , home: "/nonexistent"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "www"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions:
      [ { username: "www"
        , resource: null
        , id: 18
        , "updated-at": 1437419594.926439
        , "created-at": 1437419594.926439
        , port: 53068
        , address: "10.5.0.225"
        , active: true
        , "started-at": 1437419594.921631
        }
      , { username: "www"
        , resource: null
        , id: 18
        , "updated-at": 1437419596.577363
        , "created-at": 1437419596.577363
        , port: 53068
        , address: "10.5.0.225"
        , active: true
        , "started-at": 1437419596.562857
        }
      , { username: "www"
        , resource: null
        , id: 18
        , "updated-at": 1437419597.665144
        , "created-at": 1437419597.665144
        , port: 53068
        , address: "10.5.0.225"
        , active: true
        , "started-at": 1437419597.660128
        }
      , { username: "www"
        , resource: null
        , id: 18
        , "updated-at": 1437419597.819172
        , "created-at": 1437419597.819172
        , port: 53068
        , address: "10.5.0.225"
        , active: true
        , "started-at": 1437419597.814978
        }
      , { username: "www"
        , resource: null
        , id: 18
        , "updated-at": 1437419597.964198
        , "created-at": 1437419597.964198
        , port: 53068
        , address: "10.5.0.225"
        , active: true
        , "started-at": 1437419597.959999
        }
      ]
    , "updated-at": 1436221971.092668
    , "created-at": 1436221971.092668
    , group: 80
    , builtin: true
    , "full_name": "World id Web Owner"
    , "logged-in": true
    , id: 80
    , home: "/nonexistent"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "smmsp"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.094304
    , "created-at": 1436221971.094304
    , group: 25
    , builtin: true
    , "full_name": "Sendmail Submission User"
    , "logged-in": false
    , id: 25
    , home: "/var/spool/clientmqueue"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "mailnull"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.09595
    , "created-at": 1436221971.09595
    , group: 26
    , builtin: true
    , "full_name": "Sendmail Default User"
    , "logged-in": false
    , id: 26
    , home: "/var/spool/mqueue"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "sshd"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.097642
    , "created-at": 1436221971.097642
    , group: 22
    , builtin: true
    , "full_name": "SecureShellDaemon"
    , "logged-in": false
    , id: 22
    , home: "/var/empty"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "daemon"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.0993
    , "created-at": 1436221971.0993
    , group: 1
    , builtin: true
    , "full_name": "Owner of many system processes"
    , "logged-in": false
    , id: 1
    , home: "/root"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "bin"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.102584
    , "created-at": 1436221971.102584
    , group: 7
    , builtin: true
    , "full_name": "Binaries Commands and Source"
    , "logged-in": false
    , id: 3
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "operator"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.104225
    , "created-at": 1436221971.104225
    , group: 5
    , builtin: true
    , "full_name": "System &"
    , "logged-in": false
    , id: 2
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "kmem"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.105876
    , "created-at": 1436221971.105876
    , group: 2
    , builtin: true
    , "full_name": "KMem Sandbox"
    , "logged-in": false
    , id: 5
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "tty"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.107519
    , "created-at": 1436221971.107519
    , group: 65533
    , builtin: true
    , "full_name": "Tty Sandbox"
    , "logged-in": false
    , id: 4
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "nullmail"
    , sshpubkey: null
    , shell: "/bin/sh"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.109153
    , "created-at": 1436221971.109153
    , group: 522
    , builtin: true
    , "full_name": "Nullmailer Mail System"
    , "logged-in": false
    , id: 522
    , home: "/var/spool/nullmailer"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "man"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.110804
    , "created-at": 1436221971.110804
    , group: 9
    , builtin: true
    , "full_name": "Mister Man Pages"
    , "logged-in": false
    , id: 9
    , home: "/usr/share/man"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "news"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.112617
    , "created-at": 1436221971.112617
    , group: 8
    , builtin: true
    , "full_name": "News Subsystem"
    , "logged-in": false
    , id: 8
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "games"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.114305
    , "created-at": 1436221971.114305
    , group: 13
    , builtin: true
    , "full_name": "Games pseudo-user"
    , "logged-in": false
    , id: 7
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "auditdistd"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.115957
    , "created-at": 1436221971.115957
    , group: 77
    , builtin: true
    , "full_name": "Auditdistd unprivileged user"
    , "logged-in": false
    , id: 78
    , home: "/var/empty"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "ftp"
    , sshpubkey: null
    , shell: "/bin/csh"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.117601
    , "created-at": 1436221971.117601
    , group: 14
    , builtin: true
    , "full_name": null
    , "logged-in": false
    , id: 14
    , home: "/nonexistent"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "bind"
    , sshpubkey: null
    , shell: "/usr/sbin/nologin"
    , locked: false
    , groups: []
    , sessions: []
    , "updated-at": 1436221971.119238
    , "created-at": 1436221971.119238
    , group: 53
    , builtin: true
    , "full_name": "Bind Sandbox"
    , "logged-in": false
    , id: 53
    , home: "/"
    , sudo: false
    , email: null
    , "password_disabled": false
    }
  , { username: "root"
    , sshpubkey: null
    , shell: "/bin/csh"
    , locked: false
    , builtin: true
    , sessions:
      [ { username: "root"
        , resource: null
        , id: 2
        , "updated-at": 1436222477.102969
        , "created-at": 1436222477.102969
        , port: 35057
        , address: "127.0.0.1"
        , active: true
        , "started-at": 1436222477.098721
        }
      , { username: "root"
        , resource: null
        , id: 53
        , "updated-at": 1436295829.782153
        , "created-at": 1436295829.782153
        , port: 57071
        , address: "10.5.0.176"
        , active: true
        , "started-at": 1436295829.778141
        }
      , { username: "root"
        , resource: null
        , id: 56
        , "updated-at": 1436297667.10981
        , "created-at": 1436297667.10981
        , port: 49666
        , address: "127.0.0.1"
        , active: true
        , "started-at": 1436297667.104117
        }
      , { username: "root"
        , resource: null
        , id: 102
        , "updated-at": 1436988789.974536
        , "created-at": 1436988789.974536
        , port: 58799
        , address: "10.5.0.176"
        , active: true
        , "started-at": 1436988789.969905
        }
      , { username: "root"
        , resource: null
        , id: 137
        , "updated-at": 1436996608.419257
        , "created-at": 1436996608.419257
        , port: 64891
        , address: "10.5.0.176"
        , active: true
        , "started-at": 1436996608.415227
        }
      , { username: "root"
        , resource: null
        , id: 151
        , "updated-at": 1436996713.349469
        , "created-at": 1436996713.349469
        , port: 65254
        , address: "10.5.0.176"
        , active: true
        , "started-at": 1436996713.344565
        }
      , { username: "root"
        , resource: null
        , id: 255
        , "updated-at": 1437503542.039171
        , "created-at": 1437503542.039171
        , port: 53706
        , address: "10.8.0.66"
        , active: true
        , "started-at": 1437503542.034417
        }
      , { username: "root"
        , resource: null
        , id: 256
        , "updated-at": 1437505578.261875
        , "created-at": 1437505578.261875
        , port: 54325
        , address: "10.8.0.66"
        , active: true
        , "started-at": 1437505578.256862
        }
      ]
    , sudo: false
    , "created-at": 1436221971.100949
    , group: 0
    , "updated-at": 1436221971.100949
    , "full_name": "root"
    , "logged-in": true
    , id: 0
    , home: "/root"
    , groups: []
    , email: null
    , "password_disabled": false
    }
  ];

// These are the system groups that will always be present.
var builtinGroups =
  [ { name: "nobody"
    , "updated-at": 1436221971.127193
    , "created-at": 1436221971.127193
    , builtin: true
    , id: 65534
    }
  , { name: "proxy"
    , "updated-at": 1436221971.130031
    , "created-at": 1436221971.130031
    , builtin: true
    , id: 62
    }
  , { name: "authpf"
    , "updated-at": 1436221971.132289
    , "created-at": 1436221971.132289
    , builtin: true
    , id: 63
    }
  , { name: "_pflogd"
    , "updated-at": 1436221971.133955
    , "created-at": 1436221971.133955
    , builtin: true
    , id: 64
    }
  , { name: "_dhcp"
    , "updated-at": 1436221971.135485
    , "created-at": 1436221971.135485
    , builtin: true
    , id: 65
    }
  , { name: "uucp"
    , "updated-at": 1436221971.137012
    , "created-at": 1436221971.137012
    , builtin: true
    , id: 66
    }
  , { name: "dialer"
    , "updated-at": 1436221971.138535
    , "created-at": 1436221971.138535
    , builtin: true
    , id: 68
    }
  , { name: "network"
    , "updated-at": 1436221971.140059
    , "created-at": 1436221971.140059
    , builtin: true
    , id: 69
    }
  , { name: "www"
    , "updated-at": 1436221971.141577
    , "created-at": 1436221971.141577
    , builtin: true
    , id: 80
    }
  , { name: "nogroup"
    , "updated-at": 1436221971.143099
    , "created-at": 1436221971.143099
    , builtin: true
    , id: 65533
    }
  , { name: "smmsp"
    , "updated-at": 1436221971.144618
    , "created-at": 1436221971.144618
    , builtin: true
    , id: 25
    }
  , { name: "mailnull"
    , "updated-at": 1436221971.146152
    , "created-at": 1436221971.146152
    , builtin: true
    , id: 26
    }
  , { name: "staff"
    , "updated-at": 1436221971.147677
    , "created-at": 1436221971.147677
    , builtin: true
    , id: 20
    }
  , { name: "sshd"
    , "updated-at": 1436221971.149182
    , "created-at": 1436221971.149182
    , builtin: true
    , id: 22
    }
  , { name: "daemon"
    , "updated-at": 1436221971.150699
    , "created-at": 1436221971.150699
    , builtin: true
    , id: 1
    }
  , { name: "wheel"
    , "updated-at": 1436221971.152219
    , "created-at": 1436221971.152219
    , builtin: true
    , id: 0
    }
  , { name: "sys"
    , "updated-at": 1436221971.153739
    , "created-at": 1436221971.153739
    , builtin: true
    , id: 3
    }
  , { name: "kmem"
    , "updated-at": 1436221971.155251
    , "created-at": 1436221971.155251
    , builtin: true
    , id: 2
    }
  , { name: "operator"
    , "updated-at": 1436221971.156771
    , "created-at": 1436221971.156771
    , builtin: true
    , id: 5
    }
  , { name: "tty"
    , "updated-at": 1436221971.158279
    , "created-at": 1436221971.158279
    , builtin: true
    , id: 4
    }
  , { name: "bin"
    , "updated-at": 1436221971.159801
    , "created-at": 1436221971.159801
    , builtin: true
    , id: 7
    }
  , { name: "mail"
    , "updated-at": 1436221971.161314
    , "created-at": 1436221971.161314
    , builtin: true
    , id: 6
    }
  , { name: "man"
    , "updated-at": 1436221971.162826
    , "created-at": 1436221971.162826
    , builtin: true
    , id: 9
    }
  , { name: "news"
    , "updated-at": 1436221971.164335
    , "created-at": 1436221971.164335
    , builtin: true
    , id: 8
    }
  , { name: "nullmail"
    , "updated-at": 1436221971.165852
    , "created-at": 1436221971.165852
    , builtin: true
    , id: 522
    }
  , { name: "audit"
    , "updated-at": 1436221971.167371
    , "created-at": 1436221971.167371
    , builtin: true
    , id: 77
    }
  , { name: "games"
    , "updated-at": 1436221971.168886
    , "created-at": 1436221971.168886
    , builtin: true
    , id: 13
    }
  , { name: "ftp"
    , "updated-at": 1436221971.170397
    , "created-at": 1436221971.170397
    , builtin: true
    , id: 14
    }
  , { name: "guest"
    , "updated-at": 1436221971.171909
    , "created-at": 1436221971.171909
    , builtin: true
    , id: 31
    }
  , { name: "bind"
    , "updated-at": 1436221971.173433
    , "created-at": 1436221971.173433
    , builtin: true
    , id: 53
    }
  , { name: "pls"
    , "updated-at": 1436984845.070875
    , "created-at": 1436984845.070875
    , builtin: false
    , id: 1000
    }
  ];

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

// Starting defaults for volume creation.
var volumeCount = 1;
var volumeDiskCount = 6;

function createSystem ( diskCount, diskTypes ) {
  var newSystem =
    { users: builtinUsers
    , groups: builtinGroups
    , pools: startingPools
    };

  newSystem = _.merge( newSystem, systemConstants, shares );

  var disks = createDisks( diskCount, diskTypes );

  newSystem [ "disks" ] = disks;

  newSystem[ "volumes" ] = createVolumes( volumeCount, volumeDiskCount, disks );

  return newSystem;
}

module.exports = createSystem;
