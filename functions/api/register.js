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
  const existing = await env.GAME_USERS.get(userKey);

  if (existing) {
    return new Response(JSON.stringify({ error: '用户名已存在' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.GAME_USERS.put(userKey, JSON.stringify({ username, password }));

  return new Response(JSON.stringify({ success: true, message: '注册成功' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
