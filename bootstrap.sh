#!/bin/sh
#
# Helper script for bootstrapping the FreeNAS 10 GUI development environment
# on *BSD, OS X or Linux hosts.
#
# Author: jkh
# Company: iXsystems, Inc.

_SYSTEM=`uname -s`
_PREFIX=/usr/local/bin
_EXEC_SHELL=bash
_SUDO=sudo
_PKG_INSTALL="nopkg"
_FREENAS_GUI_REPO="http://github.com/freenas/freenas10-gui"
_NPM_THINGS="bower grunt grunt-cli forever jshint jscs esprima-fb"

whitcher()
{
	if ! which $1 >/dev/null 2>&1 ; then
		return 0
	else
		return 1
	fi
}

resolve()
{
	if [ "${_PKG_INSTALL}" == "nopkg" ]; then
		echo "I lack the talent to install packages on ${_SYSTEM} systems.  You will have to"
		echo "install the $1 package yourself.  I give up!"
		exit 5
	fi

	if whitcher ${_SUDO}; then
		echo "I have no sudo command, so I am going to try installing packages non-privileged."
		_SUDO=""
	fi
	echo "I see you do not have $1.  I will now attempt to install it."
	if ! ${_SUDO} ${_PKG_INSTALL} $1; then
		return 1
	fi
	return 0
}

echo "Hi, I am the FreeBSD GUI SDK bootstrapper!  I will now attempt to sniff your"
echo "system in various locations to make sure everything is in order, installing"
echo "software as necessary.  This may require sudo privileges, so be prepared for"
echo "me to ask you for your password."
echo
echo "Checking out your system..."
case "${_SYSTEM}" in
	Darwin)
		echo "Congratulations, you're on a Mac!"
		if ! whitcher port; then
			_PKG_INSTALL="port install"
		elif ! whitcher brew; then
			_PKG_INSTALL="brew install"
		fi
		;;
	FreeBSD)
		echo "You seem to be running FreeBSD.  Excellent choice."
		_PKG_INSTALL="pkg install"
		;;
	Linux)
		echo "I do not judge you for running Linux."
		if ! whitcher apt-get; then
			_PKG_INSTALL="apt-get install"
		else
			_PKG_INSTALL="yum install"
		fi
		;;
	*)
		echo "I'm sorry, but ${SYSTEM} is an unsupported platform"
		exit 1
		;;
esac

if ! echo "$PATH" | grep -q ${_PREFIX}; then
	echo "I'm sorry, but ${_PREFIX} must be in your PATH. Please edit your"
	echo "startup file(s) for ${SHELL} to include it and run me again!"
	exit 2
fi

if whitcher "${_EXEC_SHELL}" ; then
	_MSG="I cannot find the ${_EXEC_SHELL} shell"
	if /bin/sh --version 2>&1 | grep -q ${_EXEC_SHELL}; then
		echo "${_MSG} - however, your /bin/sh is ${_EXEC_SHELL} so OK"
	else
		echo "${_MSG} - you should install it and run me again."
		exit 3
	fi
fi

if whitcher git; then
	if ! resolve git; then
		echo "I could not install git on this platform.  Your development experience may"
		echo "be less than satisfactory, but it's optional so proceeding anyway."
	else
		_HAVE_GIT="yes"
	fi
else
	_HAVE_GIT="yes"
fi

if whitcher npm; then
	if [ ! -d ${HOME}/.nvm ]; then
		echo "I see you don't have nvm / npm installed.  Let's take care of that now."
		if ! curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.25.4/install.sh | ${_EXEC_SHELL}; then
			echo "I could not install npm, the Node package manager.  I'm bailing out!"
			exit 7
		fi
	fi
fi

#if npm install -g ${_NPM_THINGS}; then
#	echo "Looks like some of the npm tools didn't install.  Whoops!"
#	exit 9
#fi

if [ ! -f bootstrap.sh -a "${_HAVE_GIT}" = "yes" ]; then
	echo "OK, the dev tools look good, now checking out the sources you will need"
	echo "to develop for the FreeNAS GUI."
	if ! git clone ${_FREENAS_GUI_REPO}; then
		echo "Unable to clone the ${_FREENAS_GUI_REPO}. You will have to do this"
		echo "before you can develop for the FreeNAS 10 GUI."
		exit 8
	elif [ -d freenas-gui ]; then
		echo "Sources are now checked out in the `pwd`/freenas-gui directory."
		echo "cd into that directory to begin developing with the freenas-dev command"
	fi
fi

echo "Congratulations, you have everything you need to develop for the FreeNAS GUI!"
echo "./freenas-dev --help will provide basic usage instructions"
exit 0
