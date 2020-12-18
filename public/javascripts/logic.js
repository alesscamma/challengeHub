const milestoneAdd = document.getElementById('add-milestone');
const milestoneDiv = document.getElementById('milestones');

milestoneAdd.addEventListener('click', event => {
  const textarea = document.createElement('textarea');
  textarea.setAttribute('type', 'text');
  textarea.setAttribute('name', 'milestones');
  milestoneDiv.appendChild(textarea);
  event.preventDefault();
});






