const idButton = document.getElementById('filter');
const filterForm = document.getElementById('filter-form');

idButton.addEventListener('click', () => {
   filterForm.classList.toggle('appear');
})