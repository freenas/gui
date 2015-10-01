// Stats Data Middleware
// =====================

"use strict";

import MC from "../../websocket/MiddlewareClient";
import AbstractBase from "./MIDDLEWARE_BASE_CLASS";

import SAC from "../actions/StatdActionCreators";

function createPulseSyntax ( dataSource ) {
  return dataSource + ".pulse";
};

class StatdMiddleware extends AbstractBase {

  static subscribeToPulse ( componentID, dataSources ) {
    MC.subscribe( dataSources.map( createPulseSyntax ), componentID );
  }

  static unsubscribeFromPulse ( componentID, dataSources ) {
    MC.unsubscribe( dataSources.map( createPulseSyntax ), componentID );
  }

  static requestWidgetData ( sourceName, startTime, endTime, freq ) {
    MC.request( "statd.output.query"
              , [ sourceName
                , { start: startTime
                  , end: endTime
                  , frequency: freq
                  }
                ]
              , SAC.receiveStatdData.bind( SAC, sourceName )
              );
  }
};

export default StatdMiddleware;
