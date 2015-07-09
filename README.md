# FreeNAS 10 GUI Development

FreeNAS 10 is the next version of FreeNAS, a FreeBSD-based open source NAS
operating system. This repo is where development of the GUI happens.

## Getting Started

FreeNAS 10 development is currently supported on FreeBSD, Mac OS X, and Linux
distributions using apt or yum.

To begin developing for the FreeNAS 10 GUI on one of these platforms, simply do:

    curl -o- https://raw.githubusercontent.com/freenas/freenas10-gui/master/bootstrap.sh | sh

This will analyze your development environment and bootstrap the development
toolchain onto it as necessary, also checking out a working copy of this
git repository for you.

Alternatively, if you have already cloned this repo then just do:

    sh bootstrap.sh
from the root of it to accomplish the same thing.

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
