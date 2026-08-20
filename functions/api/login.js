export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, password } = await request.json();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: '用户名和密码不能为空' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const userKey = `user:${username}`;
  const userData = await env.GAME_USERS.get(userKey);

  if (!userData) {
    return new Response(JSON.stringify({ error: '用户不存在' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const user = JSON.parse(userData);
  if (user.password !== password) {
    return new Response(JSON.stringify({ error: '密码错误' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = btoa(username + ':' + Date.now());
  const tokenKey = `token:${token}`;
  // 7天过期（604800秒）
  await env.GAME_USERS.put(tokenKey, username, { expirationTtl: 604800 });

  return new Response(JSON.stringify({ success: true, token, username }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
