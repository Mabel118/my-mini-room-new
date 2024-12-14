// Select elements
const playPauseBtn = document.querySelector('.play-pause');
const playerTrack = document.querySelector('.player-track');
const albumCover = document.querySelector('.album-cover');
const background = document.querySelector('.bg');
const albumName = document.querySelector('.album-name');
const trackName = document.querySelector('.track-name');
const trackTime = document.querySelector('.track-time');
const currentTimeElem = document.querySelector('.current-time');
const totalTimeElem = document.querySelector('.total-time');
const progressBox = document.querySelector('.progress-box');
const hoverTime = document.querySelector('.hover-time');
const hoverBar = document.querySelector('.hover-bar');
const progressBar = document.querySelector('.progress-bar');
const playPrev = document.querySelector('.play-prev');
const playNext = document.querySelector('.play-next');

// Album and track data
const albums = [
    'K.', 
    'Bésame Mucho', 
    'Let Me Go', 
    'GONE, GONE, THANK YOU', 
    'Scream Drive Faster', 
    'A Night To Remember',
    'Courage',
    'From The Start',
    'Happiness',
    'Please Please Please',
    'Salvatore',
    'September Rain',
    'Showa',
];
const trackNames = [
    'Cigarettes After Sex',
    'Lisa Ono',
    'Daniel Caesar',
    'Tyler, The Creator',
    'LAUREL',
    'beabadoobee & Laufey',
    'Lianne La Havas',
    'Laufey',
    'Sarz Asake Gunna',
    'Sabrina Carpenter',
    'Lana Del Rey',
    'Makoto Matsushita',
    'Kizz Daniel',
];

// Variables
let audio = new Audio();
audio.loop = false;
let currentIndex = -1;
let progressLocation = 0;

// Initialize player
function initPlayer() {
    selectTrack(0);

    // Event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    progressBox.addEventListener('mousemove', showHover);
    progressBox.addEventListener('mouseout', hideHover);
    progressBox.addEventListener('click', playFromClickedPosition);
    audio.addEventListener('timeupdate', updateCurrentTime);
    playPrev.addEventListener('click', () => selectTrack(-1));
    playNext.addEventListener('click', () => selectTrack(1));
    audio.addEventListener('ended', () => {
        playPauseBtn.querySelector('.fa').classList = 'fa fa-play';
        progressBar.style.width = '0px';
        currentTimeElem.innerText = '00:00';
        playerTrack.classList.remove('active');
        albumCover.classList.remove('active');
    });
}

// Play or pause the audio
function togglePlayPause() {
    setTimeout(() => {
        if (audio.paused) {
            playerTrack.classList.add('active');
            playPauseBtn.querySelector('.fa').classList = 'fa fa-pause';
            albumCover.classList.add('active');
            audio.play();
        } else {
            playerTrack.classList.remove('active');
            playPauseBtn.querySelector('.fa').classList = 'fa fa-play';
            albumCover.classList.remove('active');
            audio.pause();
        }
    }, 300);
}

// Show hover time on the progress bar
function showHover(e) {
    const progressBoxRect = progressBox.getBoundingClientRect();
    const hoverPosition = e.clientX - progressBoxRect.left;
    progressLocation = (audio.duration * hoverPosition) / progressBoxRect.width;

    hoverBar.style.width = `${hoverPosition}px`;

    const minutes = Math.floor(progressLocation / 60);
    const seconds = Math.floor(progressLocation % 60);
    hoverTime.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    hoverTime.style.left = `${hoverPosition}px`;
    hoverTime.style.marginLeft = '-20px';
    hoverTime.style.display = 'block';
}

// Hide hover time
function hideHover() {
    hoverBar.style.width = '0px';
    hoverTime.style.display = 'none';
}

// Play from the clicked position
function playFromClickedPosition() {
    audio.currentTime = progressLocation;
    progressBar.style.width = `${(progressLocation / audio.duration) * 100}%`;
    hideHover();
}

// Update current time display and progress bar
function updateCurrentTime() {
    const currentMinutes = Math.floor(audio.currentTime / 60);
    const currentSeconds = Math.floor(audio.currentTime % 60);
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60);

    currentTimeElem.innerText = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
    totalTimeElem.innerText = `${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;

    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Select a track based on the given direction
function selectTrack(flag) {
    currentIndex += flag;

    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= albums.length) currentIndex = albums.length - 1;

    const currentAlbum = albums[currentIndex];
    const currentTrack = trackNames[currentIndex];

    audio.src = encodeURI(`mp3/${currentAlbum}.mp3`);

    if (flag !== 0) {
        audio.play();
        playerTrack.classList.add('active');
        albumCover.classList.add('active');
    }

    albumName.innerText = currentAlbum;
    trackName.innerText = currentTrack;

    const activeCover = albumCover.querySelector('.active');
    if (activeCover) activeCover.classList.remove('active');
    albumCover.getElementsByTagName('img')[currentIndex]?.classList.add('active');

    background.style.backgroundImage = `url(images/${currentAlbum}.jpg)`;
}

// Initialize the music player
initPlayer();
