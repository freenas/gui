Tools
=====

Tool: `generate`
-----

Allows to automate some operation such as generating descriptors files.


Usage:

	node generate [options] [command]

e.g,

	$ generate help descriptors
	$ generate descriptors
	$ generate descriptors -t descriptors -u root -p freenas


Run `generate --help` for details 

```bash
Usage: generate|desc [options] [command]


  Commands:

    descriptors   generate descriptor files from the middleware schemas
    help [cmd]    display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```


Command: `generate descriptors`
-----

Creates the `descriptors.mjson` files from the schemas from the FreeNAS middleware.
The `descriptors.mjson` files will be created in your current working directory if you don't specify a folder target.

Usage:

	node generate-descriptors [-vs] [-t <descriptor-dir>] [-u <username>] [-p <password>] [--H <host>] [--P <port>]

e.g,

	$ generate-descriptors -t descriptors
	$ generate-descriptors -t descriptors -u root -p freenas


Run `generate-descriptors --help` for details 

```bash
Usage: generate-descriptors [options]

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -u, --username [username]  username that will be used to establish a connection with the middleware
    -p, --password [password]  password that will be used to establish a connection with the middleware
    -H, --host <host>          host that will be used to establish a connection with the middleware
    -P, --port <port>          port that will be used to establish a connection with the middleware
    -v, --verbose              enable the verbose mode
    -s, --secure               establish a secure connection with the middleware
    -t, --target <target>      changes the default target directory
```

`-t` or `--target` changes the default target directory.
The default directory is your current working directory.

`-u` or `--username` the username that will be used to establish a connection with the middleware.
If this option is omitted you will be prompted to enter the username.

`-p` or `--password` the password that will be used to establish a connection with the middleware.
If this option is omitted you will be prompted to enter the password.

`-H` or `--host` the host that will be used to establish a connection with the middleware.
The default value is `freenas.local`.

`-P` or `--port` the port that will be used to establish a connection with the middleware.
The default value is `5000`.

`-v` or `--verbose` enable the verbose mode.

`-s` or `--secure` establish a secure connection with the middleware.
