// SERVER SHIM
// ===========
// An entrypoint with the Babel require hook, allowing the actual server to be
// written in ES6. Eventually we'll be able to remove this (whenever we have
// reasonable support in Node, natively).

"use strict";

require( "babel/register" );

require( "./server" );
