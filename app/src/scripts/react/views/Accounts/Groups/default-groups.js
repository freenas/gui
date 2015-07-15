"use strict";

const dummyGroups = [
  {
    "name": "nobody",
    "updated-at": 1436221971.127193,
    "created-at": 1436221971.127193,
    "builtin": true,
    "id": 65534
  },
  {
    "name": "proxy",
    "updated-at": 1436221971.130031,
    "created-at": 1436221971.130031,
    "builtin": true,
    "id": 62
  },
  {
    "name": "authpf",
    "updated-at": 1436221971.132289,
    "created-at": 1436221971.132289,
    "builtin": true,
    "id": 63
  },
  {
    "name": "_pflogd",
    "updated-at": 1436221971.133955,
    "created-at": 1436221971.133955,
    "builtin": true,
    "id": 64
  },
  {
    "name": "_dhcp",
    "updated-at": 1436221971.135485,
    "created-at": 1436221971.135485,
    "builtin": true,
    "id": 65
  },
  {
    "name": "uucp",
    "updated-at": 1436221971.137012,
    "created-at": 1436221971.137012,
    "builtin": true,
    "id": 66
  },
  {
    "name": "dialer",
    "updated-at": 1436221971.138535,
    "created-at": 1436221971.138535,
    "builtin": true,
    "id": 68
  },
  {
    "name": "network",
    "updated-at": 1436221971.140059,
    "created-at": 1436221971.140059,
    "builtin": true,
    "id": 69
  },
  {
    "name": "www",
    "updated-at": 1436221971.141577,
    "created-at": 1436221971.141577,
    "builtin": true,
    "id": 80
  },
  {
    "name": "nogroup",
    "updated-at": 1436221971.143099,
    "created-at": 1436221971.143099,
    "builtin": true,
    "id": 65533
  },
  {
    "name": "smmsp",
    "updated-at": 1436221971.144618,
    "created-at": 1436221971.144618,
    "builtin": true,
    "id": 25
  },
  {
    "name": "mailnull",
    "updated-at": 1436221971.146152,
    "created-at": 1436221971.146152,
    "builtin": true,
    "id": 26
  },
  {
    "name": "staff",
    "updated-at": 1436221971.147677,
    "created-at": 1436221971.147677,
    "builtin": true,
    "id": 20
  },
  {
    "name": "sshd",
    "updated-at": 1436221971.149182,
    "created-at": 1436221971.149182,
    "builtin": true,
    "id": 22
  },
  {
    "name": "daemon",
    "updated-at": 1436221971.150699,
    "created-at": 1436221971.150699,
    "builtin": true,
    "id": 1
  },
  {
    "name": "wheel",
    "updated-at": 1436221971.152219,
    "created-at": 1436221971.152219,
    "builtin": true,
    "id": 0
  },
  {
    "name": "sys",
    "updated-at": 1436221971.153739,
    "created-at": 1436221971.153739,
    "builtin": true,
    "id": 3
  },
  {
    "name": "kmem",
    "updated-at": 1436221971.155251,
    "created-at": 1436221971.155251,
    "builtin": true,
    "id": 2
  },
  {
    "name": "operator",
    "updated-at": 1436221971.156771,
    "created-at": 1436221971.156771,
    "builtin": true,
    "id": 5
  },
  {
    "name": "tty",
    "updated-at": 1436221971.158279,
    "created-at": 1436221971.158279,
    "builtin": true,
    "id": 4
  },
  {
    "name": "bin",
    "updated-at": 1436221971.159801,
    "created-at": 1436221971.159801,
    "builtin": true,
    "id": 7
  },
  {
    "name": "mail",
    "updated-at": 1436221971.161314,
    "created-at": 1436221971.161314,
    "builtin": true,
    "id": 6
  },
  {
    "name": "man",
    "updated-at": 1436221971.162826,
    "created-at": 1436221971.162826,
    "builtin": true,
    "id": 9
  },
  {
    "name": "news",
    "updated-at": 1436221971.164335,
    "created-at": 1436221971.164335,
    "builtin": true,
    "id": 8
  },
  {
    "name": "nullmail",
    "updated-at": 1436221971.165852,
    "created-at": 1436221971.165852,
    "builtin": true,
    "id": 522
  },
  {
    "name": "audit",
    "updated-at": 1436221971.167371,
    "created-at": 1436221971.167371,
    "builtin": true,
    "id": 77
  },
  {
    "name": "games",
    "updated-at": 1436221971.168886,
    "created-at": 1436221971.168886,
    "builtin": true,
    "id": 13
  },
  {
    "name": "ftp",
    "updated-at": 1436221971.170397,
    "created-at": 1436221971.170397,
    "builtin": true,
    "id": 14
  },
  {
    "name": "guest",
    "updated-at": 1436221971.171909,
    "created-at": 1436221971.171909,
    "builtin": true,
    "id": 31
  },
  {
    "name": "bind",
    "updated-at": 1436221971.173433,
    "created-at": 1436221971.173433,
    "builtin": true,
    "id": 53
  }
];

export default dummyGroups;