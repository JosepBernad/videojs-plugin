let playerWidth = Math.ceil(window.screen.width * 0.6);

let playerHtml = '' +
  '<video id="player"' +
  '       class="video-js vjs-default-skin vjs-big-play-centered"' +
  '       width="' + playerWidth + '"' +
  '       height="' + 531 + '"' +
  '       controls' +
  '       preload="auto"' +
  '       poster="/img/video-poster.png"' +
  '       data-setup=\'{}\'>' +
  '  <source src="/sintel.mp4" type=\'video/mp4\'>' +
  '<!-- <source src="http://cdn.s1.eu.nice264.com/converted_work6/0082c06e504b0a422bf1_6815f2deeb179c29748af42f8cd5ce95.mp4" type=\'video/mp4\'>-->' +
  '<!-- <source src="http://cdn.s2.eu.nice264.com/converted_work6/0082c06e504b0a422bf1_6815f2deeb179c29748af42f8cd5ce95.mp4" type=\'video/mp4\'>-->' +
  '  <p class="vjs-no-js">' +
  '    To view this video please enable JavaScript, and consider upgrading to a web browser' +
  '    that <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>' +
  '  </p>' +
  '</video>'

document.querySelector('#player-placeholder').innerHTML = playerHtml;

const TEST_USER_ID = 1234;
const TEST_CONTENT_ID = 5678;

videojs.plugin('testPlugin', testPlugin);

let player = videojs('player');

player.testPlugin({
  userId: TEST_USER_ID,
  contentId: TEST_CONTENT_ID
});

