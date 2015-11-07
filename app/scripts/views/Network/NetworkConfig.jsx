// Network Config
// ==============
// Presents and allows editing of global network settings


"use strict";

import React from "react";
import { Col, Input, Button, ButtonToolbar, Grid, Row } from "react-bootstrap";
import _ from "lodash";

import Icon from "../../components/Icon";

const FORM_CLASSES =
  { labelClassName: "col-xs-4"
  , wrapperClassName: "col-xs-8"
  };

const NetworkConfig = ( props ) => {
  return (
    <Grid fluid className="network-overview">
      <Row className="well">
        <Col lg={ 6 } md={ 12 }>
          <form className="form-horizontal">
            <Input { ...FORM_CLASSES }
              type = "text"
              label = "Hostname"
              value = { props.hostname }
              onChange = { event =>
                props.onUpdateHostname( event.target.value )
              }
            />
            <Input { ...FORM_CLASSES }
              type = "text"
              label = "IPv4 Default Gateway"
              value = { props.gateway.ipv4 }
              onChange = { event =>
                props.onUpdate( "gateway.ipv4", event.target.value )
              }
            />
            <Input { ...FORM_CLASSES }
              type = "text"
              label = "IPv6 Default Gateway"
              value = { props.gateway.ipv6 }
              onChange = { event =>
                props.onUpdate( "gateway.ipv6", event.target.value )
              }
            />
          </form>
        </Col>

        <Col lg={ 6 } md={ 12 }>
          <h5>DNS Addresses</h5>
          <Col xs={ 12 } className="dns-section">
            <p>Coming soon</p>
          </Col>
        </Col>

        <Col xs={3}>
          <Input
            type = "checkbox"
            label = "DHCP Assign DNS"
            checked = { props.dhcp.assign_dns }
            onChange = { event =>
              props.onUpdate( "dhcp.assign_dns", !props.dhcp.assign_dns )
            }
          />
        </Col>
        <Col xs={3}>
          <Input
            type = "checkbox"
            label = "DHCP Assign Gateway"
            checked = { props.dhcp.assign_gateway }
            onChange = { event =>
              props.onUpdate( "dhcp.assign_gateway", !props.dhcp.assign_gateway )
            }
          />
        </Col>
        <Col xs={ 12 }>
          <ButtonToolbar className="pull-right">
            <Button
              bsStyle = "default"
              onClick = { props.onRevert }
              disabled = { props.revertDisabled }
            >
              { "Reset" }
            </Button>
            <Button
              bsStyle = "primary"
              onClick = { props.onSubmit }
              disabled = { props.submitDisabled }
            >
              { "Apply" }
            </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    </Grid>
  );
}

NetworkConfig.propTypes =
  { netwait: React.PropTypes.shape(
      { enabled: React.PropTypes.bool
      , addresses: React.PropTypes.array
      }
    )
  , dns: React.PropTypes.shape(
      { search: React.PropTypes.array
      , addresses: React.PropTypes.array
      }
    )
  , dhcp: React.PropTypes.shape(
      { assign_gateway: React.PropTypes.bool
      , assign_dns: React.PropTypes.bool
      }
    )
  , gateway: React.PropTypes.shape(
      { ipv4: React.PropTypes.string
      , ipv6: React.PropTypes.string
      }
    )
  , hostname: React.PropTypes.string

  , onSubmit: React.PropTypes.func.isRequired
  , onRevert: React.PropTypes.func.isRequired
  , onUpdate: React.PropTypes.func.isRequired
  , submitDisabled: React.PropTypes.bool.isRequired
  , revertDisabled: React.PropTypes.bool.isRequired
  };

export default NetworkConfig;
