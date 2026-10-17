// If you open index.html directly from your folder, call the local server.
// If the page is served by Express (or deployed), use relative URLs.
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = API_BASE + '/api/clubs';

const form = document.getElementById('clubForm');
const tableBody = document.getElementById('clubTable');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const messageBox = document.getElementById('message');
const fields = ['name', 'category', 'description', 'meeting_day', 'contact_email', 'members_count'];

let clubs = [];

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.style.color = isError ? '#d93025' : '#188038';
  setTimeout(() => (messageBox.textContent = ''), 3000);
}

function escapeHtml(v) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

async function loadClubs() {
  try {
    const res = await fetch(API);
    clubs = await res.json();
    render();
  } catch (err) {
    showMessage('Cannot reach the API. Is the server running?', true);
  }
}

function render() {
  tableBody.innerHTML = clubs.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.category)}</td>
      <td>${escapeHtml(c.meeting_day)}</td>
      <td>${escapeHtml(c.contact_email)}</td>
      <td>${c.members_count}</td>
      <td>${escapeHtml(c.description)}</td>
      <td>
        <button class="edit" onclick="startEdit(${c.id})">Edit</button>
        <button class="del" onclick="removeClub(${c.id})">Delete</button>
      </td>
    </tr>`).join('');
}

function startEdit(id) {
  const club = clubs.find(c => c.id === id);
  document.getElementById('clubId').value = club.id;
  fields.forEach(f => (document.getElementById(f).value = club[f] ?? ''));
  saveBtn.textContent = 'Update Club';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  form.reset();
  document.getElementById('clubId').value = '';
  document.getElementById('members_count').value = 0;
  saveBtn.textContent = 'Add Club';
  cancelBtn.style.display = 'none';
}

cancelBtn.addEventListener('click', resetForm);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('clubId').value;
  const body = {};
  fields.forEach(f => (body[f] = document.getElementById(f).value));

  try {
    const res = await fetch(id ? `${API}/${id}` : API, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) return showMessage(data.error || 'Something went wrong', true);
    showMessage(id ? 'Club updated' : 'Club created');
    resetForm();
    loadClubs();
  } catch (err) {
    showMessage('Request failed', true);
  }
});

async function removeClub(id) {
  if (!confirm('Delete this club?')) return;
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) return showMessage(data.error || 'Delete failed', true);
    showMessage('Club deleted');
    loadClubs();
  } catch (err) {
    showMessage('Request failed', true);
  }
}

loadClubs();
