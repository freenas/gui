/**
 * @module topology-converter
 */

"use strict";

/**
 * This is the chart showing the recommended vdev layouts based on what
 * priority the user places on Storage, Redundancy, and Speed. The top
 * priority shows along the left column, and the second priority along the top
 * row. If the user maxes out one priority, that one counts as both first and
 * second priority.
 *
 *                  Storage           Redundancy            Speed
 * Storage    |- 9-drive raidz1 -|- 10-drive raidz2 -|- 7-drive raidz1--|
 * Redundancy |- 8-drive raidz2 -|-  4-drive raidz2 -|- 6-drive raidz1 -|
 * Speed      |- 3-drive raidz1 -|-      mirror     -|-     mirror     -|
 * @object
 */
var VDEV_RECOMMENDATIONS =
    { storage:
        { storage: { drives: 9, type: "raidz1" }
        , redundancy: { drives: 10, type: "raidz2" }
        , speed: { drives: 7, type: "raidz1" }
        }
    , redundancy:
        { storage: { drives: 8, type: "raidz2" }
        , redundancy: { drives: 4, type: "raidz2" }
        , speed: { drives: 6, type: "raidz1" }
        }
    , speed:
        { storage: { drives: 3, type: "raidz1" }
        , redundancy: { drives: 2, type: "mirror" }
        , speed: { drives: 2, type: "mirror" }
        }
    };

/**
 * The vdev types each part of a ZFS volume topology may contain.
 * @object
 */
exports.VDEV_TYPES =
    { data  : [ "disk", "stripe", "mirror", "raidz1", "raidz2", "raidz3" ]
    , log   : [ "disk", "stripe", "mirror" ]
    , cache : [ "disk", "stripe" ]
    , spare : [ "disk", "stripe" ]
    };

/**
 * Generates labels for drive groups based on the combination of RPM, capacity,
 * and type.
 * @private
 */
function createLabel ( disk ) {
    var maxRPM = disk.status.max_rotation
               ? disk.status.max_rotation + "rpm"
               : "";
    var type = disk.status.is_ssd
             ? "SSD"
             : "HDD";

    return disk.mediasize + "byte" + maxRPM + type;
};

/**
 * Returns arrays of drives based on their self-similarity - determined by
 * the labels generated for them.
 * @private
 */
function divideDrives ( drives ) {
    var driveGroups = {};

    drives.forEach( function ( drive ) {
        var label = createLabel( drive );
        if ( driveGroups[ label ] ) {
            driveGroups[ label ].push( drive );
        } else {
            driveGroups[ label ] = [ drive ];
        }
    });

    return driveGroups;
};

/**
 * Returns the largest group of drives. In case of ties, HDDs are preferred over
 * SSDs and larger drive sizes are preferred over smaller.
 * @private
 */
function findLargestDriveGroup ( driveGroups ) {
    var largestGroup = [];

    for ( var driveGroup in driveGroups ) {
        if ( driveGroup.length > largestGroup.length ) {
            largestGroup = driveGroup;
        } else if ( driveGroup.length === largestGroup.length ) {
            if ( !driveGroup.status.is_ssd && largestGroup[0].status.is_ssd ) {
                largestGroup = driveGroup;
            } else if ( driveGroup[0].mediasize > largestGroup[0].mediasize ) {
                largestGroup = driveGroup;
            }
        }
    }

    return largestGroup;
};

/**
 * @private
 */
function calculateRecommendation ( storage, redundancy, speed ) {
    var recommendation = {};

    if ( storage >= speed && storage >= redundancy ) {
        if ( speed === 0 && redundancy === 0 ) {
            recommendation = VDEV_RECOMMENDATIONS.storage.storage;
        } else if ( speed >= redundancy ) {
            // This also covers the default case where all priorities are equal
            recommendation = VDEV_RECOMMENDATIONS.storage.speed;
        } else {
            recommendation = VDEV_RECOMMENDATIONS.storage.redundancy
        }
    } else if ( speed > storage && speed >= redundancy ) {
        if ( storage === 0 && redundancy == 0 ) {
            recommendation = VDEV_RECOMMENDATIONS.speed.speed;
        } else if ( storage >= redundancy ) {
            recommendation = VDEV_RECOMMENDATIONS.speed.storage;
        } else {
            recommendation = VDEV_RECOMMENDATIONS.speed.redundancy;
        }
    } else if ( redundancy > storage && redundancy > speed ) {
        if ( storage === 0 && speed === 0 ) {
            recommendation = VDEV_RECOMMENDATIONS.redundancy.redundancy;
        } else if ( storage >= speed ) {
            recommendation = VDEV_RECOMMENDATIONS.redundancy.storage;
        } else {
            recommendation = VDEV_RECOMMENDATIONS.redundancy.speed;
        }
    }

    return recommendation;
};

// TODO: This might be useful in the GUI, but this isn't really the place to
// export it. If it's needed elsewhere, find a better place to put it.
/**
 * Identify which vdev types are allowed for a given purpose based on how many
 * disks are available.
 * @author Corey James Murphy-Vixie
 * @function
 * @param {array} disks Array of the names of all disks available for volume
 * creation.
 * @param {string} purpose One of 'data', 'log', 'cache', or 'spare',
 * identifying which part of the ZFS topology is being checked.
 * @returns {array} allowedTypes Which vdev types may be selected for the given
 * purpose.
 */
function getAllowedVdevTypes ( disks, purpose ) {
    var allowedTypes = [];

    if ( disks.length === 1 ) {
        allowedTypes.push( VDEV_TYPES[ purpose ][0] );
    } else if ( disks.length > 1 ) {
        // This might look "too clever" at first, but it's very simple. The
        // VDEV_TYPES array contains 5 entries, from "disks" to "raidz3". To
        // have three parity drives for a VDEV, you need to have two data disks.
        // If you only have one, then what you actually have is a four-way
        // mirror. This holds true for Z2 and Z1, all the way down to the case
        // where you have two disks, and your only option is to mirror or stripe
        // them (but striping is bad and we might want to not allow it in
        // certain "purposes", like data ). We add one to the length of the
        // array to accommodate both "stripe" and "mirror".
        if ( VDEV_TYPES[ purpose ].length > 1 ) {
            for ( var i = 0; i< disks.length + 1 ; i++ ) {
                allowedTypes.push( VDEV_TYPES[ purpose ][i] );
            }
        } else {
            allowedTypes.push( VDEV_TYPES[ purpose ][0] );
        }
    }

    return allowedTypes;
};

/**
 * @private
 */
function createDiskVdev ( path ) {
    return ( { path: path
             , type: "disk"
             , children: []
             }
    );
};

function createComplexVdev ( type, drives ) {
    var vdev = { type: type, children: [] };
    vdev.children = drives.map( function ( drive ) {
        return createDiskVdev( drive.status.path )
    });
}

// TODO: There's a lot of duplication of creating vdevs in this function.
// See if this can be abstracted without adding too much more complexity.
/**
 * @private
 */
function distributeDataDrives ( driveGroup, vdevType, vdevSize ) {
    var vdevs = [];
    var numVdevs = Math.floor( driveGroup.length / vdevSize );
    // These is duplicated because they may be manipulated within the function.
    var modifiedVdevSize = vdevSize;
    var modifiedVdevType = vdevType;
    // This value will not be used, but it's populated here to make clear what
    // it's for.
    var allowedVdevTypes = getAllowedVdevTypes( vdevSize, "data" );

    if ( driveGroup.length === 1 ) {
        // If there's only one disk, always return a single disk.
        vdevs.push( createDiskVdev( driveGroup[0].status.path ) );
    } else if ( driveGroup.length === 2 ) {
        // If there are only two disks, always return a mirror.
        vdevs.push( createComplexVdev( "mirror", driveGroup ) );
    } else if ( driveGroup.length === 3 ) {
        // If there are only three disks, always return a 3-drive raidz1.
        vdevs.push( createComplexVdev( "raidz1", driveGroup ) );
    } else if ( driveGroup.length < vdevSize ) {
        // If not for the above three cases, we'd have to test allowed vdev
        // types here. However, once you have 4 drives (the minimum to get here)
        // all three relevant vdev types are allowed.
        vdevs.push( createComplexVdev( vdevType, driveGroup ) );
    } else if ( numVdevs === 1 ) {
        // There are slightly different rules when there's only one vdev
        // expected than when there's more than one.
        if ( driveGroup.length % vdevSize === 0 ) {
            // The desired vdev size divides evenly into the number of drives
            // available.
            vdevs.push( createComplexVdev( vdevType, driveGroup ) );
        } else if ( ( vdevSize / ( driveGroup.length % vdevSize )
                  > vdevSize / 2 )
                  ) {
            // If the number of drives left over is more than half the number
            // of drives expected, create two vdevs instead
            // Check how many drives will be in the new vdevs, since it will be
            // lower than the old number.
            numVdevs = 2;
            modifiedVdevSize = Math.floor( driveGroup.length/2 );
            // Check if the vdev size has to change because the number of drives
            // in the new vdevs will be less than the minimum for the vdev type.
            // Realistically, there are only one or two cases where this can
            // happen, and I think they all convert a raidz2 to a raidz1.
            // Nonetheless, this is a real case.
            allowedVdevTypes = getAllowedVdevTypes( modifiedVdevSize, "data" );
            if ( typeof allowedVdevTypes.find( vdevType ) === "undefined" ) {
                modifiedVdevType = allowedVdevTypes[ allowedVdevTypes.length - 1 ];
            }
            for ( var i = 0; i < numVdevs; i++ ) {
                vdevs.push( createComplexVdev( modifiedVdevType
                                             , driveGroup.slice( i * modifiedVdevSize
                                                               , i * modifiedVdevSize + ( modifiedVdevSize )
                                                               )
                                             )
                );
            }
        } else {
            // If the number of drives left over is less than or equal to half
            // the number of drives expected, just add them all to the vdev.
            vdevs.push( createComplexVdev( vdevType, driveGroup ) );
        }
    } else {
        // Finally, more than one vdev is expected. Despite being the most
        // generic case, it's actually the least likely for home FreeNAS
        // users.
        if ( driveGroup.length % vdevSize > numVdevs ) {
            // If the number of drives left out is more than the number of
            // vdevs, distribute the remaining drives among them.
            modifiedVdevSize = vdevSize
                             + Math.floor( numVdevs / vdevSize );
            // Note: unlike possibly reducing the drive count above, increasing
            // the vdev size cannot cause a change in recommended vdev size.
            for ( var j = 0; j < numVdevs; j++ ) {
                vdevs.push( createComplexVdev( vdevType
                                             , driveGroup.slice( j * modifiedVdevSize
                                                               , j * modifiedVdevSize + ( modifiedVdevSize )
                                                               )
                                             )
                );
            }
        } else {
            // The desired vdev size divides evenly into the number of
            // drives available, or there are fewer drives left over than the
            // number of vdevs expected and the remainder are to be left out.
            for ( var k = 0; k < numVdevs; k++ ) {
                vdevs.push( createComplexVdev( vdevType
                                             , driveGroup.slice( k * vdevSize
                                                               , k * vdevSize + ( vdevSize )
                                                               )
                                             )
                );
            }
        }
    }

    return vdevs;
};

/**
 * generateTopology - generates volume layout based on available and provided
 * priorities among storage, redundancy, and speed.
 * @see <a href="https://docs.google.com/document/d/1TmKJHVUToFrvxJ1PU3ZZxXQ-yvzVDgMTZtGNDf6gVco/edit">Triangle of Emotion/Volume create-auto Behavior</a>
 * @function
 * @param {object} disks Object keyed by 'id' of all disks available for
 * volume construction, following the schema in the middleware for disks.
 * @param {object} priorities Object containing the keys 'storage',
 * 'redundancy', and 'speed'. Each should have a positive number value. If
 * 'priorities' is not provided, each key is treated as though it has the
 * value .5.
 * @returns {object} A recommended topology fitting the schema required by the
 * middleware.
 */
exports.generateTopology = function ( drives, priorities ) {
    var topology =
        { data  : []
        , log   : []
        , cache : []
        , spare : []
        };

    var driveGroups = divideDrives( drives );
    var dataDriveGroup = findLargestDriveGroup( driveGroups );

    var logSSDs;
    var cacheSSDs;

    if ( typeof priorities === "undefined" ) {
        priorities =
            { storage: .5
            , redundancy: .5
            , speed: .5
        }
    }

    var recommendation = calculateRecommendation( priorities.storage
                                                , priorities.redundancy
                                                , priorities.speed
                                                );

    topology.data = distributeDataDrives( driveGroups[ dataDriveGroup ]
                                        , recommendation.type
                                        , recommendation.drives
                                        );

    // Try to add log and/or cache if there are extra drive groups and speed
    // is the top priority.
    if ( driveGroups.length > 1
      && ( priorities.speed > priorities.storage )
       ) {
        // TODO: Isolate log and cache candidate drive groups, making sure not
        // to try to re-use the data drive group.
        // Only add cache drives if the pool isn't all-ssd.
        if ( !dataDriveGroup[0].status.is_ssd ) {

        }
    }

    // TODO: Distribute extra disks into spares, if we confirm we want to do
    // that.

    return topology;
};
