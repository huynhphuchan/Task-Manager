document.addEventListener('DOMContentLoaded', () => {
  const itemList = document.getElementById('item-list');
  const addItemForm = document.getElementById('add-item-form');
  const itemInput = document.getElementById('item-input');
  const coreHTTP = new CoreHTTP();

  // Function to refresh the list from server
  async function loadItems() {
    try {
      const items = await coreHTTP.get('/tm/tasks');
      itemList.innerHTML = '';

      items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        // Completed checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.completed;
        checkbox.title = "Mark as complete";
        checkbox.addEventListener("change", handleCompletionToggle(item._id, checkbox));
        li.appendChild(checkbox);

        // Task name span
        const nameSpan = document.createElement("span");
        nameSpan.textContent = item.name;
        if (item.completed) {
          nameSpan.style.textDecoration = "line-through";
          nameSpan.style.color = "#888";
        }
        li.appendChild(nameSpan);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit';
        editBtn.title = "Edit task";
        editBtn.onclick = () => editItem(item._id, item.name, li);
        li.appendChild(editBtn);

        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete';
        delBtn.title = "Delete task";
        delBtn.onclick = () => deleteItem(item._id);
        li.appendChild(delBtn);

        itemList.appendChild(li);
      });
    } catch (err) {
      alert('Error loading items: ' + err.message);
    }
  }

  // Add new item when form is submitted
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newItem = itemInput.value.trim();
    if (!newItem) return alert('Please enter an item');
    try {
      await coreHTTP.post('/tm/tasks', { name: newItem });
      itemInput.value = '';
      loadItems();
    } catch (err) {
      alert('Error adding item: ' + err.message);
    }
  });

  // Update task's completed status
  function handleCompletionToggle(id, checkboxEl) {
    return async function (e) {
      try {
        await coreHTTP.patch(`/tm/tasks/${id}`, { completed: e.target.checked });
        loadItems();
      } catch (err) {
        alert("Error updating completion: " + err.message);
        checkboxEl.checked = !e.target.checked; // rollback change on failure
      }
    };
  }

  // Delete item from server
  async function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await coreHTTP.delete(`/tm/tasks/${id}`);
      loadItems();
    } catch (err) {
      alert('Error deleting item: ' + err.message);
    }
  }

  // Edit item inline
  function editItem(id, oldValue, li) {
    li.innerHTML = '';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldValue;
    input.setAttribute('aria-label', 'Edit task');

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.title = 'Save changes';
    saveBtn.onclick = async () => {
      const updatedValue = input.value.trim();
      if (!updatedValue) return alert('Item cannot be empty');
      try {
        await coreHTTP.patch(`/tm/tasks/${id}`, { name: updatedValue });
        loadItems();
      } catch (err) {
        alert('Error updating item: ' + err.message);
      }
    };

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.title = 'Cancel editing';
    cancelBtn.onclick = () => loadItems();

    li.appendChild(input);
    li.appendChild(saveBtn);
    li.appendChild(cancelBtn);
  }

  // Initial page load
  loadItems();
});
