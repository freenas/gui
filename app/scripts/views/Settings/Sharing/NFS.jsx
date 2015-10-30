// NFS Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const NFS = ( props ) => {

  const serversValue = typeof props.nfsForm.servers !== "undefined"
                     ? props.nfsForm.servers
                     : props.nfsServerState.servers;
  const udpValue = typeof props.nfsForm.udp !== "undefined"
                 ? props.nfsForm.udp
                 : props.nfsServerState.udp;
  const v4_kerberosValue = typeof props.nfsForm.v4_kerberos !== "undefined"
                         ? props.nfsForm.v4_kerberos
                         : props.nfsServerState.v4_kerberos;
  const nonrootValue = typeof props.nfsForm.nonroot !== "undefined"
                     ? props.nfsForm.nonroot
                     : props.nfsServerState.nonroot;
  const mountd_portValue = typeof props.nfsForm.mountd_port !== "undefined"
                         ? props.nfsForm.mountd_port
                         : props.nfsServerState.mountd_port;
  const rpclockd_portValue = typeof props.nfsForm.rpclockd_port !== "undefined"
                           ? props.nfsForm.rpclockd_port
                           : props.nfsServerState.rpclockd_port;
  const rpcstatd_portValue = typeof props.nfsForm.rpcstatd_port !== "undefined"
                           ? props.nfsForm.rpcstatd_port
                           : props.nfsServerState.rpcstatd_port;
  const bind_addressesValue = typeof props.nfsForm.bind_addresses !== "undefined"
                            ? props.nfsForm.bind_addresses
                            : props.nfsServerState.bind_addresses;

  const toggleService = (
    <div>
      <h5>{ "Enable NFS" }</h5>
      <ToggleSwitch
        toggled = { props.nfsServerState.enable }
        onChange = { props.toggleNFSTaskRequest }
      />
    </div>
  );

  const toggleNFSv4 = (
    <div>
      <h5>{ "Enable NFSv4" }</h5>
      <ToggleSwitch
        toggled = { props.nfsServerState.v4 }
        onChange = { props.toggleNFSv4TaskRequest }
      />
    </div>
  );

  const numServers = (
    <Input
      type = "text"
      label = "Number of servers"
      value = { serversValue }
      onChange = { ( e ) => props.updateNFSForm( "servers"
                                               , e.target.value
                                               )
                 }
    />
  );

  const useUDP = (
    <Input
      type = "checkbox"
      label = "Serve UDP NFS Clients"
      checked = { udpValue }
      onChange = { ( e ) => props.updateNFSForm( "udp"
                                               , e.target.checked
                                               )

                 }
    />
  );

  const nfsV4Kerberos = (
    <Input
      type = "checkbox"
      label = "Require Kerberos for NFSv4"
      checked = { v4_kerberosValue }
      onChange = { ( e ) => props.updateNFSForm( "v4_kerberos"
                                               , e.target.checked
                                               )

                 }
    />
  );

  const nonRootMount= (
    <Input
      type = "checkbox"
      label = "Allow non-root mount"
      checked = { nonrootValue }
      onChange = { ( e ) => props.updateNFSForm( "nonroot"
                                               , e.target.checked
                                               )

                 }
    />
  );

  const mountdPort = (
    <Input
      type = "text"
      label = "mountd(8) bind port"
      value = { mountd_portValue }
      onChange = { ( e ) => props.updateNFSForm( "mountd_port"
                                               , e.target.value
                                               )
                 }
    />
  );

  const rpclockdPort = (
    <Input
      type = "text"
      label = "rpc.lockd(8) bind port"
      value = { rpclockd_portValue }
      onChange = { ( e ) => props.updateNFSForm( "rpclockd_port"
                                               , e.target.value
                                               )
                 }
    />
  );

  const rpcstatdPort= (
    <Input
      type = "text"
      label = "rpc.statd(8) bind port"
      value = { rpcstatd_portValue }
      onChange = { ( e ) => props.updateNFSForm( "rpcstatd_port"
                                               , e.target.value
                                               )
                 }
    />
  );

  const bindAddresses = (
    <Input
      type = "select"
      label = "Bind IP Addresses"
      value = { bind_addressesValue }
      onChange = { ( e ) => props.updateNFSForm( "bind_addresses"
                                               , e.target.value
                                               )
                 }
      multiple
      disabled
    >
      { /*Available IP Addresses*/ }
    </Input>
  );

  const formControlButtons = (
    <ButtonToolbar className = "pull-right">
      <Button
        bsStyle = "default"
        onClick = { props.resetNFSForm }
        disabled = { Object.keys( props.nfsForm ).length === 0 }
      >
        { "Reset" }
      </Button>
      <Button
        bsStyle = "primary"
        onClick = { props.configureNFSTaskRequest }
        disabled = { Object.keys( props.nfsForm ).length === 0 }
      >
        { "Apply" }
      </Button>
    </ButtonToolbar>
  );
  return (
    <Panel>
      <h4>{ "NFS" }</h4>
      { toggleService }
      <form className = "settings-config-form">
        { toggleNFSv4 /* Basic Field*/ }
        { numServers }
        { useUDP }
        { nfsV4Kerberos }
        { nonRootMount }
        { mountdPort }
        { rpclockdPort }
        { rpcstatdPort }
        { bindAddresses }
        { formControlButtons }
      </form>
    </Panel>
  );
};

NFS.propTypes = { nfsServerState: React.PropTypes.shape(
                  { enable: React.PropTypes.bool
                  , udp: React.PropTypes.bool
                  , v4: React.PropTypes.bool
                  , v4_kerberos: React.PropTypes.bool
                  , mountd_port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                          , React.PropTypes.string
                                                          ]
                                                        )
                  , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string )
                  , rpclockd_port:React.PropTypes.oneOfType( [ React.PropTypes.number
                                                           , React.PropTypes.string
                                                           ]
                                                         )
                  , rpcstatd_port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                              , React.PropTypes.string
                                                              ]
                                                            )
                  , nonroot: React.PropTypes.bool
                  , servers: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                        , React.PropTypes.string
                                                        ]
                                                      )
                  }
                )
                , nfsForm: React.PropTypes.shape(
                  { udp: React.PropTypes.bool
                  , v4_kerberos: React.PropTypes.bool
                  , mountd_port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                            , React.PropTypes.string
                                                            ]
                                                          )
                  , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string)
                  , rpclockd_port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                              , React.PropTypes.string
                                                              ]
                                                            )
                  , rpcstatd_port: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                              , React.PropTypes.string
                                                              ]
                                                            )
                  , nonroot: React.PropTypes.bool
                  , servers: React.PropTypes.oneOfType( [ React.PropTypes.number
                                                        , React.PropTypes.string
                                                        ]
                                                      )
                  }
                )
                , updateNFSForm: React.PropTypes.func.isRequired
                , resetNFSForm: React.PropTypes.func.isRequired
                , configureNFSTaskRequest: React.PropTypes.func.isRequired
                , toggleNFSTaskRequest: React.PropTypes.func.isRequired
                , toggleNFSv4TaskRequest: React.PropTypes.func.isRequired
                };

export default NFS;
