# FreeNAS 10 GUI Development

FreeNAS 10 is the next version of FreeNAS, a FreeBSD-based open source NAS
operating system. This repo is where development of the GUI happens.

## Getting Started

FreeNAS 10 development is only supported on FreeBSD, Mac OS X, and Linux distros
using apt or yum.

To begin developing the FreeNAS 10 GUI, clone this repository and run
'bootstrap.sh' from the root of the repository. This script will analyze your
environment and install any missing prerequisites of the FreeNAS 10 development
tools.

You may also use cURL to obtain bootstrap.sh, in which case the script will set
up the repo for you.

    curl -o- https://raw.githubusercontent.com/freenas/freenas10-gui/master/bootstrap.sh | sh

## Using the FreeNAS 10 Development Environment

Once your development environment is initialized, run 'freenas-dev' to start the
FreeNAS 10 SDK app.

You will need to choose whether to target a real FreeNAS instance in order to
interact with the middleware, or to operate in "dumb mode", in which case it
will run a local copy of the GUI webapp that simulates interaction with real
data.

Once the app is running, it will monitor your source files and automatically
rebuild and restart the GUI every time a file changes.

### Note: This doesn't actually do anything yet.
