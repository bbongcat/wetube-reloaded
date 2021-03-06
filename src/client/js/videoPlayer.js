import fetch from "node-fetch";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;


const handlePlayBtn = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
    video.muted = !video.muted;
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target: {value}} = event;
    if (video.muted) {
        video.muted = false;
        muteBtnIcon.classList = "fas fa-volume-up";
    }
    if (value === "0") {
        video.muted = true;
        muteBtnIcon.classList = "fas fa-volume-mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14, 5);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const {
        target: {value},
    } = event;
    video.currentTime = value;
};

const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreenIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleKeyPlay = (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
    }
    if (e.code === "KeyF") {
        const fullscreen = document.fullscreenElement;
        if (fullscreen) {
            document.exitFullscreen();
            fullScreenIcon.classList = "fas fa-expand";
        } else {
            videoContainer.requestFullscreen();
            fullScreenIcon.classList = "fas fa-compress";
        }
    }
    if (e.code === "Escape") {
        const fullscreen = document.fullscreenElement;
        if (fullscreen) {
            document.exitFullscreen();
            fullScreenIcon.classList = "fas fa-expand";
        }
    }
    if (e.code === "ArrowLeft") {
        video.currentTime -= 5;
    }
    if (e.code === "ArrowRight") {
        video.currentTime += 5;
    }
    if (e.code === "ArrowUp") {
        e.preventDefault();
        const beforeValue = Math.round(video.volume * 10);

        if (beforeValue === 10) {
            volumeRange.value = 1;
        } else {
            video.volume = (beforeValue / 10) + 0.1;
            volumeRange.value = (beforeValue / 10) + 0.1;
            muteBtnIcon.classList = "fas fa-volume-up";
        }
    }
    if (e.code === "ArrowDown") {
        e.preventDefault();
        const beforeValue = Math.round(video.volume * 10);

        if (beforeValue === 1) {
            video.volume = 0;
            volumeRange.value = 0;
            muteBtnIcon.classList = "fas fa-volume-mute";
        } else if (beforeValue !== 0) {
            video.volume = (beforeValue / 10) - 0.1;
            volumeRange.value = (beforeValue / 10) - 0.1;
        }
    }
    if (e.code === "KeyM") {
        video.muted = !video.muted;
        muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
        volumeRange.value = video.muted ? 0 : volumeValue;
    }
};

const handleClickPlay = () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "POST"
    });
};

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);
window.addEventListener("keydown", handleKeyPlay);
video.addEventListener("click", handleClickPlay);
