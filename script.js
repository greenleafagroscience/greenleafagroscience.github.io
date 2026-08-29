const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

const filters = document.querySelectorAll('.filter');
const products = document.querySelectorAll('.product-card');
filters.forEach(filter => filter.addEventListener('click', () => {
  filters.forEach(button => button.classList.remove('active'));
  filter.classList.add('active');
  const selected = filter.dataset.filter;
  products.forEach(card => card.classList.toggle('hidden', selected !== 'all' && card.dataset.category !== selected));
}));

const modal = document.querySelector('.product-modal');
const modalImage = document.querySelector('#modal-image');
const modalTitle = document.querySelector('#modal-title');
const modalCounter = document.querySelector('#modal-counter');
const previousButton = document.querySelector('.image-prev');
const nextButton = document.querySelector('.image-next');
let activeImages = [];
let activeImage = 0;

function renderModalImage() {
  modalImage.src = activeImages[activeImage];
  modalImage.alt = `${modalTitle.textContent} product pack, view ${activeImage + 1}`;
  const multiple = activeImages.length > 1;
  previousButton.style.display = multiple ? 'block' : 'none';
  nextButton.style.display = multiple ? 'block' : 'none';
  modalCounter.textContent = multiple ? `${activeImage + 1} of ${activeImages.length} pack views` : 'Product pack view';
}

products.forEach(card => card.addEventListener('click', () => {
  activeImages = card.dataset.images.split(',');
  activeImage = 0;
  modalTitle.textContent = card.dataset.name;
  renderModalImage();
  modal.showModal();
  document.body.classList.add('modal-open');
}));

function moveImage(direction) {
  activeImage = (activeImage + direction + activeImages.length) % activeImages.length;
  renderModalImage();
}
previousButton.addEventListener('click', event => { event.stopPropagation(); moveImage(-1); });
nextButton.addEventListener('click', event => { event.stopPropagation(); moveImage(1); });

function closeModal() {
  modal.close();
  document.body.classList.remove('modal-open');
}
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
modal.addEventListener('close', () => document.body.classList.remove('modal-open'));

document.querySelector('#year').textContent = new Date().getFullYear();
