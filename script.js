const trackId = "fHtTY4n6_GY";
let youtubePlayer;
let playerReady = false;
let pendingPlay = false;

const musicToggle = document.querySelector("#music-toggle");
const musicToggleLabel = document.querySelector("#music-toggle-label");
const musicStatus = document.querySelector("#music-status");

function setMusicUi(isPlaying) {
  musicToggle?.setAttribute("aria-pressed", String(isPlaying));
  if (musicToggleLabel) musicToggleLabel.textContent = isPlaying ? "Pause soundtrack" : "Play soundtrack";
  const playIcon = musicToggle?.querySelector(".play-icon");
  if (playIcon) playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  if (musicStatus) musicStatus.textContent = isPlaying ? "Soundtrack playing on loop." : "Ready when you are.";
}

window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtube-player", {
    videoId: trackId,
    playerVars: {
      autoplay: 0,
      controls: 1,
      disablekb: 0,
      loop: 1,
      modestbranding: 1,
      playsinline: 1,
      playlist: trackId,
      cc_load_policy: 1,
      cc_lang_pref: "pt-BR",
    },
    events: {
      onReady() {
        playerReady = true;
        if (pendingPlay) {
          youtubePlayer.playVideo();
          pendingPlay = false;
        }
      },
      onStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) setMusicUi(true);
        if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) setMusicUi(false);
      },
      onError() {
        if (musicStatus) musicStatus.textContent = "The YouTube player is unavailable. Use the link to open the track.";
        setMusicUi(false);
      },
    },
  });
};

musicToggle?.addEventListener("click", () => {
  if (!playerReady) {
    pendingPlay = true;
    if (musicStatus) musicStatus.textContent = "Loading the soundtrack…";
    return;
  }

  const state = youtubePlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
});

window.setTimeout(() => {
  if (!playerReady && musicStatus) {
    musicStatus.textContent = "Embedded playback is unavailable. Use Open on YouTube instead.";
  }
}, 6000);

const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = primaryNav?.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const label = button.querySelector("span");
    const originalLabel = label?.textContent;

    try {
      await navigator.clipboard.writeText(value);
      if (label) label.textContent = "Copied to clipboard";
    } catch {
      if (label) label.textContent = value;
    }

    window.setTimeout(() => {
      if (label) label.textContent = originalLabel;
    }, 1800);
  });
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

