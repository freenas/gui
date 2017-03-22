<img src="https://raw.githubusercontent.com/freenas/gui/master/Shark.jpg">

# FreeNAS Corral GUI Development

FreeNAS Corral is the next version of FreeNAS, a FreeBSD-based open source NAS / application hosting software appliance. This repo is where development of the GUI happens.

The FreeNAS Corral GUI is based on various HTML5 Javascript development frameworks and technologies.

Please read the [CONTRIBUTING.md](https://github.com/freenas/gui/blob/master/CONTRIBUTING.md) document for the full documentation on contributing to the GUI project.  The quick TL;DR version of how to get started is:

1. Check out this repo somewhere and cd to it.
2. Install FreeNAS Corral on a VM / machine (let's call it freenas.local)
3. npm install (to install the various tools locally).
4. npm run-script serve & (run the stand-alone web server)
5. Go to http://localhost:3000/#?host=freenas.local

Edit sources as desired and the web server should pick up the changes, for
incremental style development.
