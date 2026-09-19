document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const quoteForm = document.getElementById('quoteForm');
const formSuccess = document.getElementById('formSuccess');
quoteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }
  formSuccess.classList.add('visible');
  quoteForm.reset();
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
