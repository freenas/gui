<img src="https://raw.githubusercontent.com/freenas/gui/master/Shark.jpg">

# FreeNAS 10 GUI Development

FreeNAS 10 is the next version of FreeNAS, a FreeBSD-based open source NAS
operating system. This repo is where development of the GUI happens.

## Getting Started

FreeNAS 10 development is currently supported on FreeBSD, Mac OS X, and some
Linux distributions.

If you already have node.js installed and the repo checked out, great! Skip to
"Using the FreeNAS 10 Development Environment" below.

Otherwise, to begin developing for the FreeNAS 10 GUI on one of these platforms,
simply do:

    curl -o- https://raw.githubusercontent.com/freenas/gui/master/bootstrap.sh | sh

This will analyze your development environment and bootstrap the development
toolchain onto it as necessary, also checking out a working copy of this
git repository for you. It will also install node and npm if they aren't already
available. Installing missing software is only supported on FreeBSD and Linux
distributions using apt or yum.

Alternatively, if you have already cloned this repo then just do:

    sh bootstrap.sh

from the root of it to accomplish the same thing.

## Using the FreeNAS 10 Development Environment

If you used the bootstrap script, you'll already be ready to run 'gulp'. If not,
run 'npm install' from the root of the repo first.

Once your development environment is initialized, run 'gulp' to start the
FreeNAS 10 SDK app.

You will need to choose whether to target a real FreeNAS instance in order to
interact with the middleware, or to operate in "dumb mode", in which case it
will run a local copy of the GUI webapp that simulates interaction with real
data. 'gulp --connect FreenasIPorHostname' will start you in live development
mode with a real connection. 'gulp' alone will start you with a local webserver
only, so you can work on UI elements for as-yet-unavailable middleware
functionality.

Once the app is running, it will monitor your source files and automatically
rebuild and restart the GUI every time a file changes.

## Other resources

For documentation of the FreeNAS 10 GUI architecture, recommended tools, and
contribution guidelines, see
[freenas.github.io/gui](https://freenas.github.io/gui).
