const milestoneAdd = document.getElementById('add-milestone');
const milestoneDiv = document.getElementById('milestones');

milestoneAdd.addEventListener('click', event => {
  const div = document.createElement('div');
  const textarea = document.createElement('textarea');
  textarea.setAttribute('type', 'text');
  textarea.setAttribute('name', 'milestones');
  textarea.classList.add('form-control');
  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-btn');
  removeButton.innerHTML="Remove milestone";
  removeButton.onclick = event => {
    removeButton.parentNode.parentNode.removeChild(div);
    event.preventDefault();
  };
  div.appendChild(textarea);
  div.appendChild(removeButton);
  milestoneDiv.appendChild(div);
  event.preventDefault();
});

