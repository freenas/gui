// statd RPC Class
// ===============
// Provides RPC functions and events for the statd namepace

"use strict";

import _ from "lodash";
import moment from "moment";

import RPCBase from "../RPC_BASE_CLASS";

  const emptyStat =
    { "nolog": true
    , "timestamp": null
    , "value": null
    , "change": null
    };

  const baseEvent =
    { nolog: true };

class Statd extends RPCBase {

  constructor ( system ) {
    super();

    this.system = system;

    this.namepace = "statd";

    // TODO: handle adding new events ie. when a pool is created
    this.CHANGE_EVENT =
      [ "statd.events.changed"
      , "statd.localhost.aggregation-cpu-sum.cpu-system.value.pulse"
      , "statd.localhost.aggregation-cpu-sum.cpu-user.value.pulse"
      , "statd.localhost.aggregation-cpu-sum.cpu-idle.value.pulse"
      , "statd.localhost.aggregation-cpu-sum.cpu-nice.value.pulse"
      , "statd.localhost.aggregation-cpu-sum.cpu-interrupt.value.pulse"
      // System Load
      , "statd.localhost.load.load.longterm.pulse"
      , "statd.localhost.load.load.midterm.pulse"
      , "statd.localhost.load.load.shortterm.pulse"
      // Memory
      , "statd.localhost.memory.memory-wired.value.pulse"
      , "statd.localhost.memory.memory-cache.value.pulse"
      , "statd.localhost.memory.memory-active.value.pulse"
      , "statd.localhost.memory.memory-free.value.pulse"
      , "statd.localhost.memory.memory-inactive.value.pulse"
      // TODO: put together events for each pool
      // TODO: put together events for each interface
      ];

      setInterval( function update_all_stats () {
        let cpuStatValues = this.update_cpu_stats( this.system );
        let systemLoadValues = this.update_system_load( this.system );
        let ramStatValues = this.update_ram_use( this.system );

        // Construct and emit events for cpu values
        _.forEach( cpuStatValues
                 , function emitCPUStats ( stat
                                         , statName
                                         ) {
                   this.emitChange( "statd.localhost.aggregation-cpu-sum.cpu-"
                                  + statName
                                  + ".value.pulse"
                                  , null
                                  , stat
                                  );
                 }
                 , this
                 );

        // Construct and emit events for system load values
        _.forEach( systemLoadValues
                 , function emitLoadStats ( stat
                                          , statName
                                          ) {
                   this.emitChange( "statd.localhost.load.load."
                                  + statName
                                  + ".pulse"
                                  , null
                                  , stat
                                  );
                 }
                 , this
                 );

        // Construct and emit events for memory values
        _.forEach( ramStatValues
                 , function emitRAMStats ( stat
                                         , statName
                                         ) {
                   this.emitChange( "statd.localhost.memory.memory-"
                                  + statName
                                  + ".value.pulse"
                                  , null
                                  , stat
                                  );
                 }
                 , this
                 );
      }.bind( this )
      , 5000
      );

    this.lastRAM =
      { "wired": _.clone( emptyStat )
      , "cache": _.clone( emptyStat )
      , "active": _.clone( emptyStat )
      , "free": _.clone( emptyStat )
      , "inactive": _.clone( emptyStat )
      };

    this.lastCPU =
      { "system": _.clone( emptyStat )
      , "user": _.clone( emptyStat )
      , "nice": _.clone( emptyStat )
      , "idle": _.clone( emptyStat )
      , "interrupt": _.clone( emptyStat )
      }

    this.lastLoad =
      { "longterm": _.clone( emptyStat )
      , "midterm": _.clone( emptyStat )
      , "shortterm": _.clone( emptyStat )
      }
  }

  update_cpu_stats () {

    const timestamp = moment().unix();
    var idleValue = 100;

    var system =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: 10 + Math.floor( Math.random() * 5 )
               , change: this.lastCPU[ "system" ][ "value" ]
               }
             );

    idleValue -= system[ "value" ];

    var user =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: 10 + Math.floor( Math.random() * 10 )
               , change: this.lastCPU[ "user" ][ "value" ]
               }
             );

    idleValue -= user[ "value" ];

    var nice =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: 5 + Math.floor( Math.random() * 5 )
               , change: this.lastCPU[ "nice" ][ "value" ]
               }
             );

    idleValue -= nice[ "value" ];

    var interrupt =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: 2 + Math.floor( Math.random() * 5 )
               , change: this.lastCPU[ "interrupt" ][ "value" ]
               }
             );

    idleValue -= interrupt[ "value" ];

    var idle =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: idleValue
               , change: this.lastCPU[ "idle" ][ "value" ]
               }
             );

    var cpuStats =
      { "system": system
      , "user": user
      , "nice": nice
      , "idle": idle
      , "interrupt": interrupt
      }

    this.lastCPU = _.cloneDeep( cpuStats );
    return cpuStats;
  }

  update_system_load () {

    const timestamp = moment().unix();
    var longterm =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: .1 + Math.floor( Math.random() * 2 )/100
               , change: this.lastLoad[ "longterm" ][ "value" ]
               }
             );

    var midterm =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: .1 + Math.floor( Math.random() * 2 )/100
               , change: this.lastLoad[ "midterm" ][ "value" ]
               }
             );

    var shortterm =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: .1 + Math.floor( Math.random() * 2 )/100
               , change: this.lastLoad[ "shortterm" ][ "value" ]
               }
             );

    var systemLoad =
      { "longterm": longterm
      , "midterm": midterm
      , "shortterm": shortterm
      }

    this.lastLoad = _.cloneDeep( systemLoad );
    return systemLoad;
  }

  update_ram_use () {

    const timestamp = moment().unix();
    const availableMemory = this.system[ "memory_size" ]
    var freeRatio = 1;

    var wiredRatio = .15 + ( Math.floor( Math.random() * 10 ) / 100 );
    var wired =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: Math.round( availableMemory * wiredRatio )
               , change: this.lastRAM[ "wired" ][ "value" ]
               }
             );
    freeRatio -= wiredRatio;

    var cacheRatio = .4 + ( Math.floor( Math.random() * 10 ) / 100 );
    var cache =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: Math.round( availableMemory * cacheRatio )
               , change: this.lastRAM[ "cache" ][ "value" ]
               }
             );
    freeRatio -= cacheRatio;

    var activeRatio = .05 + ( Math.floor( Math.random() * 10 ) / 100 );
    var active =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: Math.round( availableMemory * activeRatio )
               , change: this.lastRAM[ "active" ][ "value" ]
               }
             );
    freeRatio -= activeRatio;

    var inactiveRatio = .05 + ( Math.floor( Math.random() * 10 ) / 100 );
    var inactive =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: Math.round( availableMemory * inactiveRatio )
               , change: this.lastRAM[ "inactive" ][ "value" ]
               }
             );
    freeRatio -= inactiveRatio;

    var free =
      _.merge( _.clone( baseEvent )
             , { timestamp: timestamp
               , value: Math.round( availableMemory * freeRatio )
               , change: this.lastRAM[ "free" ][ "value" ]
               }
             );

    var ramUse =
      { "wired": wired
      , "cache": cache
      , "active": active
      , "free": free
      , "inactive": inactive
      }

    this.lastRAM = _.cloneDeep( ramUse );

    return ramUse;

  }
}

export default Statd;
