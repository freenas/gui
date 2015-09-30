// SHARES STORE
// ============

"use strict";


import _ from "lodash";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var shares;

class SharesStore extends FluxBase {
  constructor () {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }
}

function handlePayload ( payload ) {
  const ACTION = payload.action;

  switch ( ACTION.type ) {
    case ActionTypes.RECEIVE_SHARES:
      shares = ACTION.shares;
      this.fullUpdateAt = ACTION.timestamp;
      this.emitChange();
      break;
  }
}

export default new SharesStore();
