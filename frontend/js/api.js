const request = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  const data = await res.json();
  return { ok: res.ok, data };
};

// Auth
const login = (username, password) =>
  request('/auth/login', 'POST', { username, password });

const register = (username, password, role) =>
  request('/auth/register', 'POST', { username, password, role });

// Strings
const getStrings = (sort = 'desc') => request(`/strings?sort=${sort}`);
const searchStrings = (query) => request(`/strings/search/${encodeURIComponent(query)}`);
const addString = (token, payload) => request('/strings', 'POST', payload, token);
const updateString = (token, id, payload) => request(`/strings/${id}`, 'PUT', payload, token);
const deleteString = (token, id) => request(`/strings/${id}`, 'DELETE', null, token);

// Translations
const getTranslations = (stringId) => request(`/translations/string/${stringId}`);
const submitTranslation = (token, payload) => request('/translations', 'POST', payload, token);
const approveTranslation = (token, id) => request(`/translations/${id}/approve`, 'PATCH', null, token);
const rejectTranslation = (token, id) => request(`/translations/${id}/reject`, 'PATCH', null, token);
const deleteTranslation = (token, id) => request(`/translations/${id}`, 'DELETE', null, token);