const milestoneAdd = document.getElementById('add-milestone');
const milestoneDiv = document.getElementById('milestones');

milestoneAdd.addEventListener('click', event => {
  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'milestones');
  milestoneDiv.appendChild(input);
  event.preventDefault();
});






