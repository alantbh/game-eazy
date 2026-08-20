export async function onRequestPost(context) {
  const { request, env } = context;
  const { token, gameId } = await request.json();

  if (!token || !gameId) {
    return new Response(JSON.stringify({ error: '参数不完整' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const tokenKey = `token:${token}`;
  const username = await env.GAME_USERS.get(tokenKey);

  if (!username) {
    return new Response(JSON.stringify({ error: '登录已过期，请重新登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const saveKey = `save:${username}:${gameId}`;
  const saveData = await env.GAME_USERS.get(saveKey);

  if (!saveData) {
    return new Response(JSON.stringify({ success: true, data: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ success: true, data: JSON.parse(saveData) }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
