// var expect = require("chai").expect;
// var request = require("request");
// var model = require("../models/model");

// var url = "http://127.0.0.1:8087";

// describe("First test", function() {
//   describe("First subtest", function() {
//     it("todo", function() {
//       var arr = ["1", "3", "2", "10"];
//       var min = model.arrayMin(arr);
//       expect(min).to.equal("1");
//     });
    
//     it("http test", function(done) {
//       request(url, function(error, response, body) {
//         expect(body).to.equal("body html");
//         done();
//       });
//     })
//   });
//   describe("Second subtest", function() {
//     it("todo2", function() {
//       var arr = ["1", "3", "2", "10"];
//       var last = model.getLastValue(arr);
//       expect(last).to.equal("10");
//     });
//   });
// });

describe('Service Worker Suite', function() {
  it('should register a service worker and cache file on install', function() {
    // 1: Register service worker.
    // 2: Wait for service worker to install.
    // 3: Check cache was performed correctly.
    return navigator.serviceWorker.register('/test/static/my-first-sw.js').then((reg) => {
        return window.__waitForSWState(reg, 'installed');
      });
  });
});