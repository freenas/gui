
This readme file provides a brief overview of the file and folder structure
included in the default MontageJS project directory.

>IMPORTANT: Be sure to replace the contents of this readme file with information
about the final application before deploying the application or passing it on to
a client.

Project Directory
============

The default project directory includes the following files and folders:

* assets/  -  Contains global stylesheets and images for the application.
* index.html  -  Is the entry-point document for the application. 
* node_modules/  -  Contains the code dependencies required in development.

    Includes Montage, the core framework, and Digit, a mobile-optimized user
    interface widget set by default. Since MontageJS uses the CommonJS module 
    system, you can leverage the npm ecosystem for additional modules. To add 
    dependencies (e.g., foo), use `npm install foo` in the project directory.
    
    NOTE: All packages in this directory must be included as dependencies 
    in package.json.

* package.json  -  Describes the application and the dependencies included in 
            the node_modules directory.
* README.md  -  The default readme file.
* run-tests.html  -  Is a page to run Jasmine tests manually in the browser.
* test/  -  Contains tests for the application.

    By default, this directory includes all.js, a module that points the test runner
    to all jasmine specs.

* ui/  -  Contains the application user interface components. 

    By default, this directory contains two components: main.reel (the Main
    user interface component) and version.reel (which displays the current
    MontageJS version).

* core/  -  Contains the core modules of the application logic.

In development, you can expand this project directory as necessary; for example,
depending on the project you may want to add the following folders:

* locale/  -  For localized content.
* scripts/  -  For JS libraries that do not support the CommonJS exports object
           and, therefore, have to be loaded using a `<script>` tag.

Unit Testing
=========

MontageJS uses some pure unit tests that are straightforward [Jasmine specs][1].

To install the test code, run `npm install` in your project folder. This installs the 
the [montage-testing][2] package, which adds some useful utilities for writing 
jasmine tests. You will need the file run-tests.html.

For an example of how we implement unit testing, see the [digit][3] repository:

* [run-tests][4] loads our test environment.
* `data-module="test/all"` inside the final script tag tells the system to load [test/all.js][5].
* all.js specifies a list of module ids for the runner to execute.

>Note that in this example, all the tests load a page in an iframe using 
`TestPageLoader.queueTest()`. These are akin to integration tests since they test 
the component in a real environment.

We also test some components by [mocking their dependencies][6].

Documentation
============

Here are some links you may find helpful:

* [API Reference][7]
* [Documentation][8]
* [FAQ][9]

Contact
======

* Got questions? Join us on [irc.freenode.net#montage][10].
* Got feedback or want to report a bug? Let us know by creating a new [Github issue][11].
* Want to contribute? [Pull-requests][12] are more than welcome.

[1]: https://github.com/montagejs/montage/blob/master/test/core/super-spec.js        "Jasmine specs"
[2]: https://github.com/montagejs/montage-testing        "montage-testing"
[3]: https://github.com/montagejs/digit        "digit"
[4]: https://github.com/montagejs/digit/blob/master/run-tests.html        "run-tests"
[5]: https://github.com/montagejs/digit/tree/master/test        "test/all.js"
[6]: https://github.com/montagejs/montage/blob/master/test/base/abstract-button-spec.js        "mocking their dependencies"
[7]: http://montagejs.org/api/        "API Reference"
[8]: http://montagejs.org/docs/        "Documentation"
[9]: http://montagejs.org/docs/faq.html        "FAQ"
[10]: http://webchat.freenode.net/?channels=montage        "irc.freenode.net#montage"
[11]: https://github.com/montagejs/montage/issues        "Github issue"
[12]: https://github.com/montagejs/montage/pulls        "Pull-requests"

Last edited: November 14, 2013

