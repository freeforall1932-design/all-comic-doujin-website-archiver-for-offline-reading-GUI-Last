function timeout(){
  var cn = 'hitomi-downloader-script';
  var s = document.getElementsByClassName(cn)[0];
  const arr = [];
  try {
    var player = videojs('video-player');
    const segments = player.tech_.hls.playlists.media_.segments;
    segments.forEach(x => arr.push({ uri: x.resolvedUri, method: "HEAD", timeout: 50 }));
    arr.forEach(x => x.uri = videojs.Hls.xhr(x, function(){}).uri);
  } catch (e) {
    //console.log(e);
    return;
  }
  if (arr.length <= 0){
    console.log('empty arr');
    return;
  }
  var segs = arr.map(x => x.uri);
  var data = btoa(JSON.stringify(segs));
  s.setAttribute('data', data);
  s.setAttribute('url', decodeURIComponent(document.URL));
  clearInterval(t);
}
var t = setInterval(timeout, 1000);
