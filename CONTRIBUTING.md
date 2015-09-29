# Contributing to the FreeNAS 10 GUI

FreeNAS 10 is a green-field project, and we're looking for contributors who are
ready to take nothing and turn it into something. We provide a dev environment
that makes iterating incredibly fast, and

## Getting Started

FreeNAS 10 development is currently supported on FreeBSD, Mac OS X, and some
Linux distributions. Windows users might be able to get it working, but it's not
and will not be an officially supported platform for development.

If you already have node.js installed and the repo checked out, great! Skip to
"Using the FreeNAS 10 Development Environment" below.

Otherwise, to begin developing for the FreeNAS 10 GUI on one of these platforms,
install node.js.

For Mac OS X, installing the package from nodejs.org should suffice.
For FreeBSD, run `sudo pkg install node && pkg install npm`

## Using the FreeNAS 10 Development Environment

To make sure you have all the necessary global dev dependencies for developing
the FreeNAS 10 GUI, run:

    sudo npm install -g gulp forever jshint jscs esprima-fb@15001.1.0-dev-harmony-fb
    npm install

from the root of the repo first.  Then install another 400 or so npm modules
we forgot to include above, and bingo!  Easy.

Once your development environment is initialized, run 'gulp' to start the
FreeNAS 10 SDK app.

You will need to choose whether to target a real FreeNAS instance in order to
interact with the middleware, or to operate in "dumb mode", in which case it
will run a local copy of the GUI webapp that simulates interaction with real
data. `gulp --connect FreeNASIPorHostname` will start you in live development
mode with a real connection. `gulp` alone will start you with a local webserver
only, so you can work on UI elements for as-yet-unavailable middleware
functionality.

Once the app is running, it will monitor your source files and automatically
rebuild and restart the GUI every time a file changes.

## How to work on FreeNAS

Upcoming: Docs walking through the process of adding a top level feature.

## How to Coordinate with the FreeNAS Team

FreeNAS 10 is still incredibly early in development. We're looking for
contributors who can provide a concrete mockup for a given feature, work with us
to refine the mockup, and then implement it independently.

Our preferred way to see a mockup is with
[Balsamiq Mockups](https://balsamiq.com/). If you don't have commit access,
simply open an issue with your proposed mockup attached (Balsamiq also exports
to PNG, if needed). A template project and any existing mockups may be found in
the [mockups](https://github.com/freenas/gui/tree/master/mockups) directory in
the source. Balsamiq offers a 30-day free trial. If you don't have access to
Balsamiq, we also accept cellphone pictures of whiteboards and cocktail napkins.
All we need is something clear enough to review.

The FreeNAS team at iXsystems has regular meetings to assess and provide
feedback on mockups. Once a mockup is approved (probably a pretty informal
process after the first look) the contributor should be prepared to implement
that feature according to that mockup without substantial further feedback. This
should be done in a feature branch for those with commit access and in a fork
otherwise.

Once a feature is ready, send a pull request or merge your changes. Don't send
a pull request or merge your changes until you're absolutely sure your feature
is ready, because it will be summarily rejected if it's broken, substantially
different from the mockup, or negatively impacts any other part of the GUI.

## My Node environment is totally messed up, help!

Has something gone horribly wrong with your node and npm environment? For your
convenience, here's the command some members of our team have used to
nuke everything from orbit. This command is for Mac OS X:

	cd source-directory-for-gui (where this file you're reading is)
	sudo ./node-nuker-osx.sh

Once that's done, start fresh! We recommend against using MacPorts or Homebrew
for your Node installation on OS X.
