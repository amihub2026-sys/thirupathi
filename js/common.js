// Shared site shell: cinematic loader, navigation and video footer.
const openingIntro = document.getElementById('openingIntro');
if (openingIntro) {
  window.scrollTo(0, 0);
  const finishOpening = () => {
    if (openingIntro.classList.contains('is-leaving')) return;
    openingIntro.classList.add('is-leaving');
    document.body.classList.remove('intro-active');
    window.scrollTo(0, 0);
    setTimeout(() => openingIntro.remove(), 800);
  };
  window.addEventListener('load', () => setTimeout(finishOpening, 2600), { once: true });
  setTimeout(finishOpening, 4800);
}

const currentPage = location.pathname.split('/').pop() || 'index.html';
const navItems = [
  ['index.html','Home'],['about.html','About'],['water.html','Our Water'],
  ['purification.html','Purification'],['quality.html','Quality & Safety'],
  ['sustainability.html','Sustainability'],['gallery.html','Gallery'],['contact.html','Contact']
];
const headerMount = document.querySelector('[data-header]');
if (headerMount) {
  const links = navItems.map(([href,label]) => `<a class="${currentPage===href?'active':''}" href="${href}">${label}</a>`).join('');
  headerMount.innerHTML = `
    <header class="site-header" data-site-header>
      <div class="container nav">
        <a class="brand" href="index.html" aria-label="THIRUPATHI AQUA home"><img src="assets/logo/logo.png" alt="THIRUPATHI AQUA logo"></a>
        <nav class="nav-links" aria-label="Primary navigation">${links}</nav>
        <a class="btn desktop-cta" href="contact.html">Contact Us</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span></button>
      </div>
    </header>
    <aside class="mobile-panel" aria-hidden="true">
      <div class="mobile-panel-inner">
        <div class="mobile-panel-top"><img class="mobile-panel-logo" src="assets/logo/logo.png" alt="THIRUPATHI AQUA"><button class="mobile-close" type="button" aria-label="Close menu">×</button></div>
        <nav class="mobile-links" aria-label="Mobile navigation">${links}</nav>
        <div class="mobile-panel-foot">Pure Water. Pure Life.</div>
      </div>
    </aside>`;
}

const footerMount = document.querySelector('[data-footer]');
if (footerMount) {
  footerMount.innerHTML = `
    <footer class="footer-video">
      <video class="footer-bg-video" autoplay muted loop playsinline preload="metadata" aria-hidden="true"><source src="assets/videos/scene-02.mp4" type="video/mp4"></video>
      <div class="footer-video-overlay"></div>
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand"><img src="assets/logo/logo.png" alt="THIRUPATHI AQUA"><p>Pure Water. Pure Life. Refreshing packaged drinking water made for everyday hydration.</p></div>
          <div class="footer-col"><h4>Company</h4><a href="about.html">About Us</a><a href="quality.html">Quality & Safety</a><a href="sustainability.html">Sustainability</a></div>
          <div class="footer-col"><h4>Explore</h4><a href="water.html">Our Water</a><a href="purification.html">Purification</a><a href="gallery.html">Gallery</a></div>
          <div class="footer-col footer-contact"><h4>Contact</h4><p>+91 98765 43210<br>info@thirupathiaqua.com<br>Madurai, Tamil Nadu, India</p></div>
        </div>
        <div class="footer-bottom"><span>© 2026 THIRUPATHI AQUA. All Rights Reserved.</span><span>Designed & Developed by AMI HUB</span></div>
      </div>
    </footer>`;
}

const siteHeader = document.querySelector('[data-site-header]');
const syncHeader = () => siteHeader?.classList.toggle('scrolled', scrollY > 28);
syncHeader(); addEventListener('scroll', syncHeader, { passive:true });

const panel = document.querySelector('.mobile-panel');
const toggle = document.querySelector('.nav-toggle');
const close = document.querySelector('.mobile-close');
const setMenu = (open) => {
  panel?.classList.toggle('open', open);
  panel?.setAttribute('aria-hidden', String(!open));
  toggle?.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('nav-open', open);
};
toggle?.addEventListener('click', () => setMenu(true));
close?.addEventListener('click', () => setMenu(false));
panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
