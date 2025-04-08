window.mobileCheck = function() {
  let check = false;
  // Check if it is a phone or tablet
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

function minsAndSecs(totalSecs) {
  const mins = (Math.trunc(totalSecs / 60)).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false
  });
  const secs = (totalSecs - mins * 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    });
  return {
    mins: mins,
    secs: secs,
    htmlFullTime: `<span class="mins">${mins}</span>:<span class="secs">${secs}</span>`,
    fullTime: `${mins}:${secs}`
  };
}

function get(num, currentElement, element) {
  let parent = currentElement;
  for (let i = 0; i < num; i++) {
    parent = parent.parentElement;
  }
  return parent.querySelector(element);
}

function switchButtons(currentElement, num, type, sound) {
  if (type == "playback") {
    get(num, currentElement, ".play").hidden = sound;
    get(num, currentElement, ".pause").hidden = !sound;
  } else if (type == "volume") {
    get(num, currentElement, ".unmute").hidden = sound;
    get(num, currentElement, ".mute").hidden = !sound;
  }
}

function setInfo(currentElement) {
  currentElement.volume = 0.5;
  get(1, currentElement, "#seekBar").max = currentElement.duration;
          
  setInterval(() => update(currentElement), 1);
}

function update(currentElement) {
  get(1, currentElement, "#seekBar").value = currentElement.currentTime;
  const currentTime = Math.trunc(currentElement.currentTime);
  const currentTimeElement = get(1, currentElement, ".current-time");
  const remainingTime = Math.trunc(currentElement.duration) - currentTime;
  const remainingTimeElement = get(1, currentElement, ".remaining-time");
  currentTimeElement.innerHTML = minsAndSecs(currentTime).htmlFullTime;
  remainingTimeElement.innerHTML = "-" + minsAndSecs(remainingTime).htmlFullTime;
}

function seek(currentElement) {
  get(1, currentElement, "#audio").currentTime = currentElement.value;
  get(1, currentElement, ".current-time").innerHTML = minsAndSecs(Math.trunc(currentElement.value)).htmlFullTime;
  get(1, currentElement, ".remaining-time").innerHTML = "-" + minsAndSecs(Math.trunc(currentElement.max - currentElement.value)).htmlFullTime;
}

function changeVolume(currentElement) {
  get(1, currentElement, "#audio").muted = false;
  get(1, currentElement, "#audio").volume = currentElement.value;
  
  if (get(1, currentElement, "#volumeSlider").value == 0) {
    switchButtons(currentElement, 1, "volume", false);
    if (window.mobileCheck()) {
      currentElement.muted = true;
    }
  } else {
    switchButtons(currentElement, 1, "volume", true);
    if (window.mobileCheck()) {
      currentElement.muted = false;
    }
  }
}

function playAud(currentElement) {
  document.querySelectorAll('audio').forEach(aud => aud.pause());
  get(2, currentElement, "#audio").play();
  switchButtons(currentElement, 2, "playback", true);
}

function pauseAud(currentElement) {
  get(2, currentElement, "#audio").pause();
  switchButtons(currentElement, 1, "playback", false);
}

function mute(currentElement) {
  get(2, currentElement, "#audio").muted = true;
  switchButtons(currentElement, 1, "volume", false);
}

function unMute(currentElement) {
  get(2, currentElement, "#audio").muted = false;
  switchButtons(currentElement, 1, "volume", true);
  if (get(2, currentElement, "#volumeSlider").value == 0) {
    get(2, currentElement, "#audio").volume = 0.1;
    get(2, currentElement, "#volumeSlider").value = get(2, currentElement, "#audio").volume;
  }
}

function fastSpeed(currentElement) {
  get(2, currentElement, "#audio").playbackRate = 2;
  get(1, currentElement, ".fast").hidden = true;
  get(1, currentElement, ".slow").hidden = false;
}

function slowSpeed(currentElement) {
  get(2, currentElement, "#audio").playbackRate = 0.5;
  get(1, currentElement, ".slow").hidden = true;
  get(1, currentElement, ".normal").hidden = false;
} 

function normalSpeed(currentElement) {
  get(2, currentElement, "#audio").playbackRate = 1;
  get(1, currentElement, ".normal").hidden = true;
  get(1, currentElement, ".fast").hidden = false;
}
