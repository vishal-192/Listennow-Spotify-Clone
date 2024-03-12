console.log("javaScript")
let songs;
let currFolder;
let currentSong = new Audio;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    // currFolder = folder;
    // let a = await fetch(`/songs/$(folder
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs =[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += 
        `<li> 
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20"," ")}</div>
                <div>Vishal</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // console.log(songs)
    return songs;
}

const playMusic = (track, pause=false)=>{
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play();
    }

    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML ="00:00 / 00:00"

}

// attach an event listner to each song 
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML)
        playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
    
})

async function displayAlbums(){
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        

        if(e.href.includes("/songs")){
         let folder = e.href.split("/").slice(-2)[0]

         // metadata of folder
         let a = await fetch(`/songs/${folder}/info.json`)
         let response = await a.json();
         console.log(response)
         cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
         <div  class="play">
             <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 100 100">
                 <!-- Circular green background -->
                 <circle cx="50" cy="50" r="45" fill="#4CAF50" />

                 <!-- Image -->
                 <image href="https://img.icons8.com/material-sharp/24/play--v1.png" x="28" y="28"
                     width="44" height="44" />
             </svg>
         </div>
         <img src="/songs/${folder}/cover.jpg" alt="">
         <h2>${response.title}</h2>
         <p>${response.description}</p>
     </div>`

        }

    }

    // load playlist whenever click on card
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    });

}

async function main() {
   
  
    // try {
        songs = await getSongs("songs/cs");
        playMusic(songs[0],true)


        
        // Check if songs is iterable
        // if (!Array.isArray(songs)) {
        //     throw new Error('Songs data is not iterable');
        // }
    // } catch (error) {
    //     console.error('An error occurred:', error);
    // }


    //Display all albums
    displayAlbums();


    //atach an event listener to previous ,next, play


    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src = "img/pause.svg"    
        }
        else{
            currentSong.pause()
            play.src = "img/play.svg" 
        }
    })

    //Listen for time update
   
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // add event listener on seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    }) 

   // Add an event listener for hamburger
   document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
    })

     // Add an event listener for close
   document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%"
    })

    // add an event listener on previous and next
    previous.addEventListener("click", ()=>{
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        // console.log(songs,index)
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // event listener on volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        console.log(e)
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }

    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })
   

}

main();