
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    webdriver: {
      test: {
        configFile: 'wdio.conf-excelData.js'
      }
    }
  });

grunt.loadNpmTasks('grunt-webdriver');
// Default task(s).
grunt.registerTask('default', ['webdriver']);
};
