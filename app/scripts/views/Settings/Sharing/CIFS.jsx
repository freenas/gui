// CIFS Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const PROTOCOLS = [ "CORE"
                  , "COREPLUS"
                  , "LANMAN1"
                  , "LANMAN2"
                  , "NT1"
                  , "SMB2"
                  , "SMB2_02"
                  , "SMB2_10"
                  , "SMB2_22"
                  , "SMB2_24"
                  , "SMB3"
                  , "SMB3_00"
                  ];

const LOG_LEVELS = [ "NONE"
                   , "MINIMUM"
                   , "NORMAL"
                   , "FULL"
                   , "DEBUG"
                   ];

export default class CIFS extends React.Component {
  constructor ( props ) {
    super( props );
  }

  render () {
    return (
      <Panel>
        <h4>CIFS</h4>
      </Panel>
    );
  }
};

CIFS.propTypes = { dos_charset: React.PropTypes.string
                 , filemask: React.PropTypes.string
                 , unix_charset: React.PropTypes.string
                 , domain_logons: React.PropTypes.bool
                 , max_protocol: React.PropTypes.oneOf( PROTOCOLS )
                 , netbiosname: React.PropTypes.arrayOf( React.PropTypes.string )
                 , empty_password: React.PropTypes.bool
                 , dirmask: React.PropTypes.string
                 , description: React.PropTypes.string
                 , log_level: React.PropTypes.oneOf( LOG_LEVELS )
                 , min_protocol: React.PropTypes.oneOf( PROTOCOLS )
                 , obey_pam_restrictions: React.PropTypes.bool
                 , workgroup: React.PropTypes.string
                 , sid: React.PropTypes.string
                 , time_server: React.PropTypes.bool
                 , guest_user: React.PropTypes.string
                 , local_master: React.PropTypes.bool
                 , hostlookup: React.PropTypes.bool
                 , syslog: React.PropTypes.bool
                 , zeroconf: React.PropTypes.bool
                 , execute_always: React.PropTypes.bool
                 , unixext: React.PropTypes.bool
                 , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                 };
