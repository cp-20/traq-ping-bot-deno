import { load } from 'https://deno.land/std@0.223.0/dotenv/mod.ts';
import { Api, Client } from 'npm:traq-bot-ts';

const env = await load();

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const api = new Api({
    baseApiParams: { headers: { Authorization: `Bearer ${env.TOKEN}` } },
  });
  const client = new Client({ token: env.TOKEN });

  client.on('MESSAGE_CREATED', async ({ body }) => {
    const {
      user: { name },
      plainText,
      channelId,
      createdAt,
    } = body.message;
    if (!plainText.includes('ping')) return;

    const ping = Date.now() - createdAt.getTime();

    const message = `@${name} pong! (${ping}ms)`;

    console.log(`Sending message: ${message}`);

    await api.channels.postMessage(channelId, {
      content: message,
      embed: true,
    });
  });

  client.listen(() => {
    console.log('Listening...');
  });
}
