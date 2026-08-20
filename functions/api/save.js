export async function onRequestPost(context) {
  const { request, env } = context;
  const { token, gameId, data } = await request.json();

  if (!token || !gameId || data === undefined) {
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
  await env.GAME_USERS.put(saveKey, JSON.stringify(data));

  return new Response(JSON.stringify({ success: true, message: '存档已保存' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
