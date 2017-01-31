/**
 * CLI code templates
 */
'use strict';

// Module dependencies
var chalk = require('chalk');

module.exports = {
// Disable linting of quote-mark consistency for this block only.
/*jshint quotmark:false */

    // CLI banner text
    banner: '___        ________   _____ ______    ________        ___   _______ \r\n' +
            '|\\  \\      |\\   __  \\ |\\   _ \\  _   \\ |\\   __  \\      \\  \\  \\   ____\\ \r\n' +
            '\\ \\  \\     \\ \\  \\|\\  \\\\ \\  \\\\\\__\\ \\  \\\\ \\  \\|\\  \\      \\  \\  \\  \\____ \r\n' +
            ' \\ \\  \\     \\ \\   __  \\\\ \\  \\\\|__| \\  \\\\ \\   ____\\ __   \\  \\  \\_____  \\ \r\n' +
            '  \\ \\  \\____ \\ \\  \\ \\  \\\\ \\  \\    \\ \\  \\\\ \\  \\___| \\  \\__\\  \\  _____\\  \\ \r\n' +
            '   \\ \\_______\\\\ \\__\\ \\__\\\\ \\__\\    \\ \\__\\\\ \\__\\     \\________\\ \\________\\\r\n' +
            '    \\|_______| \\|__|\\|__| \\|__|     \\|__| \\|__|  ' + chalk.magenta.bold('A modern JS framework for the LAMP stack'),

    // CLI help text
    cliHelp: chalk.yellow.bold('LAMPjs command line interface help\n') +
             chalk.magenta('  Important: commands must be run inside the NPM project folder of the LAMPjs project!\n') +
             '\n' +
             '  lampjs <' + chalk.italic('action') + '> <' + chalk.italic('type') + '> <' + chalk.italic('name') + '> <' + chalk.italic('path') + '>\n' +
             '\n' +
             '  <' + chalk.italic('action') + '>: create, destroy\n' +
             '  <' + chalk.italic('type') + '>:   view\n' +
             '  <' + chalk.italic('name') + '>:   [skeleton-case object name]\n' +
             '  <' + chalk.italic('path') + '>:   [/Login/, /Account/, etc.]\n' +
             '\n' +
             chalk.yellow.bold('Examples:\n') +
             '  lampjs create view test-page /Test/\n' +
             '  lampjs destroy view test-page /Test/\n',

    // PHP local framework HTMLHeadGlobal additions
    phpHtmlHeadGlobal: "$this->appendHtmlContent('<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />');\n" +
               "        $this->appendCSSFile('/css/dist/app.min.css');\n" +
               "        $this->basePageTitle = 'App';\n",

    // Route code template (for router.js)
    route: "case '@@path@@':\n" +
           "@@indent@@    view = app.@@view@@;\n" +
           "@@indent@@    break;\n",

    // View code template
    view: "/**" +
          "* @copyright 2016 InspiringApps\n" +
          "* @link http://www.inspiringapps.com\n" +
          "*\n" +
          "* @TODO\n" +
          "*\n" +
          "* @return {Object}\n" +
          "*/\n" +
          "app.@@module@@ = (function () {\n" +
          "    'use strict';\n" +
          "\n" +
          "    /***********************/\n" +
          "    /* Module dependencies */\n" +
          "    /***********************/\n" +
          "\n" +
          "\n" +
          "\n" +
          "    /**************************/\n" +
          "    /* Private module methods */\n" +
          "    /**************************/\n" +
          "\n" +
          "\n" +
          "\n" +
          "\n" +
          "    /**************************/\n" +
          "    /* Public/Exposed methods */\n" +
          "    /**************************/\n" +
          "    return new app.View({\n" +
          "        // View hook for setting the template name\n" +
          "        templateName: '@@template@@',\n" +
          "\n" +
          "        // View hook for caching DOM selectors\n" +
          "        cacheDomSelectors: function () {\n" +
          "            // @TODO\n" +
          "        },\n" +
          "\n" +
          "        // View hook for executing post-render operations\n" +
          "        afterRender: function () {\n" +
          "            // @TODO\n" +
          "        },\n" +
          "    });\n" +
          "\n" +
          "})();\n" +
          "\n",

    // Handlebars code template
    handlebars: "{{> app-header appHeaderData}}\n" +
                "\n" +
                "<div class=\"container\">\n" +
                "    @@display@@\n" +
                "</div>\n" +
                "\n" +
                "{{> app-footer}}",

    // LESS CSS code template
    less: "/********************/\n" +
          "/* Global variables */\n" +
          "/********************/\n" +
          "\n" +
          "\n" +
          "// View styles\n" +
          ".container.@@container@@ {\n" +
          "    /*********************/\n" +
          "    /* Private variables */\n" +
          "    /*********************/\n" +
          "\n" +
          "\n" +
          "\n" +
          "    /**********/\n" +
          "    /* Styles */\n" +
          "    /**********/\n" +
          "    \n" +
          "\n" +
          "\n" +
          "}\n",

    // PHP page code template
    php: "<?php\n" +
         "require_once rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/framework/local/localBootstrap.php';\n" +
         "\n" +
         "$head = new HTMLHeadCustomer();\n" +
         "$head->display();\n" +
         "?>\n" +
         "\n" +
         "<body>\n" +
         "    <div class=\"app\">\n" +
         "        <?php include(AppBootstrap::getSiteRoot() . '/includes/loading.php'); ?>\n" +
         "    </div>\n" +
         "\n" +
         "<?php require(AppBootstrap::getSiteRoot() . '/includes/footer.php'); ?>\n" +
         "</body>\n" +
         "</html>\n",

};
