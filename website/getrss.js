let items;
let CAEpInfo = [];
let KAEpInfo = [];
let AFEpInfo = [];
let ACBEpInfo = [];
/* Episode info properties:
 * - title: Title of the episode | String | Tag: <title>
 * - podcast: Podcast acronym | String | Local Variable: podcast
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

// Find an episode

function findEpisode(episodes, guid) {
  // The variable 'episodes' will be the array of episode info objects for the podcast the episode is of, and 'guid' will be the guid of the episode
  // Search through the array
  for (let i = 0; i < episodes.length; i++) {
    // Check if the episode info object is that of the desired episode.
    if (episodes[i].guid == guid) {
      return episodes[i];
    }
  }
}

function CASeason(season) {
  // The variable 'season' will be the season number
  let seasonEpInfo = [];
  // Filter CAEpInfo for episodes of the desired season
  for (let i = 0; i < CAEpInfo.length; i++) {
    if (CAEpInfo[i].seNum == season) {
      seasonEpInfo.push(CAEpInfo[i]);
    }
  }
  return seasonEpInfo;
}

function buttonUrl(text, showNotes) {
  const showNotesCode = new window.DOMParser().parseFromString(showNotes, "text/html");
  let aArray = showNotesCode.querySelectorAll("a");
  for (let i = 0; i < aArray.length; i++) {
    if (aArray[i].innerHTML == text) {
      return aArray[i].href;
    }
  }
}

// Generate and insert the HTML code for an episode's audio player
function createAudioPlayer(podcast, guid) {
  const audioPlayerContainer = document.getElementById("audio-player-container");
  audioPlayerContainer.innnerHTML = "";
  // The HTML code
  let htmlCode = `<div class="ka-audio-player">
          <div class="pause-play buttons">
            <button class="play-one button" id="playOne" onclick="playAud(this);" type="button">
              <img src="https://assets.jwwb.nl/assets/img/icons/play-button.svg" width="10px" class="icon">
            </button>
            <button class="pause-one button" id="pauseOne" onclick="pauseAud(this);" type="button" hidden="hidden">
              <img src="https://assets.jwwb.nl/assets/img/icons/pause-symbol.svg" width="10px" class="icon">
            </button>
          </div>
          <div class="current-time time"><span class="mins">00</span>:<span class="secs">00</span></div>&nbsp;<input type="range" class="seek-bar-one custom-slider" id="seekBarOne" min="0" max="${episode.length}" step="0.00001" value="0" oninput="seekOne(this)">&nbsp;<div class="remaining-time time">-${minsAndSecs(episode.length).fullTime}</div>
          <div class="mute-buttons buttons">
            <button class="mute-one button" id="muteOne" onclick="mute(this);">
              <img src="https://assets.jwwb.nl/assets/img/icons/volume-up-interface-symbol.svg" width="15px" class="mute-icon icon">
            </button>
            <button class="unmute-one button" id="unmuteOne" onclick="unMute(this);" hidden>
              <img src="https://assets.jwwb.nl/assets/img/icons/volume-off.svg" width="11px" class="icon">
            </button>
          </div>
          <input type="range" class="volume-slider-one custom-slider" min="0" max="1" step="0.001" value="" id="volumeSliderOne" oninput="changeVolume(this)">&nbsp;&nbsp;<div class="playback-speed buttons">
            <button id="fastSpeedOne" class="fast-one button" onclick="fastSpeedOne(this);">1x</button>
            <button id="slowSpeedOne" class="slow-one button" onclick="slowSpeedOne(this);" hidden="hidden">2x</button>
            <button id="normalSpeedOne" class="normal-one button" onclick="normalSpeedOne(this);" hidden="hidden">0.5x</button>
          </div>
          <p id="duration"></p>
          <br>
          <audio id="audio" preload="none" title="" src="${findEpisode(podcast, guid).audioSrc}" onloadedmetadata="setInterval(() => update(this), 1);" onplay="switchButtons(this, 1, 'playback', true);" onpause="switchButtons(this, 1, 'playback', false);" onended="switchButtons(this, 1, 'playback', false); playAud(document.querySelector('.s1e1 #audio'));"></audio>
        </div>`;
    audioPlayerContainer.innerHTML = htmlCode;
}

// Generate and insert the HTML code for the episodes of an entire podcast
function displayAllEpisodes(episodes) {
  // The variable 'episodes' will be the array of episode info objects for the podcast, season, miniseries, etc.
  const episodeContainer = document.getElementById("episode-container");

  if (episodes.length != 0) {
    episodeContainer.innerHTML = "";
    
    for (let i = 0; i < episodes.length; i++) {
      let episodeClass;
      const episode = episodes[i];
      let nextPlay = () => {
        if (i + 1 != episodes.length && episode.podcast == "CA") {
          return ` playAud(document.querySelectorAll('.play-one')[${i + 1}]);`;
        } else if (i > 0) {
          return ` playAud(document.querySelectorAll('.play-one')[${i - 1}]);`;
        } else {
          return "";
        }
      };
      // Set the episode's class name
      if (episode.seNum != undefined) {
        episodeClass = `s${episode.seNum}-`;
        if (episode.type == "trailer") {
          episodeClass += "trailer";
        }
      }
      if (episode.epNum != undefined) {
        episodeClass += `e${episode.epNum}`;
      } else if (!episode.seNum || episode.seNum && episode.type != "trailer") {
        episodeClass += episode.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-");
      }
      episodeClass = episodeClass.replace("undefined", "");
      // The HTML code
      let htmlCode = `<div id="podcast-episode" class="${episodeClass}">
          <div id="episode-art" width="18.2%">
            <a href="${episode.webpage}" target="_self">
              <img class="episode-art" src="${episode.art}">
            </a>
        </div>
          <div id="details-and-player">
            <div id="episode-title">
              <h3>${episode.title}</h3>
              <p>${minsAndSecs(episode.length).fullTime} | ${episode.date}</p>
            </div>
            <div id="show-notes">
              <div class="
                jw-element-accordion
                jw-element-accordion--style-border
                jw-element-accordion--align-icon-right
                ">
                <details class="jw-element-accordion__item">
                  <summary class="
                    jw-element-accordion__heading
                    jw-element-accordion__heading--icon-triangle
                    ">
                    <i class="
                      jw-element-accordion__icon
                      website-rendering-icon-right-open
                      "></i>
                    <h3>Show notes</h3>
                  </summary>
                  <div class="jw-element-accordion__content">
                    ${episode.showNotes}
                  </div>
                </details>
              </div>
            </div>
            <div class="ka-audio-player">
              <div class="pause-play buttons">
                <button class="play-one button" id="playOne" onclick="playAud(this);" type="button">
                  <img src="https://assets.jwwb.nl/assets/img/icons/play-button.svg" width="10px" class="icon">
                </button>
                <button class="pause-one button" id="pauseOne" onclick="pauseAud(this);" type="button" hidden="hidden">
                  <img src="https://assets.jwwb.nl/assets/img/icons/pause-symbol.svg" width="10px" class="icon">
                </button>
              </div>
              <div class="current-time time"><span class="mins">00</span>:<span class="secs">00</span></div>&nbsp;<input type="range" class="seek-bar-one custom-slider" id="seekBarOne" min="0" max="${episode.length}" step="0.00001" value="0" oninput="seekOne(this)">&nbsp;<div class="remaining-time time">-${minsAndSecs(episode.length).fullTime}</div>
              <div class="mute-buttons buttons">
                <button class="mute-one button" id="muteOne" onclick="mute(this);">
                  <img src="https://assets.jwwb.nl/assets/img/icons/volume-up-interface-symbol.svg" width="15px" class="mute-icon icon">
                </button>
                <button class="unmute-one button" id="unmuteOne" onclick="unMute(this);" hidden>
                  <img src="https://assets.jwwb.nl/assets/img/icons/volume-off.svg" width="11px" class="icon">
                </button>
              </div>
              <input type="range" class="volume-slider-one custom-slider" min="0" max="1" step="0.001" value="" id="volumeSliderOne" oninput="changeVolume(this)"> &nbsp;&nbsp; <div class="playback-speed buttons">
                <button id="fastSpeedOne" class="fast-one button" onclick="fastSpeedOne(this);">1x</button>
                <button id="slowSpeedOne" class="slow-one button" onclick="slowSpeedOne(this);" hidden="hidden">2x</button>
                <button id="normalSpeedOne" class="normal-one button" onclick="normalSpeedOne(this);" hidden="hidden">0.5x</button>
              </div>
              <p id="duration"></p>
              <br>
              <audio id="audio" preload="none" title="" src="${episode.audioSrc}" onloadedmetadata="setInterval(() => update(this), 1);" onplay="switchButtons(this, 1, 'playback', true);" onpause="switchButtons(this, 1, 'playback', false);" onended="switchButtons(this, 1, 'playback', false);${nextPlay()}"></audio>
            </div>
          </div>`;
      // Adding episode buttons
      if (episode.podcast == "CA") {
        let hasScriptClass = "";
        let scriptUrl = buttonUrl("here", episode.showNotes);
        if (!scriptUrl) {
          hasScriptClass = " unlinked-button";
          scriptUrl = "";
        }
        htmlCode += `
          <div id="episode-buttons">
            <div class="button">
              <a href="${scriptUrl}" target="_blank">
                <button class="episode-button${hasScriptClass}">
                  <span class="episode-button-icon-container">
                    <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                      <g>
                        <g>
                          <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>t <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>t <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                          <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                          <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                          <path d="M319.77,292.355h-201c-2.663,0-4.853,0.855-6.567,2.566c-1.709,1.711-2.568,3.901-2.568,6.563v18.274 c0,2.67,0.856,4.859,2.568,6.57c1.715,1.711,3.905,2.567,6.567,2.567h201c2.663,0,4.854-0.856,6.564-2.567s2.566-3.9,2.566-6.57 v-18.274c0-2.662-0.855-4.853-2.566-6.563C324.619,293.214,322.429,292.355,319.77,292.355z"></path>
                          <path d="M112.202,221.831c-1.709,1.712-2.568,3.901-2.568,6.571v18.271c0,2.666,0.856,4.856,2.568,6.567 c1.715,1.711,3.905,2.566,6.567,2.566h201c2.663,0,4.854-0.855,6.564-2.566s2.566-3.901,2.566-6.567v-18.271 c0-2.663-0.855-4.854-2.566-6.571c-1.715-1.709-3.905-2.564-6.564-2.564h-201C116.107,219.267,113.917,220.122,112.202,221.831z"></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>Ep Script</span>
                </button>
              </a>
            </div>
            <div class="middle button">
              <a href="${episode.webpage}" target="_self" rel="noopener">
                <button class="episode-button">
                  <span class="episode-button-icon-container">
                    <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">
                      <g>
                        <g>
                          <path d="M392.857,292.354h-18.274c-2.669,0-4.859,0.855-6.563,2.573c-1.718,1.708-2.573,3.897-2.573,6.563v91.361 c0,12.563-4.47,23.315-13.415,32.262c-8.945,8.945-19.701,13.414-32.264,13.414H82.224c-12.562,0-23.317-4.469-32.264-13.414 c-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562,4.471-23.313,13.417-32.259c8.947-8.947,19.702-13.418,32.264-13.418 h200.994c2.669,0,4.859-0.859,6.57-2.57c1.711-1.713,2.566-3.9,2.566-6.567V82.221c0-2.662-0.855-4.853-2.566-6.563 c-1.711-1.713-3.901-2.568-6.57-2.568H82.224c-22.648,0-42.016,8.042-58.102,24.125C8.042,113.297,0,132.665,0,155.313v237.542 c0,22.647,8.042,42.018,24.123,58.095c16.086,16.084,35.454,24.13,58.102,24.13h237.543c22.647,0,42.017-8.046,58.101-24.13 c16.085-16.077,24.127-35.447,24.127-58.095v-91.358c0-2.669-0.856-4.859-2.574-6.57 C397.709,293.209,395.519,292.354,392.857,292.354z"></path>
                          <path d="M506.199,41.971c-3.617-3.617-7.905-5.424-12.85-5.424H347.171c-4.948,0-9.233,1.807-12.847,5.424 c-3.617,3.615-5.428,7.898-5.428,12.847s1.811,9.233,5.428,12.85l50.247,50.248L198.424,304.067 c-1.906,1.903-2.856,4.093-2.856,6.563c0,2.479,0.953,4.668,2.856,6.571l32.548,32.544c1.903,1.903,4.093,2.852,6.567,2.852 s4.665-0.948,6.567-2.852l186.148-186.148l50.251,50.248c3.614,3.617,7.898,5.426,12.847,5.426s9.233-1.809,12.851-5.426 c3.617-3.616,5.424-7.898,5.424-12.847V54.818C511.626,49.866,509.813,45.586,506.199,41.971z"></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>Ep Page</span>
                </button>
              </a>
            </div>`;
      } else if (episode.miniseries == "Animalia Fake!") {
        htmlCode += `
        <div id="episode-buttons">
          <div class="button">
            <a href="${buttonUrl("Official Episode Scoresheet", episode.showNotes)}" target="_blank">
              <button class="episode-button">
                <span class="episode-button-icon-container">
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="511.63px" height="511.631px" viewBox="0 0 511.63 511.631" style="enable-background:new 0 0 511.63 511.631;" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M493.356,347.177H18.274c-4.952,0-9.233,1.811-12.851,5.425C1.809,356.215,0,360.506,0,365.455v73.083 c0,4.942,1.809,9.233,5.424,12.847c3.621,3.614,7.904,5.428,12.851,5.428h475.082c4.944,0,9.232-1.813,12.85-5.428 c3.614-3.613,5.425-7.904,5.425-12.847v-73.083c0-4.949-1.811-9.24-5.425-12.854C502.588,348.987,498.3,347.177,493.356,347.177z M475.084,420.271H292.369v-36.548h182.723v36.548H475.084z"></path>
                        <path d="M493.356,201H18.274c-4.952,0-9.233,1.809-12.851,5.426C1.809,210.041,0,214.324,0,219.271v73.087 c0,4.948,1.809,9.233,5.424,12.847c3.621,3.614,7.904,5.428,12.851,5.428h475.082c4.944,0,9.232-1.813,12.85-5.428 c3.614-3.613,5.425-7.898,5.425-12.847v-73.087c0-4.947-1.811-9.229-5.425-12.845C502.588,202.808,498.3,201,493.356,201z M475.078,274.09h-292.35v-36.543h292.35V274.09z"></path>
                        <path d="M506.206,60.243c-3.617-3.612-7.905-5.424-12.85-5.424H18.274c-4.952,0-9.233,1.812-12.851,5.424 C1.809,63.86,0,68.145,0,73.093v73.085c0,4.952,1.809,9.235,5.424,12.85c3.621,3.617,7.904,5.424,12.851,5.424h475.082 c4.944,0,9.232-1.807,12.85-5.424c3.614-3.615,5.425-7.898,5.425-12.85V73.093C511.63,68.145,509.82,63.863,506.206,60.243z M475.078,127.911H365.449V91.364h109.629V127.911z"></path>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Scoresheet</span>
              </button>
            </a>
          </div>
          <div class="middle button">
            <a href="${episode.webpage}" target="_self" rel="noopener">
              <button class="episode-button">
                <span class="episode-button-icon-container">
                  <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M392.857,292.354h-18.274c-2.669,0-4.859,0.855-6.563,2.573c-1.718,1.708-2.573,3.897-2.573,6.563v91.361 c0,12.563-4.47,23.315-13.415,32.262c-8.945,8.945-19.701,13.414-32.264,13.414H82.224c-12.562,0-23.317-4.469-32.264-13.414 c-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562,4.471-23.313,13.417-32.259c8.947-8.947,19.702-13.418,32.264-13.418 h200.994c2.669,0,4.859-0.859,6.57-2.57c1.711-1.713,2.566-3.9,2.566-6.567V82.221c0-2.662-0.855-4.853-2.566-6.563 c-1.711-1.713-3.901-2.568-6.57-2.568H82.224c-22.648,0-42.016,8.042-58.102,24.125C8.042,113.297,0,132.665,0,155.313v237.542 c0,22.647,8.042,42.018,24.123,58.095c16.086,16.084,35.454,24.13,58.102,24.13h237.543c22.647,0,42.017-8.046,58.101-24.13 c16.085-16.077,24.127-35.447,24.127-58.095v-91.358c0-2.669-0.856-4.859-2.574-6.57 C397.709,293.209,395.519,292.354,392.857,292.354z"></path>
                        <path d="M506.199,41.971c-3.617-3.617-7.905-5.424-12.85-5.424H347.171c-4.948,0-9.233,1.807-12.847,5.424 c-3.617,3.615-5.428,7.898-5.428,12.847s1.811,9.233,5.428,12.85l50.247,50.248L198.424,304.067 c-1.906,1.903-2.856,4.093-2.856,6.563c0,2.479,0.953,4.668,2.856,6.571l32.548,32.544c1.903,1.903,4.093,2.852,6.567,2.852 s4.665-0.948,6.567-2.852l186.148-186.148l50.251,50.248c3.614,3.617,7.898,5.426,12.847,5.426s9.233-1.809,12.851-5.426 c3.617-3.616,5.424-7.898,5.424-12.847V54.818C511.626,49.866,509.813,45.586,506.199,41.971z"></path>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Ep Page</span>
              </button>
            </a>
          </div>`;
      } else if (episode.podcast == "KA") {
        let hasComicClass = "";
        let comicUrl = buttonUrl("Comic", episode.showNotes);
        if (!comicUrl) {
          hasComicClass = " unlinked-button";
          comicUrl = "";
        }
        let hasQuizClass = "";
        let quizUrl = buttonUrl("Memory Quiz", episode.showNotes);
        if (!quizUrl) {
          hasQuizClass = " unlinked-button";
          quizUrl = "";
        }
        htmlCode += `
        <div id="episode-buttons">
          <div class="button">
            <a href="${comicUrl}" target="_self">
              <button class="episode-button${hasComicClass}">
                <span class="episode-button-icon-container">
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="548.176px" height="548.176px" viewBox="0 0 548.176 548.176" style="enable-background:new 0 0 548.176 548.176" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M534.75,68.238c-8.945-8.945-19.694-13.417-32.261-13.417H45.681c-12.562,0-23.313,4.471-32.264,13.417 C4.471,77.185,0,87.936,0,100.499v347.173c0,12.566,4.471,23.318,13.417,32.264c8.951,8.946,19.702,13.419,32.264,13.419h456.815 c12.56,0,23.312-4.473,32.258-13.419c8.945-8.945,13.422-19.697,13.422-32.264V100.499 C548.176,87.936,543.699,77.185,534.75,68.238z M511.623,447.672c0,2.478-0.899,4.613-2.707,6.427 c-1.81,1.8-3.952,2.703-6.427,2.703H45.681c-2.473,0-4.615-0.903-6.423-2.703c-1.807-1.813-2.712-3.949-2.712-6.427V100.495 c0-2.474,0.902-4.611,2.712-6.423c1.809-1.803,3.951-2.708,6.423-2.708h456.815c2.471,0,4.613,0.905,6.42,2.708 c1.801,1.812,2.707,3.949,2.707,6.423V447.672L511.623,447.672z"></path>
                        <path d="M127.91,237.541c15.229,0,28.171-5.327,38.831-15.987c10.657-10.66,15.987-23.601,15.987-38.826 c0-15.23-5.333-28.171-15.987-38.832c-10.66-10.656-23.603-15.986-38.831-15.986c-15.227,0-28.168,5.33-38.828,15.986 c-10.656,10.66-15.986,23.601-15.986,38.832c0,15.225,5.327,28.169,15.986,38.826C99.742,232.211,112.683,237.541,127.91,237.541z"></path>
                        <polygon points="210.134,319.765 164.452,274.088 73.092,365.447 73.092,420.267 475.085,420.267 475.085,292.36 356.315,173.587"></polygon>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Ep comic</span>
              </button>
            </a>
          </div>
          <div class="middle button">
            <a href="${quizUrl}" target="_blank">
              <button class="episode-button${hasQuizClass}">
                <span class="episode-button-icon-container">
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="438.533px" height="438.533px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                    <g>
                      <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M255.82,356.309c0,2.662-0.862,4.853-2.573,6.563 c-1.704,1.711-3.895,2.567-6.557,2.567h-54.823c-2.664,0-4.854-0.856-6.567-2.567c-1.714-1.711-2.57-3.901-2.57-6.563v-54.823 c0-2.662,0.855-4.853,2.57-6.563c1.713-1.708,3.903-2.563,6.567-2.563h54.823c2.662,0,4.853,0.855,6.557,2.563 c1.711,1.711,2.573,3.901,2.573,6.563V356.309z M325.338,187.574c-2.382,7.043-5.044,12.804-7.994,17.275 c-2.949,4.473-7.187,9.042-12.709,13.703c-5.51,4.663-9.891,7.996-13.135,9.998c-3.23,1.995-7.898,4.713-13.982,8.135 c-6.283,3.613-11.465,8.326-15.555,14.134c-4.093,5.804-6.139,10.513-6.139,14.126c0,2.67-0.862,4.859-2.574,6.571 c-1.707,1.711-3.897,2.566-6.56,2.566h-54.82c-2.664,0-4.854-0.855-6.567-2.566c-1.715-1.712-2.568-3.901-2.568-6.571v-10.279 c0-12.752,4.993-24.701,14.987-35.832c9.994-11.136,20.986-19.368,32.979-24.698c9.13-4.186,15.604-8.47,19.41-12.847 c3.812-4.377,5.715-10.188,5.715-17.417c0-6.283-3.572-11.897-10.711-16.849c-7.139-4.947-15.27-7.421-24.409-7.421 c-9.9,0-18.082,2.285-24.555,6.855c-6.283,4.565-14.465,13.322-24.554,26.263c-1.713,2.286-4.093,3.431-7.139,3.431 c-2.284,0-4.093-0.57-5.424-1.709L121.35,145.89c-4.377-3.427-5.138-7.422-2.286-11.991 c24.366-40.542,59.672-60.813,105.922-60.813c16.563,0,32.744,3.903,48.541,11.708c15.796,7.801,28.979,18.842,39.546,33.119 c10.554,14.272,15.845,29.787,15.845,46.537C328.904,172.824,327.71,180.529,325.338,187.574z"></path>
                    </g>
                  </svg>
                </span>
                <span>Memory Quiz</span>
              </button>
            </a>
          </div>`;
      }
      htmlCode += `
            <div class="button">
              <a href="${episode.audioSrc}" target="_blank" rel="noopener">
                <button class="episode-button">
                  <span class="episode-button-icon-container">
                    <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                      <g>
                        <g>
                          <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M353.742,297.208c-13.894,23.791-32.736,42.633-56.527,56.534 c-23.791,13.894-49.771,20.834-77.945,20.834c-28.167,0-54.149-6.94-77.943-20.834c-23.791-13.901-42.633-32.743-56.527-56.534 c-13.897-23.791-20.843-49.772-20.843-77.941c0-28.171,6.949-54.152,20.843-77.943c13.891-23.791,32.738-42.637,56.527-56.53 c23.791-13.895,49.772-20.84,77.943-20.84c28.173,0,54.154,6.945,77.945,20.84c23.791,13.894,42.634,32.739,56.527,56.53 c13.895,23.791,20.838,49.772,20.838,77.943C374.58,247.436,367.637,273.417,353.742,297.208z"></path>
                          <path d="M310.633,219.267H255.82V118.763c0-2.666-0.862-4.853-2.573-6.567c-1.704-1.709-3.895-2.568-6.557-2.568h-54.823 c-2.664,0-4.854,0.859-6.567,2.568c-1.714,1.715-2.57,3.901-2.57,6.567v100.5h-54.819c-4.186,0-7.042,1.905-8.566,5.709 c-1.524,3.621-0.854,6.947,1.999,9.996l91.363,91.361c2.096,1.711,4.283,2.567,6.567,2.567c2.281,0,4.471-0.856,6.569-2.567 l91.077-91.073c1.902-2.283,2.851-4.576,2.851-6.852c0-2.662-0.855-4.853-2.573-6.57 C315.489,220.122,313.299,219.267,310.633,219.267z"></path>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <span>Download</span>
                </button>
              </a>
            </div>
          </div>
      </div>
      <br>`;
      episodeContainer.innerHTML += htmlCode;
    }
  }
}

function displayOneEpisode(episodes) {
  // The variable 'episodes' will be the array of episode info objects containing the episode.
  const episodeContainer = document.getElementById("episode-container");

  if (episodes.length != 0) {
    episodeContainer.innerHTML = "";
    let i;

    if (episodes == CAEpInfo) {
      i = episodes.length - 1;
    } else {
      i = 0;
    }

    let episodeClass;
    const episode = episodes[i];
    let nextPlay = () => {
      if (i + 1 != episodes.length && episode.podcast == "CA") {
        return ` playAud(document.querySelectorAll('.play-one')[${i + 1}]);`;
      } else if (i > 0) {
        return ` playAud(document.querySelectorAll('.play-one')[${i - 1}]);`;
      } else {
        return "";
      }
    };
    // Set the episode's class name
    if (episode.seNum) {
      episodeClass = `s${episode.seNum}-`;
      if (episode.type == "trailer") {
        episodeClass += "trailer";
      }
    }
    if (episode.epNum) {
      episodeClass += `e${episode.epNum}`;
    } else if (!episode.seNum || episode.seNum && episode.type != "trailer") {
      episodeClass += episode.title.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s/g, "-");
    }
    episodeClass = episodeClass.replace("undefined", "");
    // The HTML code
    let htmlCode = `<div id="podcast-episode" class="${episodeClass}">
        <div id="episode-art" width="18.2%">
          <a href="${episode.webpage}" target="_self">
            <img class="episode-art" src="${episode.art}">
          </a>
      </div>
        <div id="details-and-player">
          <div id="episode-title">
            <h3>${episode.title}</h3>
            <p>${minsAndSecs(episode.length).fullTime} | ${episode.date}</p>
          </div>
          <div id="show-notes">
            <div class="
              jw-element-accordion
              jw-element-accordion--style-border
              jw-element-accordion--align-icon-right
              ">
              <details class="jw-element-accordion__item">
                <summary class="
                  jw-element-accordion__heading
                  jw-element-accordion__heading--icon-triangle
                  ">
                  <i class="
                    jw-element-accordion__icon
                    website-rendering-icon-right-open
                    "></i>
                  <h3>Show notes</h3>
                </summary>
                <div class="jw-element-accordion__content">
                  ${episode.showNotes}
                </div>
              </details>
            </div>
          </div>
          <div class="ka-audio-player">
            <div class="pause-play buttons">
              <button class="play-one button" id="playOne" onclick="playAud(this);" type="button">
                <img src="https://assets.jwwb.nl/assets/img/icons/play-button.svg" width="10px" class="icon">
              </button>
              <button class="pause-one button" id="pauseOne" onclick="pauseAud(this);" type="button" hidden="hidden">
                <img src="https://assets.jwwb.nl/assets/img/icons/pause-symbol.svg" width="10px" class="icon">
              </button>
            </div>
            <div class="current-time time"><span class="mins">00</span>:<span class="secs">00</span></div>&nbsp;<input type="range" class="seek-bar-one custom-slider" id="seekBarOne" min="0" max="${episode.length}" step="0.00001" value="0" oninput="seekOne(this)">&nbsp;<div class="remaining-time time">-${minsAndSecs(episode.length).fullTime}</div>
            <div class="mute-buttons buttons">
              <button class="mute-one button" id="muteOne" onclick="mute(this);">
                <img src="https://assets.jwwb.nl/assets/img/icons/volume-up-interface-symbol.svg" width="15px" class="mute-icon icon">
              </button>
              <button class="unmute-one button" id="unmuteOne" onclick="unMute(this);" hidden>
                <img src="https://assets.jwwb.nl/assets/img/icons/volume-off.svg" width="11px" class="icon">
              </button>
            </div>
            <input type="range" class="volume-slider-one custom-slider" min="0" max="1" step="0.001" value="" id="volumeSliderOne" oninput="changeVolume(this)"> &nbsp;&nbsp; <div class="playback-speed buttons">
              <button id="fastSpeedOne" class="fast-one button" onclick="fastSpeedOne(this);">1x</button>
              <button id="slowSpeedOne" class="slow-one button" onclick="slowSpeedOne(this);" hidden="hidden">2x</button>
              <button id="normalSpeedOne" class="normal-one button" onclick="normalSpeedOne(this);" hidden="hidden">0.5x</button>
            </div>
            <p id="duration"></p>
            <br>
            <audio id="audio" preload="none" title="" src="${episode.audioSrc}" onloadedmetadata="setInterval(() => update(this), 1);" onplay="switchButtons(this, 1, 'playback', true);" onpause="switchButtons(this, 1, 'playback', false);" onended="switchButtons(this, 1, 'playback', false);${nextPlay()}"></audio>
          </div>
        </div>`;
    // Adding episode buttons
    if (episode.podcast == "CA") {
      let hasScriptClass = "";
      let scriptUrl = buttonUrl("here", episode.showNotes);
      if (!scriptUrl) {
        hasScriptClass = " unlinked-button";
        scriptUrl = "";
      }
      htmlCode += `
        <div id="episode-buttons">
          <div class="button">
            <a href="${scriptUrl}" target="_blank">
              <button class="episode-button${hasScriptClass}">
                <span class="episode-button-icon-container">
                  <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>t <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>t <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                        <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                        <path d="M396.283,130.188c-3.806-9.135-8.371-16.365-13.703-21.695l-89.078-89.081c-5.332-5.325-12.56-9.895-21.697-13.704 C262.672,1.903,254.297,0,246.687,0H63.953C56.341,0,49.869,2.663,44.54,7.993c-5.33,5.327-7.994,11.799-7.994,19.414v383.719 c0,7.617,2.664,14.089,7.994,19.417c5.33,5.325,11.801,7.991,19.414,7.991h310.633c7.611,0,14.079-2.666,19.407-7.991 c5.328-5.332,7.994-11.8,7.994-19.417V155.313C401.991,147.699,400.088,139.323,396.283,130.188z M255.816,38.826 c5.517,1.903,9.418,3.999,11.704,6.28l89.366,89.366c2.279,2.286,4.374,6.186,6.276,11.706H255.816V38.826z M365.449,401.991 H73.089V36.545h146.178v118.771c0,7.614,2.662,14.084,7.992,19.414c5.332,5.327,11.8,7.994,19.417,7.994h118.773V401.991z"></path>
                        <path d="M319.77,292.355h-201c-2.663,0-4.853,0.855-6.567,2.566c-1.709,1.711-2.568,3.901-2.568,6.563v18.274 c0,2.67,0.856,4.859,2.568,6.57c1.715,1.711,3.905,2.567,6.567,2.567h201c2.663,0,4.854-0.856,6.564-2.567s2.566-3.9,2.566-6.57 v-18.274c0-2.662-0.855-4.853-2.566-6.563C324.619,293.214,322.429,292.355,319.77,292.355z"></path>
                        <path d="M112.202,221.831c-1.709,1.712-2.568,3.901-2.568,6.571v18.271c0,2.666,0.856,4.856,2.568,6.567 c1.715,1.711,3.905,2.566,6.567,2.566h201c2.663,0,4.854-0.855,6.564-2.566s2.566-3.901,2.566-6.567v-18.271 c0-2.663-0.855-4.854-2.566-6.571c-1.715-1.709-3.905-2.564-6.564-2.564h-201C116.107,219.267,113.917,220.122,112.202,221.831z"></path>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Ep Script</span>
              </button>
            </a>
          </div>
          <div class="middle button">
            <a href="${episode.webpage}" target="_self" rel="noopener">
              <button class="episode-button">
                <span class="episode-button-icon-container">
                  <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M392.857,292.354h-18.274c-2.669,0-4.859,0.855-6.563,2.573c-1.718,1.708-2.573,3.897-2.573,6.563v91.361 c0,12.563-4.47,23.315-13.415,32.262c-8.945,8.945-19.701,13.414-32.264,13.414H82.224c-12.562,0-23.317-4.469-32.264-13.414 c-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562,4.471-23.313,13.417-32.259c8.947-8.947,19.702-13.418,32.264-13.418 h200.994c2.669,0,4.859-0.859,6.57-2.57c1.711-1.713,2.566-3.9,2.566-6.567V82.221c0-2.662-0.855-4.853-2.566-6.563 c-1.711-1.713-3.901-2.568-6.57-2.568H82.224c-22.648,0-42.016,8.042-58.102,24.125C8.042,113.297,0,132.665,0,155.313v237.542 c0,22.647,8.042,42.018,24.123,58.095c16.086,16.084,35.454,24.13,58.102,24.13h237.543c22.647,0,42.017-8.046,58.101-24.13 c16.085-16.077,24.127-35.447,24.127-58.095v-91.358c0-2.669-0.856-4.859-2.574-6.57 C397.709,293.209,395.519,292.354,392.857,292.354z"></path>
                        <path d="M506.199,41.971c-3.617-3.617-7.905-5.424-12.85-5.424H347.171c-4.948,0-9.233,1.807-12.847,5.424 c-3.617,3.615-5.428,7.898-5.428,12.847s1.811,9.233,5.428,12.85l50.247,50.248L198.424,304.067 c-1.906,1.903-2.856,4.093-2.856,6.563c0,2.479,0.953,4.668,2.856,6.571l32.548,32.544c1.903,1.903,4.093,2.852,6.567,2.852 s4.665-0.948,6.567-2.852l186.148-186.148l50.251,50.248c3.614,3.617,7.898,5.426,12.847,5.426s9.233-1.809,12.851-5.426 c3.617-3.616,5.424-7.898,5.424-12.847V54.818C511.626,49.866,509.813,45.586,506.199,41.971z"></path>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Ep Page</span>
              </button>
            </a>
          </div>`;
    } else if (episode.miniseries == "Animalia Fake!") {
      htmlCode += `
      <div id="episode-buttons">
        <div class="button">
          <a href="${buttonUrl("Official Episode Scoresheet", episode.showNotes)}" target="_blank">
            <button class="episode-button">
              <span class="episode-button-icon-container">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="511.63px" height="511.631px" viewBox="0 0 511.63 511.631" style="enable-background:new 0 0 511.63 511.631;" xml:space="preserve">
                  <g>
                    <g>
                      <path d="M493.356,347.177H18.274c-4.952,0-9.233,1.811-12.851,5.425C1.809,356.215,0,360.506,0,365.455v73.083 c0,4.942,1.809,9.233,5.424,12.847c3.621,3.614,7.904,5.428,12.851,5.428h475.082c4.944,0,9.232-1.813,12.85-5.428 c3.614-3.613,5.425-7.904,5.425-12.847v-73.083c0-4.949-1.811-9.24-5.425-12.854C502.588,348.987,498.3,347.177,493.356,347.177z M475.084,420.271H292.369v-36.548h182.723v36.548H475.084z"></path>
                      <path d="M493.356,201H18.274c-4.952,0-9.233,1.809-12.851,5.426C1.809,210.041,0,214.324,0,219.271v73.087 c0,4.948,1.809,9.233,5.424,12.847c3.621,3.614,7.904,5.428,12.851,5.428h475.082c4.944,0,9.232-1.813,12.85-5.428 c3.614-3.613,5.425-7.898,5.425-12.847v-73.087c0-4.947-1.811-9.229-5.425-12.845C502.588,202.808,498.3,201,493.356,201z M475.078,274.09h-292.35v-36.543h292.35V274.09z"></path>
                      <path d="M506.206,60.243c-3.617-3.612-7.905-5.424-12.85-5.424H18.274c-4.952,0-9.233,1.812-12.851,5.424 C1.809,63.86,0,68.145,0,73.093v73.085c0,4.952,1.809,9.235,5.424,12.85c3.621,3.617,7.904,5.424,12.851,5.424h475.082 c4.944,0,9.232-1.807,12.85-5.424c3.614-3.615,5.425-7.898,5.425-12.85V73.093C511.63,68.145,509.82,63.863,506.206,60.243z M475.078,127.911H365.449V91.364h109.629V127.911z"></path>
                    </g>
                  </g>
                </svg>
              </span>
              <span>Scoresheet</span>
            </button>
          </a>
        </div>
        <div class="middle button">
          <a href="${episode.webpage}" target="_self" rel="noopener">
            <button class="episode-button">
              <span class="episode-button-icon-container">
                <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 511.626 511.627" style="enable-background:new 0 0 511.626 511.627;" xml:space="preserve">
                  <g>
                    <g>
                      <path d="M392.857,292.354h-18.274c-2.669,0-4.859,0.855-6.563,2.573c-1.718,1.708-2.573,3.897-2.573,6.563v91.361 c0,12.563-4.47,23.315-13.415,32.262c-8.945,8.945-19.701,13.414-32.264,13.414H82.224c-12.562,0-23.317-4.469-32.264-13.414 c-8.945-8.946-13.417-19.698-13.417-32.262V155.31c0-12.562,4.471-23.313,13.417-32.259c8.947-8.947,19.702-13.418,32.264-13.418 h200.994c2.669,0,4.859-0.859,6.57-2.57c1.711-1.713,2.566-3.9,2.566-6.567V82.221c0-2.662-0.855-4.853-2.566-6.563 c-1.711-1.713-3.901-2.568-6.57-2.568H82.224c-22.648,0-42.016,8.042-58.102,24.125C8.042,113.297,0,132.665,0,155.313v237.542 c0,22.647,8.042,42.018,24.123,58.095c16.086,16.084,35.454,24.13,58.102,24.13h237.543c22.647,0,42.017-8.046,58.101-24.13 c16.085-16.077,24.127-35.447,24.127-58.095v-91.358c0-2.669-0.856-4.859-2.574-6.57 C397.709,293.209,395.519,292.354,392.857,292.354z"></path>
                      <path d="M506.199,41.971c-3.617-3.617-7.905-5.424-12.85-5.424H347.171c-4.948,0-9.233,1.807-12.847,5.424 c-3.617,3.615-5.428,7.898-5.428,12.847s1.811,9.233,5.428,12.85l50.247,50.248L198.424,304.067 c-1.906,1.903-2.856,4.093-2.856,6.563c0,2.479,0.953,4.668,2.856,6.571l32.548,32.544c1.903,1.903,4.093,2.852,6.567,2.852 s4.665-0.948,6.567-2.852l186.148-186.148l50.251,50.248c3.614,3.617,7.898,5.426,12.847,5.426s9.233-1.809,12.851-5.426 c3.617-3.616,5.424-7.898,5.424-12.847V54.818C511.626,49.866,509.813,45.586,506.199,41.971z"></path>
                    </g>
                  </g>
                </svg>
              </span>
              <span>Ep Page</span>
            </button>
          </a>
        </div>`;
    } else if (episode.podcast == "KA") {
      let hasComicClass = "";
      let comicUrl = buttonUrl("Comic", episode.showNotes);
      if (!comicUrl) {
        hasComicClass = " unlinked-button";
        comicUrl = "";
      }
      let hasQuizClass = "";
      let quizUrl = buttonUrl("Memory Quiz", episode.showNotes);
      if (!quizUrl) {
        hasQuizClass = " unlinked-button";
        quizUrl = "";
      }
      htmlCode += `
      <div id="episode-buttons">
        <div class="button">
          <a href="${comicUrl}" target="_self">
            <button class="episode-button${hasComicClass}">
              <span class="episode-button-icon-container">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="548.176px" height="548.176px" viewBox="0 0 548.176 548.176" style="enable-background:new 0 0 548.176 548.176" xml:space="preserve">
                  <g>
                    <g>
                      <path d="M534.75,68.238c-8.945-8.945-19.694-13.417-32.261-13.417H45.681c-12.562,0-23.313,4.471-32.264,13.417 C4.471,77.185,0,87.936,0,100.499v347.173c0,12.566,4.471,23.318,13.417,32.264c8.951,8.946,19.702,13.419,32.264,13.419h456.815 c12.56,0,23.312-4.473,32.258-13.419c8.945-8.945,13.422-19.697,13.422-32.264V100.499 C548.176,87.936,543.699,77.185,534.75,68.238z M511.623,447.672c0,2.478-0.899,4.613-2.707,6.427 c-1.81,1.8-3.952,2.703-6.427,2.703H45.681c-2.473,0-4.615-0.903-6.423-2.703c-1.807-1.813-2.712-3.949-2.712-6.427V100.495 c0-2.474,0.902-4.611,2.712-6.423c1.809-1.803,3.951-2.708,6.423-2.708h456.815c2.471,0,4.613,0.905,6.42,2.708 c1.801,1.812,2.707,3.949,2.707,6.423V447.672L511.623,447.672z"></path>
                      <path d="M127.91,237.541c15.229,0,28.171-5.327,38.831-15.987c10.657-10.66,15.987-23.601,15.987-38.826 c0-15.23-5.333-28.171-15.987-38.832c-10.66-10.656-23.603-15.986-38.831-15.986c-15.227,0-28.168,5.33-38.828,15.986 c-10.656,10.66-15.986,23.601-15.986,38.832c0,15.225,5.327,28.169,15.986,38.826C99.742,232.211,112.683,237.541,127.91,237.541z"></path>
                      <polygon points="210.134,319.765 164.452,274.088 73.092,365.447 73.092,420.267 475.085,420.267 475.085,292.36 356.315,173.587"></polygon>
                    </g>
                  </g>
                </svg>
              </span>
              <span>Ep comic</span>
            </button>
          </a>
        </div>
        <div class="middle button">
          <a href="${quizUrl}" target="_blank">
            <button class="episode-button${hasQuizClass}">
              <span class="episode-button-icon-container">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="438.533px" height="438.533px" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                  <g>
                    <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M255.82,356.309c0,2.662-0.862,4.853-2.573,6.563 c-1.704,1.711-3.895,2.567-6.557,2.567h-54.823c-2.664,0-4.854-0.856-6.567-2.567c-1.714-1.711-2.57-3.901-2.57-6.563v-54.823 c0-2.662,0.855-4.853,2.57-6.563c1.713-1.708,3.903-2.563,6.567-2.563h54.823c2.662,0,4.853,0.855,6.557,2.563 c1.711,1.711,2.573,3.901,2.573,6.563V356.309z M325.338,187.574c-2.382,7.043-5.044,12.804-7.994,17.275 c-2.949,4.473-7.187,9.042-12.709,13.703c-5.51,4.663-9.891,7.996-13.135,9.998c-3.23,1.995-7.898,4.713-13.982,8.135 c-6.283,3.613-11.465,8.326-15.555,14.134c-4.093,5.804-6.139,10.513-6.139,14.126c0,2.67-0.862,4.859-2.574,6.571 c-1.707,1.711-3.897,2.566-6.56,2.566h-54.82c-2.664,0-4.854-0.855-6.567-2.566c-1.715-1.712-2.568-3.901-2.568-6.571v-10.279 c0-12.752,4.993-24.701,14.987-35.832c9.994-11.136,20.986-19.368,32.979-24.698c9.13-4.186,15.604-8.47,19.41-12.847 c3.812-4.377,5.715-10.188,5.715-17.417c0-6.283-3.572-11.897-10.711-16.849c-7.139-4.947-15.27-7.421-24.409-7.421 c-9.9,0-18.082,2.285-24.555,6.855c-6.283,4.565-14.465,13.322-24.554,26.263c-1.713,2.286-4.093,3.431-7.139,3.431 c-2.284,0-4.093-0.57-5.424-1.709L121.35,145.89c-4.377-3.427-5.138-7.422-2.286-11.991 c24.366-40.542,59.672-60.813,105.922-60.813c16.563,0,32.744,3.903,48.541,11.708c15.796,7.801,28.979,18.842,39.546,33.119 c10.554,14.272,15.845,29.787,15.845,46.537C328.904,172.824,327.71,180.529,325.338,187.574z"></path>
                  </g>
                </svg>
              </span>
              <span>Memory Quiz</span>
            </button>
          </a>
        </div>`;
    }
    htmlCode += `
          <div class="button">
            <a href="${episode.audioSrc}" target="_blank" rel="noopener">
              <button class="episode-button">
                <span class="episode-button-icon-container">
                  <svg class="episode-button-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1.2em" height="1.2em" viewBox="0 0 438.533 438.533" style="enable-background:new 0 0 438.533 438.533;" xml:space="preserve">
                    <g>
                      <g>
                        <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0 c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267 c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407 s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062 C438.533,179.485,428.732,142.795,409.133,109.203z M353.742,297.208c-13.894,23.791-32.736,42.633-56.527,56.534 c-23.791,13.894-49.771,20.834-77.945,20.834c-28.167,0-54.149-6.94-77.943-20.834c-23.791-13.901-42.633-32.743-56.527-56.534 c-13.897-23.791-20.843-49.772-20.843-77.941c0-28.171,6.949-54.152,20.843-77.943c13.891-23.791,32.738-42.637,56.527-56.53 c23.791-13.895,49.772-20.84,77.943-20.84c28.173,0,54.154,6.945,77.945,20.84c23.791,13.894,42.634,32.739,56.527,56.53 c13.895,23.791,20.838,49.772,20.838,77.943C374.58,247.436,367.637,273.417,353.742,297.208z"></path>
                        <path d="M310.633,219.267H255.82V118.763c0-2.666-0.862-4.853-2.573-6.567c-1.704-1.709-3.895-2.568-6.557-2.568h-54.823 c-2.664,0-4.854,0.859-6.567,2.568c-1.714,1.715-2.57,3.901-2.57,6.567v100.5h-54.819c-4.186,0-7.042,1.905-8.566,5.709 c-1.524,3.621-0.854,6.947,1.999,9.996l91.363,91.361c2.096,1.711,4.283,2.567,6.567,2.567c2.281,0,4.471-0.856,6.569-2.567 l91.077-91.073c1.902-2.283,2.851-4.576,2.851-6.852c0-2.662-0.855-4.853-2.573-6.57 C315.489,220.122,313.299,219.267,310.633,219.267z"></path>
                      </g>
                    </g>
                  </svg>
                </span>
                <span>Download</span>
              </button>
            </a>
          </div>
        </div>
    </div>
    <br>`;
    episodeContainer.innerHTML = htmlCode;
  }
}

async function fetchRSS (podcast) {
  // The variable 'podcast' will be the acronym for the podcast.
  // Get the correct RSS feed.
  let rssFeed = "https://corsproxy.io/?";
  
  if (podcast == "CA") {
    rssFeed += encodeURIComponent("https://www.spreaker.com/show/5934340/episodes/feed");
  } else if (podcast == "KA") {
    rssFeed += encodeURIComponent("https://feeds.buzzsprout.com/2038404.rss?tags=");
  } else if (podcast == "AF") {
    // rssFeed = "localaffeed.rss";
    rssFeed += encodeURIComponent("https://feeds.buzzsprout.com/2038404.rss?tags=Animalia+Fake%21");
  } else if (podcast == "ACB") {
    rssFeed = encodeURIComponent("https://feeds.buzzsprout.com/2038404.rss?tags=Ask+the+Chickadee+Brothers");
  }

  // Fetch the RSS feed.
  fetch(rssFeed).then(response => {
    console.log(response);
    return response.text();
  }).then(str => new window.DOMParser().parseFromString(str.replace(/\u2060/g, ""), "text/xml")).then(data => {
    items = data.querySelectorAll("item");
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let episodeInfo = {
        title: item.querySelector("title").innerHTML,
        podcast: podcast,
        miniseries: null,
        webpage: item.querySelector("link").innerHTML,
        epNum: null,
        seNum: null,
        type: item.querySelector("episodeType").innerHTML,
        showNotes: item.querySelector("description").innerHTML.replace("<![CDATA[", "<p>").replace("]]>", "</p>"),
        date: new Date(item.querySelector("pubDate").innerHTML).toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        audioSrc: item.querySelector("enclosure").getAttribute("url"),
        length: item.querySelector("duration").innerHTML,
        art: item.querySelector("image").getAttribute("href"),
        guid: item.querySelector("guid").innerHTML
      };
      if (item.querySelector("episode")) {
        episodeInfo.epNum = item.querySelector("episode").innerHTML;
      }
      if (item.querySelector("season")) {
        episodeInfo.seNum = item.querySelector("season").innerHTML;
      }
      if (item.querySelector("keywords").innerHTML.includes("Animalia Fake!")) {
        episodeInfo.miniseries = "Animalia Fake!";
      } else if (item.querySelector("keywords").innerHTML.includes("Ask the Chickadee Brothers")) {
        episodeInfo.miniseries = "Ask the Chickadee Brothers";
      }
      if (podcast == "CA") {
        CAEpInfo.push(episodeInfo);
      } else if (podcast == "KA") {
        KAEpInfo.push(episodeInfo);
      } else if (podcast == "AF") {
        AFEpInfo.push(episodeInfo);
      } else if (podcast == "ACB") {
        ACBEpInfo.push(episodeInfo);
      }
    }
  });
}
