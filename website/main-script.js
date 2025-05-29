// Remove href attribute from menu headers and <a> elements with no links
let unlinkedAs = [
  document.querySelectorAll("a[data-link-id='17627884']"),
  document.querySelectorAll("a[data-link-id='18205969']"),
  document.querySelectorAll("a[data-link-id='17627819']"),
  document.querySelectorAll("a[data-page-link-id='15010016']"),
  document.querySelectorAll("a[data-page-link-id='12029268']"),
  document.querySelectorAll("a[data-page-link-id='12784877']"),
  document.querySelectorAll("a[data-page-link-id='12514772']")
];

for (let i = 0; i < unlinkedAs.length; i++) {
  for (let j = 0; j < unlinkedAs[i].length; j++) {
    let unlinkedA = unlinkedAs[i][j];
    //let styleAttr = document.createAttribute("style");
    let hrefAttr = document.createAttribute("href");
    //styleAttr.value = "cursor:pointer;";
    hrefAttr.value = "javascript:void(0);";
    unlinkedA.removeAttribute("href");
    //unlinkedA.setAttributeNode(styleAttr);
    unlinkedA.setAttributeNode(hrefAttr);
    //unlinkedA.href = "javascript:void(0);";
  }
}

const newsletterEmail = document.querySelector("#jw-element-230647470 input[type='email']");
const placeholder = document.createAttribute("placeholder");
placeholder.value = "Your email address…";
newsletterEmail.setAttributeNode(placeholder);

// Link the header message bar to the KAP Plus site
document.getElementsByClassName("message-bar--accent")[0].addEventListener("click", function() {
  window.open("https://plus.kapods.org", "_blank");
});

let aSpans = document.querySelectorAll("span:has(:is(span a))");
for (let aSpan of aSpans) {
  if (aSpan.style.textDecoration == "underline") {
    aSpan.style.textDecoration = "none";
    aSpan.querySelector("span a").style.textDecoration = "underline";
  }
}

function unlinkMenuItems(nextFunction) {
  if (document.querySelectorAll("nav.menu").length == 2) {
    nextFunction();
  } else {
    setTimeout(() => { unlinkMenuItems(nextFunction) }, );
  }
}

unlinkMenuItems(() => {
  let tempMenuItems = [
    document.querySelectorAll("a[data-link-id='17627819'], a[data-link-id='18205969'], a[data-link-id='17627884']")
  ]
  let numMenuItems = 0;
  for (let group of tempMenuItems) {
    for (let menuItem of group) {
      numMenuItems += 1;
      menuItem.href = "javascript:void(0);";
    }
  }
  console.log(numMenuItems);
});

/*
//Add Ask the Chickadee Brothers widget to all Kingdom: Animalia pages
if (document.location.pathname.substring(1, 17) == "kingdom-animalia") {
  (function(d) {
    var app = d.createElement('script');
    app.type = 'text/javascript';
    app.async = true;
    app.src = 'https://www.speakpipe.com/loader/q4ndxusw2iz709l0w4puke0bhzhnqrl3.js';
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(app, s);
  })(document);
}
*/

function displayPodroll(podcast) {
  if (podcast == "KA") {
    let podroll = document.getElementById("podroll");
    let podcasts = [
      {
        title: "Amazing Wildlife: A San Diego Zoo Podcast",
        author: "iHeartPodcasts",
        artwork: "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/22554c7c-336b-4dab-8602-ae3900375f03/f00b6583-9098-41fa-b61b-ae3900375f11/image.jpg",
        url: "https://episodes.fm/1593442890"
      },
      {
        title: "Earth Rangers",
        author: "GZM Shows",
        artwork: "https://megaphone.imgix.net/podcasts/f099b95e-6468-11ee-90cf-8b94eea21a5d/image/417b0aa0a83f0bd4e0cc1ef0f80aaa0a0d89749c30833a57a5b811305a6108e10a60992fe3f81b336711c06d4dd5bc17c6e038d3b44533ffefed20dd8a22a466.jpeg",
        url: "https://episodes.fm/1408102830"
      },
      {
        title: "Short Wave",
        author: "NPR",
        artwork: "https://media.npr.org/assets/img/2022/09/23/short-wave_tile_npr-network-01_sq-517382b4b8fd0ab48ea9c781253f9992eab733dc.jpg",
        url: "https://episodes.fm/1482575855"
      },
      {
        title: "Unexplainable",
        author: "Vox",
        artwork: "https://megaphone.imgix.net/podcasts/bf04a680-6afe-11eb-a86a-3f07259749a3/image/d510ec950f9a501094c11003381fcedc.jpg",
        url: "https://episodes.fm/1554578197"
      },
      {
        title: "Science Friday",
        author: "Science Friday and WNYC Studios",
        artwork: "https://image.simplecastcdn.com/images/ac8e2039-dfef-4938-b66a-c2f58f4b7599/c01bb987-b09c-4e1a-b8ba-5cd859951535/3000x3000/sciencefriday-wnycstudios-1400.jpg",
        url: "https://episodes.fm/73329284"
      },
      {
        title: "The Big Melt",
        author: "GZM Shows",
        artwork: "https://megaphone.imgix.net/podcasts/dab15b72-145b-11ee-9a1d-e30078842ba7/image/bigmelt-3000.jpg",
        url: "https://episodes.fm/1501895003"
      },
      {
        title: "How Wild",
        author: "NPR",
        artwork: "https://media.npr.org/assets/img/2024/08/01/how-wild-final-logo_sq-63107a48fb042203b2eb8c6340d874b75bd4bfc0.jpg",
        url: "https://episodes.fm/1760612746"
      },
      {
        title: "Six Minutes",
        author: "GZM Shows",
        artwork: "https://megaphone.imgix.net/podcasts/cb57fbec-6238-11ee-9b92-57dc4faf265f/image/8841a8c9bdf810e0d5b6b042ccd2893c067c8fb577e0a42a9d1427a3ae61b1c62cc580b902468f4437032a5537757059ec15b73b71d1f0f407b55cc02f0aef95.jpeg",
        url: "https://episodes.fm/1348470106"
      },
      {
        title: "Radiolab",
        author: "WNYC Studies",
        artwork: "https://image.simplecastcdn.com/images/3b6088d3-ed01-4c8f-b0af-bcbd72035bcf/48797471-8a28-49e4-95aa-80a28ffa6d82/3000x3000/radiolab-branded-logo-1400x1400.jpg",
        url: "https://episodes.fm/152249110"
      },
      {
        title: "The Big Fib",
        author: "GZM Shows",
        artwork: "https://megaphone.imgix.net/podcasts/3afde448-6469-11ee-90a2-076ec31b5eec/image/2f4874fcf8a29f366061215072c6b37e5fe344ac2e67575c2ae641baa67cbf843b499cc9e96d7c4f4de4251aa2f6f274aeabdb1e6b44ee1d2c2d00b547127f00.jpeg",
        url: "https://episodes.fm/1348469682"
      },
      {
        title: "The Natureverse",
        author: "GZM Shows",
        artwork: "https://megaphone.imgix.net/podcasts/f9ab4ce6-4b32-11ee-9167-4b0021a2d9b1/image/1aa00803dce1cc11a34d78ddf961021c01c9bec77448f9a3f9e1436a86cb320274334e6c15f25f8fb0179582a1079958018e2f53a14c379b20dd9dd571e54326.jpeg",
        url: "https://episodes.fm/1423733399"
      },
      {
        title: "The Show About Science",
        author: "Nate | The Company Making Podcasts",
        artwork: "https://image.simplecastcdn.com/images/a4f537ea-b9b1-4f48-8b35-26018cbfbf13/79950ba9-4199-4336-9ac1-c3a37b16a548/3000x3000/avatars-mz2tuarvohuuvzio-dhksjq-original.jpg",
        url: "https://episodes.fm/1046413761"
      },
      {
        title: "Tai Asks Why",
        author: "CBC",
        artwork: "https://www.cbc.ca/radio/podcasts/images/promo_TAIASKSWHY_2024.jpg",
        url: "https://pod.link/1434443225"
      },
      {
        title: "Cool Facts About Animals",
        author: "Cool Facts About Animals Podcast",
        artwork: "https://static.libsyn.com/p/assets/3/3/f/b/33fb1954c3c6034b/avatars-000394173162-wwrygq-original.jpg",
        url: "https://episodes.fm/1334467437"
      },
      {
        title: "Tumble Science Podcast for Kids",
        author: "Tumble Media",
        artwork: "https://megaphone.imgix.net/podcasts/26aa508c-d505-11ee-bb02-73230b38f27c/image/1c6523f5717fbcd9f8647bc4c72a3b57.jpg",
        url: "https://episodes.fm/984771479"
      }
    ];
    for (let podcast of podcasts) {
      podroll.innerHTML +=
        `<div class="podcast">
          <a href="${podcast.url}" target="_blank">
            <div class="artwork">
              <img src="${podcast.artwork}">
            </div>
            <span class="title">${podcast.title}</span><br>
            <span class="author">${podcast.author}</span>
          </a>
        </div>`;
    }
  }
}
