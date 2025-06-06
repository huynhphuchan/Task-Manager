// coreHTTP.js
class CoreHTTP {
  async get(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('GET request failed: ' + response.statusText);
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('POST request failed: ' + response.statusText);
    return response.json();
  }

  async put(url, data) {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('PUT request failed: ' + response.statusText);
    return response.json();
  }

  async delete(url) {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('DELETE request failed: ' + response.statusText);
    return response.json();
  }

  async patch(url, data) {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('PATCH request failed: ' + response.statusText);
    return response.json();
  }
}
