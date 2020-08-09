'use strict';

let monitorButton = document.getElementById('monitorButton');

monitorButton.onclick = function(element) {
  let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let url = new URL(tabs[0].url);
        chrome.storage.sync.get(['monitoring_urls'], function(data) {
          let existing_urls = data['monitoring_urls'];
          if(existing_urls.indexOf(url.origin) == -1){
            chrome.storage.sync.set({monitoring_urls: [...existing_urls,url.origin]}, function() {
              alert("Now Monitoring "+[...existing_urls,url.origin])
            })
          }else{
            alert("Already Monitoring "+url.origin)
          }
        });      
  });
};
