// FreeNAS Constants
// -----------------
// Objects containing constant mirrored key-value pairs for use with Flux stores
// and dispatcher. Simple way to maintain consistency for actions and sources.

import keyMirror from "keymirror";

const FREENAS_CONSTANTS =
  { ActionTypes: keyMirror(
    // Authentication, Socket State and other SID stuff
    { UPDATE_AUTH_STATE: null
    , UPDATE_SOCKET_STATE: null
    , UPDATE_RECONNECT_TIME : null
    , FORCE_LOGOUT : null

    // Subscriptions
    , SUBSCRIBE_COMPONENT_TO_MASKS: null
    , UNSUBSCRIBE_COMPONENT_FROM_MASKS: null
    , UNSUBSCRIBE_ALL: null

    // Events
    , MIDDLEWARE_EVENT: null
    , RECEIVE_EVENTS: null

    // Tasks
    , RECEIVE_TASK_HISTORY: null
    , RECEIVE_SUBTASKS: null

    // RPC
    , RECEIVE_RPC_SERVICES: null
    , RECEIVE_RPC_SERVICE_METHODS: null

    // Users
    , RECEIVE_RAW_USERS: null
    , RECEIVE_USER_UPDATE_TASK: null

    // Groups
    , RECEIVE_GROUPS_LIST: null
    , RECEIVE_GROUP_UPDATE_TASK: null

    // Services
    , RECEIVE_MIDDLEWARE_SCHEMAS: null
    , RECEIVE_RAW_SERVICES: null
    , RECEIVE_SERVICE_UPDATE_TASK: null

    // Widget Data
    , RECEIVE_RAW_WIDGET_DATA: null

    // System Data
    , RECEIVE_SYSTEM_INFO_DATA: null
    , RECEIVE_SYSTEM_DEVICE_DATA: null
    , RECEIVE_SYSTEM_GENERAL_CONFIG_DATA: null
    , RECEIVE_SYSTEM_GENERAL_CONFIG_UPDATE: null
    , RECEIVE_SYSTEM_UI_CONFIG_DATA: null
    , RECEIVE_SYSTEM_UI_CONFIG_UPDATE: null
    , RECEIVE_SYSTEM_ADVANCED_CONFIG_DATA: null
    , RECEIVE_SYSTEM_ADVANCED_CONFIG_UPDATE: null
    , RECEIVE_TIMEZONES: null
    , RECEIVE_KEYMAPS: null
    , RECEIVE_VERSION: null

    // Update Data
    , RECEIVE_UPDATE_CONFIG: null
    , RECEIVE_CURRENT_TRAIN: null
    , RECEIVE_UPDATE_INFO: null
    , RECEIVE_UPDATE_AVAILABLE: null
    , RECEIVE_UPDATE_TRAINS: null
    , RECEIVE_CONFIGURE_UPDATE_TASK: null
    , RECEIVE_UPDATE_NOW_TASK: null
    , RECEIVE_UPDATE_CHECK_TASK: null
    , RECEIVE_DOWNLOAD_UPDATE_TASK: null
    , RECEIVE_MANUAL_UPDATE_TASK: null
    , RECEIVE_VERIFY_INSTALL_TASK: null

    // Global Network Configuration
    , RECEIVE_NETWORK_CONFIG: null
    , RECEIVE_NETWORK_CONFIG_UPDATE: null

    // Interfaces
    , RECEIVE_INTERFACES_LIST: null
    , RECEIVE_INTERFACE_CONFIGURE_TASK: null
    , RECEIVE_UP_INTERFACE_TASK: null
    , RECEIVE_DOWN_INTERFACE_TASK: null

    // ZFS
    , RECEIVE_VOLUMES: null
    , RECEIVE_AVAILABLE_DISKS: null
    , RECEIVE_VOLUME_CREATE_TASK: null
    , RECEIVE_VOLUME_UPDATE_TASK: null
    , RECEIVE_VOLUME_DESTROY_TASK: null

    // SHARES
    , RECEIVE_SHARES: null
    , RECEIVE_SHARE_CREATE_TASK: null
    , RECEIVE_SHARE_UPDATE_TASK: null
    , RECEIVE_SHARE_DELETE_TASK: null

    // Volumes
    , DISKS_SELECTION_REPLACE: null
    , DISKS_SELECTED: null
    , DISKS_DESELECTED: null

    // Disks
    , RECEIVE_DISKS_OVERVIEW: null
    , RECEIVE_DISK_DETAILS: null

    // Calendar
    , RECEIVE_CALENDAR: null
    , RECEIVE_CALENDAR_UPDATE_TASK: null

    // STATD
    , RECEIVE_STATD_DATA: null
    })

  , PayloadSources: keyMirror(
    { MIDDLEWARE_ACTION: null
    , MIDDLEWARE_LIFECYCLE: null
    , CLIENT_ACTION: null
    })
  };

export default FREENAS_CONSTANTS;
