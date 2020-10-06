'use strict';

let page = document.getElementById('buttonDiv');
let existing_urls = [];

chrome.storage.sync.get(['monitoring_urls'], function(data) {
  existing_urls = data['monitoring_urls'];
  constructOptions(existing_urls);
});

document.getElementById("submitFirebase").addEventListener('click',()=>{
  const inputFirebaseUrl = document.getElementById("firebaseUrl").value;
  chrome.storage.sync.set({firebaseUrl:inputFirebaseUrl},()=>{
    loadFireBaseUrl()
  })
})

const loadFireBaseUrl = () => {
  chrome.storage.sync.get(['firebaseUrl'],(data)=>{
    if(data?.firebaseUrl){
      document.getElementById("currentFireBaseUrl").innerHTML = data.firebaseUrl;
      document.getElementById("firebaseUrl").setAttribute('style','display:none') 
      document.getElementById("submitFirebase").setAttribute('style','display:none')
    }
  })
}


const urls = [];
function constructOptions(urls) {
  loadFireBaseUrl()
  while (page.firstChild) {
    page.removeChild(page.firstChild);
  } 
  for (let item of urls) {
    let newDiv = document.createElement('div');
    newDiv.style="display: flex;justify-content: space-between;width: 80%;";
    let site = document.createElement('h4');
    let button = document.createElement('button');
    site.innerText = item;
    button.textContent = "Remove";
    button.addEventListener('click', function() {
      existing_urls = existing_urls.filter(url => url !== item);
      chrome.storage.sync.set({monitoring_urls: existing_urls}, function() {
        constructOptions(existing_urls);
      })
    });
    newDiv.appendChild(site);
    newDiv.appendChild(button);
    page.appendChild(newDiv);
  }
}
constructOptions(urls);

