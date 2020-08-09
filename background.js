"use strict"
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ monitoring_urls: [] }, function () {});

  chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    if(details.frameId==0){
      let urlData = {
        fields: {
          url: {
            stringValue: details.url,
          },
          timestamp: {
            timestampValue: new Date(details.timeStamp),
          },
        },
      };
      chrome.storage.sync.get(["monitoring_urls"], function (data) {

        if (
          data &&
          data["monitoring_urls"] &&
          data["monitoring_urls"].length &&
          data["monitoring_urls"].indexOf(new URL(details.url).origin) !== -1
        ) {
           chrome.storage.sync.get(['firebaseUrl'],(data)=>{
            let web_events_url = data?.firebaseUrl
             if(!web_events_url){
               alert("Please configure firebase URL in plugin options to log data to firebase")
             }else{
                postData(web_events_url, urlData).then((res) =>
                  console.log("posted navigation and got response", res)
                );
             }
           })
        }
      });
    }
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
