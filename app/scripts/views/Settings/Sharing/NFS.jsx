// NFS Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

export default class NFS extends React.Component {
  constructor ( props ) {
    super( props );
  }

  render () {

    const toggleService = (
      <div>
        <h5>Enable NFS</h5>
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const toggleNFSv4 = (
      <div>
        <h5>Enable NFSv4</h5>
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const numServers = (
      <Input
        type = "text"
        label = "Number of servers"
        value = { this.props.servers }
      />
    );

    const useUDP = (
      <Input
        type = "checkbox"
        label = "Serve UDP NFS Clients"
        checked = { this.props.udp }
      />
    );

    const nfsV4Kerberos = (
      <Input
        type = "checkbox"
        label = "Require Kerberos for NFSv4"
        checked = { this.props.v4_kerberos }
      />
    );

    const nonRootMount= (
      <Input
        type = "checkbox"
        label = "Allow non-root mount"
        checked = { this.props.nonroot }
      />
    );

    const mountdPort = (
      <Input
        type = "text"
        label = "mountd(8) bind port"
        value = { this.props.mountd_port }
      />
    );

    const rpclockdPort = (
      <Input
        type = "text"
        label = "rpc.lockd(8) bind port"
        value = { this.props.rpclockd_port }
      />
    );

    const rpcstatdPort= (
      <Input
        type = "text"
        label = "rpc.statd(8) bind port"
        value = { this.props.rpcstatd_port }
      />
    );

    const bindAddresses = (
      <Input
        type = "select"
        label = "Bind IP Addresses"
        value = { this.props.bind_addresses }
      >
        { /*Available IP Addresses*/ }
      </Input>
    );

    const formControlButtons = (
      <ButtonToolbar className = "pull-right">
        <Button
          bsStyle = "default"
        >
          { "Reset" }
        </Button>
        <Button
          bsStyle = "primary"
        >
          { "Apply" }
        </Button>
      </ButtonToolbar>
    );
    return (
      <Panel>
        <h4>NFS</h4>
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
  }
};

NFS.propTypes = { udp: React.PropTypes.bool
                , v4: React.PropTypes.bool
                , v4_kerberos: React.PropTypes.bool
                , mountd_port: React.PropTypes.number
                , bind_addresses: React.PropTypes.arrayOf( React.PropTypes.string)
                , rpclockd_port: React.PropTypes.number
                , rpcstatd_port: React.PropTypes.number
                , nonroot: React.PropTypes.bool
                , servers: React.PropTypes.number
                };
