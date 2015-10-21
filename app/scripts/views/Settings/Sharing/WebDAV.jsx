// WebDAV Configuration
// ==================

"use strict";

import React from "react";
import { Button, ButtonToolbar, Input, Panel } from "react-bootstrap";

import ToggleSwitch from "../../../components/ToggleSwitch";

const PROTOCOLS = [ "HTTP"
                  , "HTTPS"
                  ];

const AUTHENTICATION = [ "BASIC"
                       , "DIGEST"
                       ];

function createDropdownOptions ( optionArray ) {
  var options =
    optionArray.map( function mapOptions ( optionValue, index ) {
                       return (
                         <option
                           value = { optionValue }
                           key = { index }>
                           { optionValue }
                         </option>
                       );
                     }
                   );
  return options;
}

export default class WebDAV extends React.Component {
  constructor ( props ) {
    super( props );
  }

  render () {

    const toggleService = (
      <div className = "pull-right" >
        <ToggleSwitch
          toggled = { true }
        />
      </div>
    );

    const httpPort = (
      <Input
        type = "text"
        label = "http Port"
        value = { this.props.http_port }
      />
    );

    const protocol = (
      <Input
        type = "select"
        label = "Protocol"
        value = { this.props.protocol }
      >
        { createDropdownOptions( PROTOCOLS ) }
      </Input>
    );

    const httpsPort = (
      <Input
        type = "text"
        label = "https Port"
        value = { this.props.https_port }
      />
    );

    const certificate = (
      <Input
        type = "select"
        label = "TLS Certificate"
        value = { this.props.certificate }
      >
        { /* Available Certificates */ }
      </Input>
    );

    const authentication = (
      <Input
        type = "select"
        label = "http Authentication"
        value = { this.props.authentication }
      >
        { createDropdownOptions( AUTHENTICATION ) }
      </Input>
    );

    const password = (
      <Input
        type = "password"
        label = "WebDAV Password"
        value = { this.props.password }
      />
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
        <h4>WebDAV</h4>
        <form className = "settings-config-form">
          { httpPort }
          { protocol }
          { httpsPort }
          { certificate }
          { authentication }
          { password }
          { formControlButtons }
        </form>
      </Panel>
    );
  }
};

WebDAV.propTypes = { http_port: React.PropTypes.number
                   , protocol: React.PropTypes.oneOf( PROTOCOLS )
                   , https_port: React.PropTypes.number
                   , certificate: React.PropTypes.string
                   , authentication: React.PropTypes.oneOf( AUTHENTICATION )
                   , password: React.PropTypes.string
                   };
