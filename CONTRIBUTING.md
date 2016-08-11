# Contributing to the FreeNAS 10 GUI

FreeNAS 10 is a ground-up rewrite of FreeNAS, and we're looking for
contributors who are prepared to work with an entirely new code base.
Our dev environment is designed to make iterating quick and easy.

## Getting Started

FreeNAS 10 development is currently supported on FreeBSD, Mac OS X, and some
Linux distributions. Windows users might be able to get it working, but it's not
and will not be an officially supported platform for development.

If you already have node.js installed and the repo checked out, great! Skip to
"Using the FreeNAS 10 Development Environment" below.

Otherwise, to begin developing for the FreeNAS 10 GUI on one of these platforms,
install node.js.

For Mac OS X, installing the package from nodejs.org should suffice.
For FreeBSD, run `sudo pkg install npm2`.

Please note that the FreeNAS 10 GUI currently only works using npm 2.

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

## Editing CSS in FreeNAS 10

###This is required to edit css files!

FreeNAS 10 Development environment also comes with [Gulp](http://gulpjs.com/) and [PostCSS](https://github.com/postcss/postcss) with [CSSNext](http://cssnext.io/features/). 

To run simply type `gulp` and a browser-sync server will load.

Make all css changes to documents labeled `_nameOfFile.css` These files get compiled by PostCSS and create a minified version `nameOfFile.css` in which the program will use.

Upcoming: more explanation on `_config.css`, [blue-shark](https://github.com/freenas/blue-shark/), and plugins used with PostCSS

## How to work on FreeNAS

Upcoming: Docs walking through the process of adding a top level feature.

## How to Coordinate with the FreeNAS Team

FreeNAS 10 is still incredibly early in development. We're looking for
contributors who can provide a concrete mockup for a given feature, work with us
to refine the mockup, and then implement it independently. To get started, open an issue containing a mockup of the feature you're propsing. We accept beautiful, detailed designs in any mockup or design software you user. We also accept cellphone pictures of whiteboards and cocktail napkins. All we need is something clear enough to review.

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
