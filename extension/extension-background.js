(function () {

  WebExtension = (typeof browser !== 'undefined') ? browser : chrome;

  var C = {
    'tabIds': []
  };

  document.addEventListener('DOMContentLoaded', 

    function()
    {

      function injectResources(tabId, files) {
        var getFileExtension = /(?:\.([^.]+))?$/;

        //helper function that returns appropriate Browser.api.tabs function to load resource
        var loadFunctionForExtension = (ext) => {
          switch(ext) {
            case 'js' : return WebExtension.tabs.executeScript;
            case 'css' : return WebExtension.tabs.insertCSS;
            default: throw new Error('Unsupported resource type')
          }
        };

        return Promise.all(tabId, files.map(resource => new Promise((resolve, reject) => {
            var ext = getFileExtension.exec(resource)[1];
            var loadFunction = loadFunctionForExtension(ext);

            loadFunction(tabId, {file: resource}, () => {
                if (WebExtension.runtime.lastError) {
                    reject(WebExtension.runtime.lastError);
                } else {
                    resolve();
                }
            });
            
        })));
      }



      function dokieliInit(tab) 
      {
        injectResources(tab.id, [ "media/css/do.css"]).then(() => {
        }).catch(err => {
           console.log('Error occurred: '+err);
        });
      }

      function showDocumentMenu(tab)
      {
        WebExtension.tabs.sendMessage(tab.id, {action: "dokieli.showDocumentMenu"}, function(r){
          if(C.tabIds.indexOf(tab.id) < 0) {
            C.tabIds.push(tab.id);
          }
        });
      }


      WebExtension.browserAction.onClicked.addListener(
         function(tab) 
         {
           WebExtension.tabs.sendMessage(tab.id, {action: "dokieli.status"}, 
             function(response) {
               if (response && !response.dokieli)
                 dokieliInit(tab);
               showDocumentMenu(tab);
           });  
         }); 

    });

})();

