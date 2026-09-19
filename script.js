'use strict';
// One CSS construction, reused in all three illustrations.
const originalModel = document.querySelector('.hero-model');
document.querySelectorAll('[data-model]').forEach(slot => {
  const model = originalModel.cloneNode(true);
  model.classList.remove('hero-model');
  model.removeAttribute('role');
  model.removeAttribute('aria-label');
  model.setAttribute('aria-hidden', 'true');
  slot.append(model);
});
const header = document.querySelector('header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 16);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function closeMenu(returnFocus = false) {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Открыть меню');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 851px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
// Native anchor navigation preserves URL/history; CSS supplies smooth scrolling.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('motion-ready');
}
const angle = document.querySelector('#angle');
const output = document.querySelector('#angle-output');
const adjustableModel = document.querySelector('[data-model="interactive"] .model');
function updateAngle() {
  const degrees = Number(angle.value);
  adjustableModel.style.setProperty('--angle', degrees + 'deg');
  angle.style.setProperty('--progress', degrees / 45 * 100 + '%');
  output.value = 'Угол: ' + degrees + '°';
  angle.setAttribute('aria-valuetext', degrees + ' градусов');
}
angle.addEventListener('input', updateAngle);
updateAngle();
// A missing photograph leaves the designed placeholder visible.
const photo = document.querySelector('.prototype-photo img');
function updatePhoto() {
  photo.closest('.prototype-photo').classList.toggle('has-photo', photo.complete && photo.naturalWidth > 0);
}
photo.addEventListener('load', updatePhoto);
photo.addEventListener('error', updatePhoto);
updatePhoto();
const visual = document.querySelector('.hero-visual');
const finePointer = window.matchMedia('(pointer: fine)');
let frame = 0;
visual.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const bounds = visual.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    originalModel.style.setProperty('--mx', x * 10 + 'px');
    originalModel.style.setProperty('--my', y * 8 + 'px');
  });
});
visual.addEventListener('pointerleave', () => {
  cancelAnimationFrame(frame);
  originalModel.style.setProperty('--mx', '0px');
  originalModel.style.setProperty('--my', '0px');
});
