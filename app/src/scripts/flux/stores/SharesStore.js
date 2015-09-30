// SHARES STORE
// ============

"use strict";


import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

class SharesStore extends FluxBase {
  constructor () {
    super();

    this.shares = null;

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }
}

function handlePayload ( payload ) {
  const ACTION = payload.action;

  switch ( ACTION.type ) {
    case ActionTypes.RECEIVE_SHARES:
      if ( this.isInitialized ) {
        this.shares.clear();
      } else {
        this.shares = new Map();
      }

      ACTION.shares.forEach( ( share ) => {
        this.shares.set( share.target, share );
      });
      this.fullUpdateAt = ACTION.timestamp;
      this.emitChange();
      break;
  }
}

export default new SharesStore();
