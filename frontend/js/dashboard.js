let token = localStorage.getItem('token') || '';
let currentSort = 'desc';

function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function loadStrings() {
  const res = await fetch(`${API}/strings`);
  const data = await res.json();

  const select = document.getElementById('stringSelect');
  if (select) {
    select.innerHTML = '<option value="">Select a string...</option>';
    data.forEach(s => {
      select.innerHTML += `<option value="${s.id}">[${s.key}] ${s.source_text}</option>`;
    });
  }
}

async function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const url = query
    ? `${API}/strings/search/${encodeURIComponent(query)}`
    : `${API}/strings`;

  const res = await fetch(url);
  const data = await res.json();
  const container = document.getElementById('searchResults');

  if (!data || !data.length) {
    container.innerHTML = '<p>No results found.</p>';
    return;
  }

  container.innerHTML = data.map(s => `
    <div class="card">
      <h3>${s.key}</h3>
      <p>${s.source_text}</p>
      ${s.context ? `<small>Context: ${s.context}</small>` : ''}
    </div>
  `).join('');
}

async function handleSubmitTranslation() {
  const msg = document.getElementById('translateMsg');
  const string_id = document.getElementById('stringSelect').value;
  const language_code = document.getElementById('langCode').value;
  const translated_text = document.getElementById('translatedText').value.trim();

  if (!token) {
    msg.textContent = 'Please login first.';
    msg.style.color = 'red';
    return;
  }

  if (!string_id || !translated_text) {
    msg.textContent = 'Please fill in all fields.';
    msg.style.color = 'red';
    return;
  }

  const res = await fetch(`${API}/translations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ string_id, language_code, translated_text })
  });

  const data = await res.json();
  if (res.ok) {
    msg.textContent = 'Translation submitted successfully!';
    msg.style.color = 'green';
    document.getElementById('translatedText').value = '';
  } else {
    msg.textContent = data.error || 'Error occurred.';
    msg.style.color = 'red';
  }
}

window.onload = () => {
  token = localStorage.getItem('token') || '';
  loadStrings();
  handleSearch();
};