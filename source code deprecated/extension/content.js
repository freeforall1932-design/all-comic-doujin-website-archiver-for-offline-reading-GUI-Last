var cn = 'hitomi-downloader-script';

if (window.location.hostname.includes('avgle.com')){
  var s = document.createElement('script');
  s.className = cn;
  s.src = chrome.runtime.getURL('extractors/avgle.js');
  (document.head || document.documentElement).appendChild(s);
}
