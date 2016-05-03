var webdriverio = require('webdriverio');
var should = require('should');
var xlsx = require('node-xlsx');
var Q = require('q');
var regexp = require('regexps')

var loopTest = function (driver, query) {
    return driver
      .url('http://quickbooks.intuit.com')
      .setValue("#search_term", query)
      .getValue("#search_term").then( function (e) {
        (e).should.be.equal(query);
        console.log("Query: " + e);
      })
      .submitForm("#searchSubmitButton").then( function() {
        console.log('Submit Search Form');
      })
      .waitForVisible(".search-num-results-found", 10000).then(function () {
        console.log('Result Page Found');
      })
      .getText(".search-num-results-found").then(function (link) {
        console.log('Text found: ' + link);
       (link).should.startWith("We found ");
       (link).should.endWith("results for \"" +query+ "\":");
       console.log('Text Matched');
       //"+regexp.double+" results for \"" +query+ "\":");
      });
};

// getExcelData()
var getExcelData = function(query) {
  var deferred = Q.defer();
  // turn into async call
  var xlsObject = xlsx.parse(query);
  deferred.resolve(xlsObject);
  return deferred.promise;
};

describe('Loop Test with Excel Data', function() {

  // set timeout to 20 seconds
  this.timeout(20000);

  var driver = {};

  before(function (done) {
    // check for global browser (grunt + grunt-webdriver)
    if(typeof browser === "undefined") {

    // load the driver for browser
    driver = webdriverio.remote({ desiredCapabilities: {browserName: 'chrome'} });
    driver.init(done);
  } else {
      // grunt will load the browser driver
      driver = browser;
      done();
    }
  });

  it('should process data records - sequentially', function() {
    var loop = Q();
    return getExcelData('data.xlsx').then(function(data)  {
      console.log('Records: ' + data[0].data.length);
      data[0].data.forEach(function(d) {
        loop = loop.then(function() {

          console.log('Query: ' + d[0]);

          return loopTest(driver, d[0]);
        });
      });

      return loop;
    });
  });

  // a "hook" to run after all tests in this block
  after(function(done) {
    driver.end(done);
  });
});
