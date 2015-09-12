// Interface Item
// ==============
// Renders a representation of a single network interface.

"use strict";

import React from "react";
import _ from "lodash";
import { Input, Panel, FormControls } from "react-bootstrap";

import networkCommon from "./networkCommon";

import ToggleSwitch from "../../components/ToggleSwitch";
import DiscTri from "../../components/DiscTri";

import IM from "../../../flux/middleware/InterfacesMiddleware";

// FIXME: Change this component so that each prop is submitted separately,
// with proper propTypes and default props.
const InterfaceItem = React.createClass(
  { propTypes: { status: React.PropTypes.object
               , dhcp: React.PropTypes.bool
               , id: React.PropTypes.string
               , name: React.PropTypes.string
               , enabled: React.PropTypes.bool
               }

  , mixins: [ networkCommon ]

  , getInitialState () {
      return { staticIPInProgress: null
             };
    }

  , getDefaultProps () {
      return { enabled: false
             };
    }

  , showAliases ( aliases ) {
    var aliasList = [];

    aliasList = _.map( aliases
                     , function createAliasSections ( alias, index ) {
                       let broadcast = null;
                       let netmask = null;
                       let addressLabel = "";
                       let address = null;

                       switch( alias.family ) {
                         case "INET":
                           addressLabel = "IPv4: "
                           break;

                         case "INET6":
                           addressLabel = "IPv6: "
                           break;
                       }

                       address = <div>
                                   <span className = "alias-attribute-label">
                                     { addressLabel }
                                   </span>
                                   <span className = "alias-attribute">
                                     { alias.address }
                                   </span>
                                 </div>;

                       if ( alias.netmask ) {
                         netmask = <div>
                                     <span className = "alias-attribute-label">
                                       { "Netmask:" }
                                     </span>
                                     <span className = "alias-attribute">
                                       { " /" + alias.netmask }
                                     </span>
                                   </div>;
                       }

                       if ( alias.broadcast ) {
                         broadcast = <div>
                                       <span className = "alias-attribute-label">
                                         { "Broadcast: "}
                                        </span>
                                       <span className = "alias-attribute">
                                        { alias.broadcast }
                                       </span>
                                     </div>;
                       }

                       return (
                         <div key = { index }
                              className = "network-alias">
                          { address }
                          { netmask }
                          { broadcast }
                         </div>
                       )
                     } );

    return (
      { aliasList }
    );
  }

  , toggleInterface () {
    if ( this.props.enabled ) {
      IM.configureInterface( this.props.id, { enabled: false } );
    } else {
      IM.configureInterface( this.props.id, { enabled: true } );
    }
  }

  , validate ( key, value ) {
    var responseStyle = null;
    switch( key ) {
      case "staticIP":
        if ( !this.isIPv4WithNetmask( value )
          && !this.props.dhcp
          && this.props.enabled ) {
          responseStyle = "error";
        }
    }
    return responseStyle;
  }

  , handleChange ( key, evt ) {
    var newNetworkInterface = {};
    switch ( key ) {
      // TODO: have this handle broadcast and IPv6 properly as well
      case "staticIP":
        this.setState( { staticIPInProgress: evt.target.value } );
        break;
    }
    if ( !_.isEmpty( newNetworkInterface ) ) {
      this.setState( { newNetworkInterface } );
    }
  }

  , submitChange ( target, evt ) {
    var newNetworkInterface = {};

    if ( evt.key === "Enter" ) {
      switch ( target ) {
        case "staticIP":
          if ( this.state.staticIPInProgress
            && this.isIPv4WithNetmask( this.state.staticIPInProgress ) ) {
            let newAliases = [];
            let aliasParts = this.state.staticIPInProgress.split( "/" );

            if ( this.state.aliases ) {
              newAliases = this.state.aliases.slice();
            } else if ( this.props.aliases ) {
              newAliases = this.props.aliases.slice();
            }

            if ( _.find( newAliases, { family: "INET" } ) ) {
              let oldAliasIndex = _.findIndex( newAliases, { family: "INET" } );
              newAliases[ oldAliasIndex ].address = aliasParts[0];
              newAliases[ oldAliasIndex ].newNetmask = aliasParts[1];
              newNetworkInterface.aliases = newAliases;
            } else {
              newAliases =
                [ { family: "INET"
                  , address: aliasParts[0]
                  , netmask: aliasParts[1]
                  }
                ];
              newNetworkInterface.aliases = newAliases;
            }
          }
          break;
      }
    }
    if ( !_.isEmpty( newNetworkInterface ) ) {
      IM.configureInterface( this.props.id
                           , newNetworkInterface);
    }
  }

  , resetFocus ( key, evt ) {
    switch ( key ) {
      case "staticIP":
        if ( !this.isIPv4WithNetmask( evt.target.value )
          && !this.props.dhcp
          && this.props.enabled ) {
          evt.target.focus();
        }
        break;
    }
  }

  , toggleDHCP () {
    var newNetworkInterface = {};
    if ( this.props.dhcp ) {
      newNetworkInterface = { dhcp: false };
    } else {
      newNetworkInterface = { dhcp: true };
    }
    IM.configureInterface( this.props.id
                         , newNetworkInterface );
  }

  , render () {
    const labelClassName = "col-xs-5";
    const wrapperClassName = "col-xs-7";
    const formClasses = { labelClassName, wrapperClassName };

    let interfaceIsActive = false;

    var statusClass = "";
    var interfaceName = null;
    var interfaceType = "";
    var linkSpeed = null;
    // FIXME: No such thing. Figure out how to represent real behavior at some point.
    var staticIPValue = "";
    var macAddress = "";
    var aliases = [];

    if ( _.has( this.props, "status.link_state" ) ) {
      switch ( this.props.status.link_state ) {
        case "LINK_STATE_UP":
          interfaceIsActive = true;
          statusClass = "interface-up";
          linkSpeed =
            <h4>
              { "10/100/" }
              <strong className = "bg-primary" >{ "1000" }</strong >
            </h4>;
          break;
        case "LINK_STATE_UNKNOWN":
          statusClass = "interface-unknown";
          linkSpeed = <h4>{ "Unknown" }</h4>
          break;
        case "LINK_STATE_DOWN":
          statusClass = "interface-down";
          linkSpeed = <h4>{ "10/100/1000" }</h4>
          break;
      }
    }

    if ( _.has( this.props, "status.name" ) ) {
      // TODO: Figure out how to represent both name and id, and allow changing
      // only name.
      interfaceName = (
        <h2 className = { "interface-name " + statusClass } >
          { this.props.status.name }
          <span className="interface-type">{ "Ethernet" }</span>
        </h2>
      );
    }

    // TODO: Find some way to indicate a mismatch between configured aliases and
    // actual status.
    if ( _.has( this.props, "status.aliases" ) ) {
      aliases = this.props.status.aliases.slice();
    }
    // Aliases in state override those in props
    if ( _.has( this.state, "status.aliases" ) ) {
       aliases = this.state.status.aliases.slice();
    }

    if ( !_.isEmpty( aliases ) ) {
      let macAddressAlias = _.find( aliases
                                  , { family: "LINK" }
                                  );
      if ( macAddressAlias ) {
        macAddress = macAddressAlias.address;
      }
    }
    // TODO: Update this for VLANs and LAGGs
    _.remove( aliases, { family: "LINK" } );

    // FIXME: There is no way this will work once we're presenting aliases as
    // equals, without a "static IP". Don't let it survive past then.
    if ( this.state.staticIPInProgress ) {
      staticIPValue = this.state.staticIPInProgress;
    } else {
      if ( !_.isEmpty( aliases ) ) {
        let staticIPAlias = aliases.shift();
        staticIPValue = staticIPAlias.address + "/" + staticIPAlias.netmask;
      }
    }

    return (
      <Panel
        bsStyle = { interfaceIsActive
                  ? "success"
                  : "default"
                  }
        className = "interface-item"
        header = { interfaceName }
      >

        <Input
          type = "checkbox"
          checked = { Boolean( this.props.dhcp ) }
          onChange = { this.toggleDHCP }
          label = { "Enable DHCP" }
          disabled = { !interfaceIsActive }
        />
        { linkSpeed }
        <form className="form-horizontal">

          {/* ENABLE/DISABLE INTERFACE TOGGLE */}
          <div className="form-group">
            <label className={ "control-label " + labelClassName } >
              { "Enable Interface" }
            </label>
            <div className={ wrapperClassName }>
              <ToggleSwitch
                className = "pull-right"
                toggled = { this.props.enabled }
                onChange = { this.toggleInterface }
              />
            </div>
          </div>

          {/* STATIC IP ADDRESS INPUT */}
          <Input { ...formClasses }
            type = "text"
            label = "Static IP Address"
            value = { staticIPValue }
            bsStyle = { this.validate( "staticIP", staticIPValue ) }
            onBlur = { this.resetFocus.bind( this, "staticIP" ) }
            onChange = { this.handleChange.bind( this, "staticIP" ) }
            onKeyDown = { this.submitChange.bind( this, "staticIP" ) }
            disabled = { this.props.dhcp || !interfaceIsActive }
          />

          {/* MAC ADDRESS DISPLAY */}
          <FormControls.Static { ...formClasses }
            label = { "MAC Address" }
            value = { macAddress }
          />

        </form>
        <DiscTri
          headerShow = "Aliases"
          headerHide = "Aliases"
          defaultExpsnded = { true } >
          { this.showAliases( aliases ) }
        </DiscTri>
      </Panel>
    );
  }
});

export default InterfaceItem;
