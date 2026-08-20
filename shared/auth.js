const GameAuth = (function() {
  const API_BASE = '/api';

  function getToken() {
    return localStorage.getItem('game_auth_token');
  }

  function setToken(token) {
    if (token) localStorage.setItem('game_auth_token', token);
    else localStorage.removeItem('game_auth_token');
  }

  function getUsername() {
    return localStorage.getItem('game_auth_username');
  }

  function setUsername(username) {
    if (username) localStorage.setItem('game_auth_username', username);
    else localStorage.removeItem('game_auth_username');
  }

  async function post(path, body) {
    try {
      const res = await fetch(API_BASE + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      return await res.json();
    } catch (e) {
      return { error: '网络错误，请稍后重试' };
    }
  }

  return {
    register: async function(username, password) {
      const result = await post('/register', { username, password });
      return result;
    },

    login: async function(username, password) {
      const result = await post('/login', { username, password });
      if (result.success && result.token) {
        setToken(result.token);
        setUsername(result.username);
      }
      return result;
    },

    logout: function() {
      setToken(null);
      setUsername(null);
    },

    isLoggedIn: function() {
      return !!getToken();
    },

    getUsername: function() {
      return getUsername();
    },

    saveProgress: async function(gameId, data) {
      const token = getToken();
      if (!token) return { error: '未登录' };
      return await post('/save', { token, gameId, data });
    },

    loadProgress: async function(gameId) {
      const token = getToken();
      if (!token) return { error: '未登录' };
      return await post('/load', { token, gameId });
    }
  };
})();
