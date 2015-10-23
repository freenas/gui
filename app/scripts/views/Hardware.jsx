// Hardware Information
// ====================
// Displays information about system hardware

"use strict";

import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Panel, Well, ListGroup, ListGroupItem } from "react-bootstrap";

import * as actions from "../actions/disks";
import * as SUBSCRIPTIONS from "../actions/subscriptions";

import ByteCalc from "../utility/ByteCalc";
import DiskUtilities from "../utility/DiskUtilities";

import DiskSection from "./Hardware/DiskSection";

// STYLESHEET
if ( process.env.BROWSER ) require( "./Hardware.less" );


// REACT
class Hardware extends React.Component {

  constructor ( props ) {
    super( props );

    this.displayName = "Hardware"
  }

  componentDidMount () {
    // this.props.fetchDisks();
    this.props.subscribe( this.displayName );
  }

  componentWillUnmount () {
    this.props.unsubscribe( this.displayName );
  }

  render () {
    // let cpuModel = this.state.systemInformation
    //              ? this.state.systemInformation[ "cpu_model" ]
    //              : null;

    // let cpuCores = this.state.systemInformation
    //              ? this.state.systemInformation[ "cpu_cores" ]
    //              : null;

    // let memorySize = this.state.systemInformation
    //                ? this.state.systemInformation[ "memory_size" ]
    //                : null;
    const { disks, diskGroups } = this.props;

    return (
      <main className = { "hardware-wrapper" }>
        <div className ={ "statics" }>
          <Panel header = "System Information" /*TODO: split panel out into its own component when appropriate*/ >
            <ListGroup fill>
              <ListGroupItem>
                { "CPU: " + 0 }
              </ListGroupItem>
              <ListGroupItem>
                { "CPU Cores: " + 0 }
              </ListGroupItem>
              <ListGroupItem>
                { "Memory: " + ByteCalc.humanize( 0 ) }
              </ListGroupItem>
            </ListGroup>
          </Panel>
        </div>
        <div className = { "disclosures" } >
          <DiskSection disks={ disks } diskGroups={ diskGroups } />
        </div>
      </main>
    );
  }

}


// REDUX
function mapStateToProps ( state ) {
  const { disks } = state;

  return (
    { disks: disks.disks
    , diskGroups: DiskUtilities.similarDisks( disks.disks )
    }
  );
}

function mapDispatchToProps ( dispatch ) {
  return (
    { subscribe: ( id ) =>
        dispatch( SUBSCRIPTIONS.add( [ "entity-subscriber.disks.changed" ], id ) )
    , unsubscribe: ( id ) =>
        dispatch( SUBSCRIPTIONS.remove( [ "entity-subscriber.disks.changed" ], id ) )
    , fetchDisks: () => dispatch( actions.requestDiskOverview() )
    }
  );
}

export default connect( mapStateToProps, mapDispatchToProps )( Hardware );
