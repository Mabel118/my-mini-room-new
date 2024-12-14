let play_pause=document.querySelector('.play-pause'),
    player_track=document.querySelector('.player-track'),
    album_cover=document.querySelector('.album-cover'),
    bg=document.querySelector('.bg'),
    album_name=document.querySelector('.album-name'),
    track_name=document.querySelector('.track-name'),
    track_time=document.querySelector('.track-time'),
    current_time=document.querySelector('.current-time'),
    total_time=document.querySelector('.total-time'),
    progress_box=document.querySelector('.progress-box'),
    hover_time=document.querySelector('.hover-time'),
    hover_bar=document.querySelector('.hover-bar'),
    progress_bar=document.querySelector('.progress-bar'),
    play_prev=document.querySelector('.play-prev'),
    play_next=document.querySelector('.play-next');
  


let progress_t, 
    progress_loc, 
    c_m, 
    ct_minutes, 
    ct_seconds, 
    cur_minutes, 
    cur_seconds,
    dur_minutes,
    dur_seconds,
    play_progress; 
let cur_index=-1;

function initPlayer(){
    audio=new Audio(); 
    audio.loop=false; 
    
    selectTrack(0);
    
    play_pause.addEventListener('click',playPause);
    
    progress_box.addEventListener('mousemove',function(e){
        showHover(e);
    });
    
    progress_box.addEventListener('mouseout',hideHover);
    
    progress_box.addEventListener('click',playFromClickedPos);
    
    audio.addEventListener('timeupdate',updateCurTime);
    
    play_prev.addEventListener('click',function(){
        selectTrack(-1);
    });
    
    play_next.addEventListener('click',function(){
        selectTrack(1);
    });
}


function playPause(){
    setTimeout(function(){
        if(audio.paused){
            player_track.classList.add('active');
            play_pause.querySelector('.fa').classList='fa fa-pause';
            album_cover.classList.add('active');
            audio.play();
        }else{
            player_track.classList.remove('active');
            play_pause.querySelector('.fa').classList='fa fa-play';
            album_cover.classList.remove('active');
            audio.pause();
        }
    },300);
}


function showHover(e){
    progress_t=e.clientX - progress_box.getBoundingClientRect().left;
    progress_loc=audio.duration * (progress_t / progress_box.getBoundingClientRect().width);
    hover_bar.style.width=progress_t+'px';
    c_m=progress_loc / 60;
    ct_minutes=Math.floor(c_m); //分
    ct_seconds=Math.floor(progress_loc - ct_minutes * 60); //秒

    if(ct_minutes<10){
        ct_minutes='0'+ct_minutes;
    }
    if(ct_seconds<10){
        ct_seconds='0'+ct_seconds;
    }
    if(isNaN(ct_minutes) || isNaN(ct_seconds)){
        hover_time.innerText='--:--';
    }else{
        hover_time.innerText=ct_minutes+':'+ct_seconds;
    }

    hover_time.style.left=progress_t+'px';
    hover_time.style.marginLeft='-20px';
    hover_time.style.display='block';
}

function hideHover(){
    hover_bar.style.width='0px';
    hover_time.innerText='00:00';
    hover_time.style.left='0px';
    hover_time.style.marginLeft='0px';
    hover_time.style.display='none';
}

function playFromClickedPos(){
    audio.currentTime=progress_loc;
    progress_bar.style.width=progress_t+'px';
    hideHover();
}

function updateCurTime(){
    cur_minutes=Math.floor(audio.currentTime / 60);
    cur_seconds=Math.floor(audio.currentTime - cur_minutes * 60);
    dur_minutes=Math.floor(audio.duration / 60);
    dur_seconds=Math.floor(audio.duration - dur_minutes * 60);
    play_progress=audio.currentTime / audio.duration * 100;

    if(cur_minutes<10){
        cur_minutes='0'+cur_minutes;
    }
    if(cur_seconds<10){
        cur_seconds='0'+cur_seconds;
    }
    if(dur_minutes<10){
        dur_minutes='0'+dur_minutes;
    }
    if(dur_seconds<10){
        dur_seconds='0'+dur_seconds;
    }

    if(isNaN(cur_minutes) || isNaN(cur_seconds)){
        current_time.innerText='00:00';
    }else{
        current_time.innerText=cur_minutes+':'+cur_seconds;
    }

    if(isNaN(dur_minutes) || isNaN(dur_seconds)){
        total_time.innerText='00:00';
    }else{
        total_time.innerText=dur_minutes+':'+dur_seconds;
    }

    progress_bar.style.width=play_progress+'%';

    if(play_progress==100){
        play_pause.querySelector('.fa').classList='fa fa-play';
        progress_bar.style.width='0px';
        current_time.innerText='00:00';
        player_track.classList.remove('active');
        album_cover.classList.remove('active');
    }
}

let albums = ['K.', 'Bésame Mucho', 'Scream Drive Faster', 'Let Me Go'];
let track_names = ['Cigarettes After Sex - K.', 'Lisa Ono - Bésame Mucho', 'LAUREL - ScreamDriveFaster', 'Daniel Caesar - NEVER ENOUGH'];

// URLs for the music files (replace these with actual URLs)
let audioURLs = [
  'https://genius.com/songs/8440223/embed.js',  // Replace with your URL
  'https://example.com/audio/感官先生.mp3',   // Replace with your URL
  'https://example.com/audio/夜曲.mp3',      // Replace with your URL
  'https://example.com/audio/我的名字.mp3',    // Replace with your URL
];

// Function to select the track (flag: 0=initial, 1=next, -1=previous)
function selectTrack(flag) {
  if (flag == 0 || flag == 1) {
    ++cur_index;
  } else {
    --cur_index;
  }

  if (cur_index > -1 && cur_index < albums.length) {
    if (flag == 0) {
      play_pause.querySelector('.fa').classList = 'fa fa-play';
    } else {
      play_pause.querySelector('.fa').classList = 'fa fa-pause';
    }
    progress_bar.style.width = '0px';
    current_time.innerText = '00:00';
    total_time.innerText = '00:00';

    // Get current album and track information
    let cur_album = albums[cur_index];
    let cur_track_name = track_names[cur_index];

    // Set the audio source URL (from the audioURLs array)
    audio.src = audioURLs[cur_index];

    // Play the audio if it's changing the track
    if (flag != 0) {
      audio.play();
      player_track.classList.add('active');
      album_cover.classList.add('active');
    }

    // Update the album name and track name
    album_name.innerText = cur_album;
    track_name.innerText = cur_track_name;

    // Update the album cover image
    album_cover.querySelector('.active').classList.remove('active');
    album_cover.getElementsByTagName('img')[cur_index].classList.add('active');

    // Update the background image
    bg.style.backgroundImage = 'url(' + album_cover.getElementsByTagName('img')[cur_index].getAttribute('src') + ')';
  } else {
    // If the track index goes out of bounds, reset it
    if (flag == 0 || flag == 1) {
      --cur_index;
    } else {
      ++cur_index;
    }
  }
}

initPlayer();