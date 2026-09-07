(() => {
  const story = document.querySelector('.cinema-story');
  if (!story) return;

  const videos = [...story.querySelectorAll('.story-video')];
  const copies = [...story.querySelectorAll('.story-copy')];
  const progressFill = story.querySelector('.story-progress-fill');
  const counter = story.querySelector('.story-counter b');
  const soundControl = document.getElementById('soundControl');
  const soundIcon = soundControl?.querySelector('.sound-control-icon');
  const soundText = soundControl?.querySelector('.sound-control-text');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = -1;
  let ticking = false;
  let soundEnabled = false;

  videos.forEach((video) => {
    // Browsers allow reliable autoplay only while muted. Sound is enabled after
    // the visitor's first tap/click on the cinematic sound control.
    video.muted = true;
    video.volume = 0.9;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'metadata';
  });

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function syncSoundButton() {
    if (!soundControl) return;
    soundControl.classList.toggle('sound-on', soundEnabled);
    soundControl.setAttribute('aria-pressed', String(soundEnabled));
    soundControl.setAttribute('aria-label', soundEnabled ? 'Mute cinematic sound' : 'Turn cinematic sound on');
    if (soundIcon) soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundText) soundText.textContent = soundEnabled ? 'Sound On' : 'Tap for Sound';
  }

  function applySoundState() {
    videos.forEach((video, i) => {
      video.muted = !(soundEnabled && i === activeIndex);
    });
  }

  async function toggleSound() {
    soundEnabled = !soundEnabled;
    applySoundState();
    syncSoundButton();

    const current = videos[activeIndex];
    if (soundEnabled && current) {
      try { await current.play(); } catch (_) {}
    }
  }

  soundControl?.addEventListener('click', toggleSound);

  function setActive(index) {
    if (index === activeIndex) return;
    const previousIndex = activeIndex;
    activeIndex = index;

    videos.forEach((video, i) => {
      const on = i === index;
      video.classList.toggle('is-visible', on);
      video.muted = !(soundEnabled && on);

      if (on) {
        // When sound is active, each cinematic chapter starts cleanly from its
        // beginning as the visitor reaches it, giving continuous usable audio.
        if (soundEnabled && previousIndex !== index) {
          try { video.currentTime = 0; } catch (_) {}
        }
        if (!reduceMotion) video.play().catch(() => {});
      } else {
        video.pause();
        video.muted = true;
      }
    });

    copies.forEach((copy, i) => copy.classList.toggle('is-visible', i === index));
    if (counter) counter.textContent = String(index + 1).padStart(2, '0');
  }

  function update() {
    ticking = false;
    const rect = story.getBoundingClientRect();
    const scrollable = Math.max(1, story.offsetHeight - window.innerHeight);
    const travelled = clamp(-rect.top, 0, scrollable);
    const progress = travelled / scrollable;

    const sceneFloat = progress * videos.length;
    const index = Math.min(videos.length - 1, Math.floor(sceneFloat));
    setActive(index);

    if (progressFill) progressFill.style.width = `${progress * 100}%`;

    // Silent desktop mode uses gentle scroll-scrubbing. Once the visitor turns
    // sound on, normal playback is used so the original soundtrack stays clean.
    const mobile = window.matchMedia('(max-width: 700px)').matches;
    if (!mobile && !reduceMotion && !soundEnabled) {
      const current = videos[index];
      if (current && Number.isFinite(current.duration) && current.duration > 0) {
        const local = clamp(sceneFloat - index, 0, .999);
        const desired = local * current.duration;
        if (Math.abs(current.currentTime - desired) > .22) current.currentTime = desired;
      }
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  videos.forEach(v => v.addEventListener('loadedmetadata', requestUpdate, { once: true }));
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  // If the tab/app becomes hidden, mute/pause safely. Resume only the active
  // scene when the visitor comes back.
  document.addEventListener('visibilitychange', () => {
    const current = videos[activeIndex];
    if (document.hidden) {
      videos.forEach(v => v.pause());
    } else if (current && !reduceMotion) {
      applySoundState();
      current.play().catch(() => {});
    }
  });

  syncSoundButton();
  setActive(0);
  requestUpdate();
})();
