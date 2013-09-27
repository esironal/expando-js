module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    coffee:{
      coffee: {
        options: {
          join: true
        },
        files: {
          'expando.js': ['expando/*.coffee'],
        }
      }
    }
  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-coffee');
  // Define your tasks here

};