## @TODO

### JS/CSS
This project uses a Node/NPM app to automate development tasks for the site's JavaScript and CSS.

##### Requirements
* [Node](https://nodejs.org/en/)
    * Check if already installed: `node -v`
    * Recommended install - **NVM**
        * Allows you to install and manage multiple versions of node
        * https://github.com/creationix/nvm
        * A nice article: https://davidwalsh.name/nvm
    * Standalone install
        * https://nodejs.org/

* [Grunt](http://gruntjs.com/)
    * Check if already installed: `grunt --version`
    * To install Grunt run: `npm install -g grunt-cli`
* @TODO: (LAMPjs)

##### Installing project dependencies
* Navigate to the project `/js` directory
* Run `npm cache clean`
* Run `npm install`

##### Running Dev App
* From the project `/js` directory, run `grunt`
    * This begins a process that watches all of the `.js` & `.less` files for updates
* Each time a file is updated the appropriate `/dist` files are built and the browser is reloaded
* `Ctrl + C` will stop the grunt app

##### Editing CSS
The CSS for this site is generated using [LESS CSS](http://lesscss.org/features/).

LESS offers the advantages of variablized color/size/etc values and the ability to
nest selectors in a more intuitive way, which reduces repetition in your code. There are a host of other language features that are outlined in the [docs](http://lesscss.org/features/).

`.less` files can accept plain old CSS, as well as LESS CSS. For more information about LESS language features you may visit the [docs](http://lesscss.org/features/)
