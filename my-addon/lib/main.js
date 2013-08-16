// Copywrite © Clayton Ward 2013
// this program is under the "MIT license"
// please see the file "license" in the source
// distribution of this software for license terms

var self = require("sdk/self");
var self1 = require("sdk/self");
var widgets = require("sdk/widget");
var widget = widgets.Widget({
  id: "mozilla-link",
  label: "Mozilla website",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    tabs.activeTab.attach({
      contentScriptFile: self.data.url("my-script.js"),  
      })
    }
});
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
cm.Item({
  label: "Edit Image",
  context: cm.SelectorContext("img"),
  contentScriptFile: [self.data.url("jquery-1.10.2.js"),
                      self.data.url("my-script.js")]

});
/*
        contentScript:
        "var canv = document.createElement('canvas');" +
        "canv.id = 'someId';" +
        "console.log(canv.id);" +
        'document.body.innerHTML = ' +
                 ' "<h1>Page matches ruleset</h1>";' +
//        "canv.width = imgSrc.width;" +
//        "canv.height = imgSrc.height;"+ 
        "document.body.appendChild(canv);" +
        "document.getElementById('someBox').appendChild(canv);"
  */
  
  
  
/*    onReady: function onReady(tab) {
    window.alert("Hello there");
    var canv = document.createElement('canvas');
    canv.id = 'someId';

    document.body.appendChild(canv); // adds the canvas to the body element
    document.getElementById('someBox').appendChild(canv); // adds the canvas to #someBox
  }*/

//tabs.open({
//    url:""
//    });
 //   openImageEditor(imgSrc);

exports.main = function() {};