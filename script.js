// Header scroll state (fix to top when scrolled)
const header = document.querySelector('.header');
const headerMark = document.querySelector('.header__mark');
const DARK_ZONES = '.hero, .tech-panel, .section--teal, .footer';
let lastScrollY = window.scrollY;
const toggleHeader = () => {
  const y = window.scrollY;
  header.classList.toggle('header--fixed', y > 100);
  // Hide the logo while scrolling down so it never sits on top of the text; bring it back on scroll up
  if (y <= 100 || y < lastScrollY - 2) header.classList.remove('header--hidden');
  else if (y > lastScrollY + 2) header.classList.add('header--hidden');
  lastScrollY = y;
  // Pick the logo color from whatever sits behind the logo right now
  const r = headerMark.getBoundingClientRect();
  const behind = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    .find(el => !el.closest('.header, .follow'));
  header.classList.toggle('header--on-light', !(behind && behind.closest(DARK_ZONES)));
};
window.addEventListener('scroll', toggleHeader, { passive: true });
toggleHeader();

// Follow banner: shown after the hero, hidden while the contact section or footer is on screen
const follow = document.querySelector('.follow');
const hero = document.querySelector('.hero');
const hideZones = new Set();
const toggleFollow = () => {
  const pastHero = window.scrollY > hero.offsetHeight - 120;
  follow.classList.toggle('is-visible', pastHero && hideZones.size === 0);
};
const zoneIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) hideZones.add(e.target);
    else hideZones.delete(e.target);
  }
  toggleFollow();
}, { rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('#contact, .footer').forEach(el => zoneIO.observe(el));
window.addEventListener('scroll', toggleFollow, { passive: true });
toggleFollow();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

// Item reveal: cards, tables and photos appear one by one as they enter the screen
const revealItems = document.querySelectorAll('.feat-item, .bonus, .tech-card, .full-img, .cmp-table, .spec-list, .store-card, .why-pills li, .why-card, .salon-card, .size-fig');
revealItems.forEach((el) => {
  el.classList.add('reveal-item');
  if (el.matches('.tech-card, .why-pills li')) {
    el.style.setProperty('--i', [...el.parentElement.children].indexOf(el));
  }
});
const itemIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      itemIO.unobserve(e.target);
    }
  }
}, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
revealItems.forEach(el => itemIO.observe(el));
