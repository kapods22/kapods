// Where Are the Chickadee Brothers? feed can't have cache control
// Make show note min-height bigger

let items;
let CAEpInfo = [];
let KAEpInfo = [];
let AFEpInfo = [];
let ACBEpInfo = [];
let startedFetchRSS = false;
let endedFetchRSS = false;
let interval;
/* Episode info properties:
 * - title: Title of the episode | String | Tag: <title>
 * - shortPodcast: Podcast acronym | String | Local Variable: podcast
 * - longPodcast: Podcast name | String
 * - webpage: Link to the episode page | String | Tag: <link>
 * - epNum: Episode number | Number | Tag: <itunes:episode>
 * - seNum: Season number | Number | Tag: <itunes:season>
 * - type: Episode type (full, bonus, or trailer) | String | Tag: <itunes:episodeType>
 * - showNotes: Episode show notes | String with HTML tags | Tag: <description>
 * - date: Episode release date | String | Tag: <pubDate>
 * - audioSrc: Episode audio url | String | Tag Attribute: <enclosure url>
 * - length: Duration of the episode | String | Tag: <itunes:duration>
 * - art: Episode cover art url | String | Tag Attribute: <itunes:image href>
 * - guid: Episode guid | String | Tag: <guid>
*/

function awaitFetchRSS(nextFunct) {
  interval = setInterval(() => checkFeedStatus(nextFunct), 1);
}

function updateMetadata(title, artist, album, artwork) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: title,
    artist: artist,
    album: album,
    artwork: [{
      src: artwork
    }]
  });
}

function checkFeedStatus(nextFunct) {
  if (endedFetchRSS) {
    nextFunct();
    clearInterval(interval);
  }
}

function findEpisode(podcast, guid) {
  let episodes = epInfo(podcast);
