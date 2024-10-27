const playlistRow = document.querySelector(".playlist-row");

async function fetchData() {
  try {
    const response = await fetch(
      "https://s3-ap-southeast-1.amazonaws.com/he-public-data/studiod9c0baf.json"
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    renderPlaylist(data);
  } catch (error) {
    console.error("Fetch error", error);
  }
}

function renderPlaylist(playlist) {
  playlist.forEach((value, index) => {
    const html = `
      <div class="play-list-col">
        <div class="play-list-box">
          <img src="${value.cover_image}" alt="${value.song}">
          <div class="details">
            <div class="song-name"><b>Song:</b> ${value.song}</div>
            <div class="artist-name"><b>Artist:</b> ${value.artists}</div>
            <button class="play-btn" onclick="playMusic(${index})">Play</button>
            <button class="pause-btn" onclick="pauseMusic(${index})">Pause</button>
          </div>
        </div>
      </div>`;
    playlistRow.insertAdjacentHTML("beforeend", html);
  });

  // Store playlist data for easy access in playMusic
  window.playlist = playlist;
}

let audio = null;
let audioPlaying = false;

async function playMusic(index) {
  const musicDetails = window.playlist[index];
  if (!audio) {
    audio = new Audio(musicDetails.url);
    audio.type = "audio/wav";
  } else if (audio.src !== musicDetails.url) {
    audio.src = musicDetails.url;
  }
  try {
    await audio.play();
    audioPlaying = true;
    updatePlayingScreen(musicDetails);
    console.log("Playing...");
  } catch (err) {
    console.error("Failed to play audio:", err);
  }
}

function pauseMusic(index) {
  const musicDetails = window.playlist[index];
  if (audio) {
    audio.pause();
    audioPlaying = false;
    updatePlayingScreen(musicDetails);
    console.log("Paused...");
  }
}

function updatePlayingScreen(musicDetails) {
  document.querySelector(".playing-screen")?.remove();
  if (!musicDetails) return;

  const playPauseButton = audioPlaying
    ? `<button type="button" class="button" title="Pause" onclick="pauseMusic(${musicDetails.index})"><i class="fa-solid fa-pause"></i></button>`
    : `<button type="button" class="button" title="Play" onclick="playMusic(${musicDetails.index})"><i class="fa-solid fa-play"></i></button>`;

  const html = `
    <div class="playing-screen">
      <div class="song-details">
        <img src="${musicDetails.cover_image}" alt="${musicDetails.song}" />
        <div class="song-details-individual">
          <div class="song-name-individual">${musicDetails.song}</div>
          <div class="artist-name-individual">${musicDetails.artists}</div>
        </div>
      </div>
      <div class="play-pause-timeline">
        ${playPauseButton}
        <div class="time-line">Timeline</div>
      </div>
      <div class="volume">
        <i class="fa-solid fa-volume-high"></i> Volume
      </div>
    </div>`;
  document.body.insertAdjacentHTML("beforeend", html);
}

fetchData();
