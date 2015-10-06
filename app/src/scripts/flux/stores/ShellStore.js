// SHELLS STORE
// ============
// Stores the available shells provided by the target FreeNAS system.

"use strict";

import FreeNASDispatcher from "../dispatcher/FreeNASDispatcher";
import { ActionTypes } from "../constants/FreeNASConstants";
import FluxBase from "./FLUX_STORE_BASE_CLASS";

var shells = [];

class ShellStore extends FluxBase {
  constructor() {
    super();

    this.dispatchToken = FreeNASDispatcher.register(
      handlePayload.bind( this )
    );
  }

  get shells () {
    return shells;
  }
};

function handlePayload ( payload ) {
  const ACTION = payload.action;

  switch ( ACTION.type ) {

    case ActionTypes.RECEIVE_SHELLS:
      shells = ACTION.shells;
      this.emitChange();
      break;
  }
}

export default new ShellStore();
