// WEBSOCKET CLOSE CODES
// =====================

"use strict";

export const CODE_EXPLANATIONS =
  { 1000: "Normal closure; the connection successfully completed whatever "
        + "purpose for which it was created."
  , 1001: "The endpoint is going away, either because of a server failure "
        + "or because the browser is navigating away from the page that "
        + "opened the connection."
  , 1002: "The endpoint is terminating the connection due to a protocol error."
  , 1003: "The connection is being terminated because the endpoint received "
        + "data of a type it cannot accept (for example, a text-only "
        + "endpoint received binary data)."
  , 1005: "No status code was provided even though one was expected."
  , 1006: "Connection was closed abnormally when a status code was expected."
  , 1007: "The endpoint is terminating the connection because a message was "
        + "received that contained inconsistent data (e.g., non-UTF-8 data "
        + "within a text message)."
  , 1008: "The endpoint is terminating the connection because it received a "
        + "message that violates its policy. This is a generic status code, "
        + "used when codes 1003 and 1009 are not suitable."
  , 1009: "The endpoint is terminating the connection because a data frame "
        + "was received that is too large."
  , 1010: "The client is terminating the connection because it expected the "
        + "server to negotiate one or more extension, but the server didn't."
  , 1011: "The server is terminating the connection because it encountered "
        + "an unexpected condition that prevented it from fulfilling the "
        + "request."
};

export function isClosureNormal ( code ) {
  switch ( code ) {
    case 1000:
    // TODO: Other codes and cases we will consider as a "normal" close event
      return true;

    default:
      return false;
  }
}
