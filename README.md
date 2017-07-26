# LAMPjs

This is an experimental framework based on an existing LAMP stack for which I was asked to add a lot of JS-based functionality.

The site pages would still be loaded synchronously by the PHP. But rather than manage the HTML inside the PHP files, I've added in the Handlebars pre-compiler. In addition, I've also added lightweight JS views, LESS CSS, and dev automation through Grunt (linting, concatentating, minifying, livereload, etc).

This project contains the code for an installable CLI that automates much of the file copying, code templating, and general front-end structure within the PHP project.

*Note: This is a beta. It is meant to work with a specific PHP/Apache framework that is not publicly available.*

### Pre-requisites
* Node (recommend [NVM](https://github.com/creationix/nvm#install-script))
    * *Min 4.4.2; Tested on 6.10.0*
* NPM (comes with Node)
    * *Min 2.15.0; Tested on 3.10.10*
* Grunt/Grunt CLI
    * *Min 1.0.1/Min 1.2.0*

### Installation

##### From NPM (for use in a project)
1. From your project directory, run `npm install lampjs`
    * Or install globally with `npm install -g lampjs`

##### From GitHub (for making changes)
1. Clone this repo into a `/LAMPJS` directory
2. From the `/LAMPJS` directory, run `npm install -g`

### Usage
* `lampjs init`
    - Run from project `\js` directory to initialize a new LAMPjs project within the PHP site.
    - Creates a site template with all node_modules installed, a Grunt config, and an initial Grunt build.
    - You should be able to navigate to the local Apache URL and see the site template.
* `lampjs create view test-page /Test/`
    - Create a view named `test-page` that maps to a relative URL of `/Test/`
    - Handles all of the PHP updates, JS files, and LESS files.
* `lampjs destroy view test-page /Test/`
    - Remove a view created by the `create` command
    - Handles all of the PHP updates, JS files, and LESS files.
* `lampjs help`
    - Helpful tips and sample commands

### Development
If you make any changes to this repo locally, you will have to run `npm install -g` to see the changes in the CLI.
