/*global module:false*/
module.exports = function (grunt) {
  "use strict";
  grunt.initConfig({
    jshint: {
      options : {
        jshintrc : '.jshintrc'
      },
      all : ['tasks/**/*.js', 'test/*.js', 'Gruntfile.js']
    },
    casper: {
      options : {
        test : true
      },

      screenshots : {
        options : {
          test : false,
          'load-images' : 'no'
        },
        src : ['test/fixtures/testScreenshots.js']
      },

      pass : {
        files : {
          'tmp/casper/testPass-results.xml' : ['test/fixtures/testPass.js']
        }
      },

      parallel : {
        options : {
          parallel : true,
          concurrency: 5
        },

        src : [
          'test/fixtures/testParallel*.js'
        ]
       },

      args: {
        options: {
          test: false
        },
        files: {
          'tmp/casper/testArgs-results.xml': ['test/fixtures/testArgs.js']
        }
      },

      fail : {
        files : {
          'tmp/casper/testFail-results.xml' : ['test/fixtures/testFail.js']
        }
      },

      failFast : {
        options : {
          test : true,
          'fail-fast' : true
        },
        src : ['test/fixtures/testPass.js', 'test/fixtures/testFail.js', 'test/fixtures/testPass2.js'],
        dest : 'tmp/casper/testFailFast-results.xml'
      },

      multiple : {
        src : ['test/fixtures/testPass.js','test/fixtures/testPass2.js'],
        dest : 'tmp/multi/testResults.xml'
      },

      includes : {
        options : {
          includes : 'test/fixtures/includes/inc.js'
        },
        files : {
          'tmp/casper/testIncludes-results.xml' : ['test/fixtures/includes/testIncludes.js']
        }
      }
    },

    clean : {
      tmp : ['tmp']
    },

    nodeunit: {
      tasks: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-internal');

  /* can't pass arguments to alias tasks but we can use grunt.task.run */
  grunt.registerTask('casperargs', function() {
    var args = ['casper','args'].concat(Array.prototype.slice.call(arguments));
    grunt.log.writeln(args);
    grunt.task.run(args.join(':'));
  });

  grunt.registerTask('spawnFailure', function(){
    var options = {
      grunt: true,
      args: ['casper:fail']
    };
    var done = this.async();
    grunt.util.spawn(options, function(){done(true);});
  });

  grunt.registerTask('caspertests', [
    'clean',
    'casperargs:baz:--foo=bar',
    'casper:pass',
    'casper:multiple',
    'casper:includes',
    'casper:screenshots',
    'casper:parallel',
    'casper:failFast',
    'spawnFailure'
  ]);

  grunt.registerTask('test', ['jshint', 'caspertests', 'nodeunit']);
  grunt.registerTask('default', ['test']);

};