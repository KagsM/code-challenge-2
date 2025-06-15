  document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.form-container');
  const tableBody = document.querySelector('.guest-table tbody');
  const searchInput = document.querySelector('.search-input');

  let guestArray = [];

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const category = document.getElementById('category').value;

    if (!firstName || !lastName) {
      alert('Please enter both first and last names.');
      return;
    }

    if (tableBody.children.length >= 10) {
      alert('Guest limit reached. Only 10 guests allowed.');
      return;
    }

    const fullName = `${firstName} ${lastName}`;
    const timeAdded = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newGuest = {
      id: Date.now(),
      name: fullName,
      category,
      time: timeAdded,
    };

    guestArray.unshift(newGuest);

    if (guestArray.length > 10) guestArray.pop();

    renderTable(guestArray);
    form.reset();
  });

  function renderTable(data) {
    tableBody.innerHTML = '';

    data.forEach(guest => {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td><span class="guest-name">${guest.name}</span></td>
        <td><span class="badge ${getBadgeClass(guest.category)}">${guest.category}</span></td>
        <td>${guest.time}</td>
        <td>
          <a href="#" class="edit" data-id="${guest.id}">Edit</a> |
          <a href="#" class="delete" data-id="${guest.id}">Delete</a>
        </td>
      `;

      tableBody.appendChild(row);
    });
  }

  function getBadgeClass(category) {
    switch (category.toLowerCase()) {
      case 'friend': return 'blue';
      case 'family': return 'green';
      case 'colleague': return 'purple';
      default: return 'silver';
    }
  }

  tableBody.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (e.target.classList.contains('delete')) {
      guestArray = guestArray.filter(g => g.id !== id);
      renderTable(guestArray);
    }

    if (e.target.classList.contains('edit')) {
      const guest = guestArray.find(g => g.id === id);
      if (guest) {
        const newName = prompt("Edit Name:", guest.name);
        const newCategory = prompt("Edit Category (Friend, Family, Colleague):", guest.category);

        if (newName && newCategory) {
          guest.name = newName.trim();
          guest.category = newCategory.trim();
          renderTable(guestArray);
        }
      }
    }
  });

  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = guestArray.filter(g => g.name.toLowerCase().includes(term));
    renderTable(filtered);
  });
  });