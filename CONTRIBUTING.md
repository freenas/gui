# Contributing to the FreeNAS 10 GUI

FreeNAS 10 is a green-field project, and we're looking for contributors who are
ready to take nothing and turn it into something. We provide a dev environment
that makes iterating incredibly fast, and provides tools like sourcemaps and
live-updating to make debugging as easy as possible.

## Getting Started

FreeNAS 10 development is currently supported on FreeBSD, Mac OS X, and some
Linux distributions. Windows users might be able to get it working, but it's not
and will not be an officially supported platform for development.

If you already have node.js installed and the repo checked out, great! Skip to
"Using the FreeNAS 10 Development Environment" below.

Otherwise, to begin developing for the FreeNAS 10 GUI on one of these platforms,
install node.js.

For Mac OS X, installing the package from nodejs.org should suffice.
For FreeBSD, run `sudo pkg install npm`.

## Using the FreeNAS 10 Development Environment

To make sure you have all the necessary global dev dependencies for developing
the FreeNAS 10 GUI, run:

    npm install
    sudo npm install -g minit

from the root of where you cloned the GUI repo first.

Once you have the environment bootstrapped, just for now do the following:

    1. edit core/backend/websocket-configuration.js and replace freenas.local
     with the name or IP address of your freenas10 instance (the middleware) if
     you have changed its name from freenas.local (the default).
     
    2. minit serve &
    
This will start the stand-alone web server so you can connect your web
browser to localhost:8083

It goes without saying that you also have to have a FreeNAS 10 instance running somewhere to point the GUI at.
See http://download.freenas.org/10/MASTER/ for the latest version by date, grab the ISO out of it, and install it
on a VM or spare machine somewhere.  It will call itself "freenas.local" by default, so if you have a network
where mDNS is supported you don't even have to do step 1 above.  As soon as we have the ability to pass the
middleware IP to minit, it will no longer be necessary to edit the websocket-configuration.js file.

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
