// REDUCER UTILITY FUNCTIONS
// =========================

export function recordUUID ( UUID, state, setName ) {
  let updated = new Set( state[ setName ] );

  updated.add( UUID );

  return { [ setName ]: updated }
};

export function resolveUUID ( UUID, state, setName ) {
  let updated = new Set( state[ setName ] );

  updated.delete( UUID );

  return { [ setName ]: updated }
};

export function payloadIsType ( payload, testString ) {
  if ( payload.data
    && typeof payload.data === "object"
    && payload.data.hasOwnProperty( "name" )
    && payload.data.name.startsWith( testString )
    ) {
    return true;
  } else {
    return false;
  }
}


export function handleUpdateSingle ( payload, state, key ) {
  if ( !payload.data ) {
    console.warn( "Cannot update a record without new data:" );
    console.log( payload );
    return state;
  }

  if ( !payload.data.id ) {
    console.warn( "Cannot update a record without an ID:" );
    console.log( payload );
    return state;
  }

  return Object.assign( {}, state,
    { [ key ]: { [ payload.data.id ]: payload.data } }
  );
}

export function handleDeleteSingle ( payload, state, key ) {
  if ( !payload.data ) {
    console.warn( "Cannot delete a record without new data:" );
    console.log( payload );
    return state;
  }

  if ( !payload.data.id ) {
    console.warn( "Cannot delete a record without an ID:" );
    console.log( payload );
    return state;
  }

  let newCollection = Object.assign( {}, state[ key ] );
  delete newCollection[ payload.data.id ];
  return Object.assign( {}, state, { [ key ]: newCollection } );
}


export function handleChangedEntities ( payload, stateCollection ) {
  let newCollection = Object.assign( {}, stateCollection );

  switch ( payload.data.operation ) {
    case "create":
      payload.data.entities.forEach( entity => {
        newCollection[ entity.id ] = entity;
      });
      break;

    case "delete":
      payload.data.ids.forEach( id => {
        delete newCollection[ id ];
      });
      break;

    case "update":
      payload.data.entities.forEach( entity => {
        newCollection[ entity.id ] =
          Object.assign( {}
                       , stateCollection[ entity.id ]
                       , entity
                       );
      });
      break;

    default:
      console.warn( `Unrecognized operation "${ payload.data.operation }".` );
      console.dir( "Payload:", payload );
      break;
  }

  return newCollection;
}