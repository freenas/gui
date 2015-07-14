#!/bin/sh
#
# Helper script for bootstrapping the FreeNAS 10 GUI development environment
# on *BSD, OS X or Linux hosts.
#
# Author: jkh
# Company: iXsystems, Inc.

_SYSTEM=`uname -s`
_PREFIX=/usr/local/bin
_SUDO=sudo
_PKG_INSTALL="nopkg"
_FREENAS_GUI_REPO="http://github.com/freenas/gui"
_FREENAS_DEV="gulp"
_NPM_THINGS="bower gulp forever jshint jscs esprima-fb@15001.1.0-dev-harmony-fb"
_NODE_VERSION=0.12.7

# Its the only way to be sure.
nuke_node_from_orbit()
{
	if whitcher ${_SUDO}; then
		echo "Unfortunately, there is no sudo on this machine.  Please install it."
		exit 20
	fi

	if [ "$1" == "-all" ]; then
		# erase all possible install paths
		echo "OK, I'm going all Ripley on your previous Node installation."
		if [ ${_SYSTEM} == "FreeBSD" ]; then
			${_SUDO} pkg remove node
			${_SUDO} pkg remove npm
		fi
		${_SUDO} rm -rf /usr/local/lib/node*
		${_SUDO} rm -rf /usr/local/include/node*
		${_SUDO} rm -rf ~/{local,lib,include,node*,npm,.npm*}
		${_SUDO} rm -rf /usr/local/bin/{node*,npm}
		${_SUDO} rm -rf /usr/local/bin/npm
		${_SUDO} rm -rf /usr/local/share/man/man1/node.1
		${_SUDO} rm -rf /usr/local/lib/dtrace/node.d
		${_SUDO} rm -rf ~/.npm
		${_SUDO} rm -rf ~/.nvm
	fi
	echo "Deleting any possible leftover node or bower modules."
	rm -rf node_modules/
	rm -rf bower_components/
	rm -rf app/build/
}

whitcher()
{
	if ! which $1 >/dev/null 2>&1 ; then
		return 0
	else
		return 1
	fi
}

try_without_root_permissions()
{
	if ! $@; then
		echo "I need to run $@ with escalated permissions."
		if whitcher ${_SUDO}; then
			echo "Unfortunately, there is no sudo on this machine.  Please install it."
			return 1
		fi
		echo "Enter your password if needed:"
		if ! ${_SUDO} $@; then
			echo "I wasn't able to run $@ even with escalated permissions."
			return 1
		fi
	fi
	return 0
}

resolve()
{
	if [ "${_PKG_INSTALL}" == "nopkg" ]; then
		return 1
	fi

	if whitcher ${_SUDO}; then
		echo "I have no sudo command, so I am going to try installing packages non-privileged."
		_SUDO=""
	fi
	echo "I see you do not have $1.  I will now attempt to install it."
	if ! try_without_root_permissions ${_PKG_INSTALL} $1; then
		return 1
	fi
	return 0
}

install_node_from_src()
{
	case "${_SYSTEM}" in
		Darwin)
			if ! test -d node && ! git clone https://github.com/joyent/node.git; then
				echo "I can't checkout node."
				echo "Please run bootstrap.sh from somewhere you have"
				echo "write access, or get rid of your 'node' directory."
				return 1
			fi
			cd node
			git checkout tags/v${_NODE_VERSION}
			./configure
			make
			if ! ${_SUDO} make install; then
				echo "Well, that sure didn't work. Failed to install node from source."
				return 2
			fi
			cd ..
			rm -rf node/
			return 0
		;;
		FreeBSD)
			if ! whitcher libexecinfo; then
				if !resolve libexecinfo; then
					echo "You're going to need libexecinfo to compile node for FreeBSD."
					echo "I'm gonna try anyway, but if it fails, go back and install it yourself."
				fi
			fi
			if ! test -d node && ! git clone https://github.com/joyent/node.git; then
				echo "I can't checkout node."
				echo "Please run bootstrap.sh from somewhere you have"
				echo "write access, or get rid of your 'node' directory."
				return 1
			fi
			cd node
			git checkout tags/v${_NODE_VERSION}
			./configure
			make
			if ! ${_SUDO} make install; then
				echo "Well, that sure didn't work. Failed to install node from source."
				return 2
			fi
			cd ..
			rm -rf node/
			return 0
		;;
		*)
			echo "How did you get here?"
			return 3
	esac
}

echo
echo "Hi, I am the FreeNAS GUI SDK bootstrapper!  I will now attempt to sniff your"
echo "system in various locations to make sure everything is in order, installing"
echo "software as necessary.  This may require sudo privileges, so be prepared for"
echo "me to ask you for your password."
echo
echo "Checking out your system..."
case "${_SYSTEM}" in
	Darwin)
		echo "Congratulations, you're on a Mac!"; echo
		;;
	FreeBSD)
		echo "You seem to be running FreeBSD.  Excellent choice."; echo
		_PKG_INSTALL="pkg install"
		;;
	Linux)
		echo "I do not judge you for running Linux."; echo
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

if whitcher python; then
	echo "Huh, no python on this system.  Let me try to install one."
	if ! resolve python; then
		echo "Can't install python interpreter on this system.  Unfortunately, all the webby"
		echo "things require python these days!  I must exit."
		exit 11
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

if [ "${_SYSTEM}" == "FreeBSD" ]; then
	if whitcher gmake; then
		if ! resolve gmake; then
			echo "Sorry, can't install gmake and I need that for FreeBSD specifically."
			echo "Please resolve this on your own and retry."
			exit 12
		fi
	fi
fi

if [ -f /usr/local/bin/node ]; then
	echo "Alien node installation detected."
	echo "Would you like me to nuke all of your previous Node.js stuff just in case"
	echo "it conflicts with the current install?  Go on, you know you want me to."
	read ans
	if [ "${ans}" == "y" -o "${ans}" == "yes" ]; then
		nuke_node_from_orbit -all
	fi
fi

if whitcher node; then
	if [ "${_SYSTEM}" == "Darwin" ]; then
		echo "You don't have macports or homebrew installed."
		echo "Now compiling nodejs from source. This will take a little while."
		if ! install_node_from_src; then
			echo "I wasn't able to install nodejs. Please do that yourself."
			exit 13
		fi
	elif [ "${_SYSTEM}" == "FreeBSD" ]; then
		echo "Now compiling nodejs from source. This will take a little while."
		if ! install_node_from_src; then
			echo "I wasn't able to install nodejs from source."
			exit 13
		fi
	fi
fi

if whitcher npm; then
	if ! resolve npm; then
		echo "I wasn't able to install npm. Please do that yourself."
		exit 14
	fi
fi

echo "Blowing away your npm cache, just in case."
try_without_root_permissions npm cache clean
npm rebuild

echo "Now installing all of the little fiddly things that node needs."
if ! try_without_root_permissions npm install -g ${_NPM_THINGS}; then
	echo "Looks like some of the npm tools didn't install.  Whoops!"
	exit 10
fi

if [ "${_HAVE_GIT}" = "yes" ]; then
	echo "OK, the dev tools look good, now checking out the sources you will need"
	echo "to develop for the FreeNAS GUI."
	if test -d .git && [ "$(basename $(pwd))" = $(basename ${_FREENAS_GUI_REPO}) ]; then
		echo "It seems this is a git repository named $(basename ${_FREENAS_GUI_REPO})."
		echo "I'm going to assume this means you already have the source. Great!"
	elif [ -d gui ]; then
		echo "Using existing gui directory. You might want to git pull"
		cd gui
	elif git clone ${_FREENAS_GUI_REPO}; then
		echo "Sources are now checked out in the `pwd`/gui directory."
		echo "cd into that directory to begin developing with the ${_FREENAS_DEV} command"
		cd gui
	else
		echo "Unable to clone the ${_FREENAS_GUI_REPO}. You will have to do this"
		echo "before you can develop for the FreeNAS 10 GUI."
		exit 8
	fi
fi


echo "Now resolving npm's installation dependencies.  This may take a moment."
npm install

echo "Congratulations, you have everything you need to develop for the FreeNAS GUI!"
echo "${_FREENAS_DEV} --help will provide basic usage instructions"
exit 0
