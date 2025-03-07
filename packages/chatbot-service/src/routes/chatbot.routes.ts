import { Router, Request, Response } from 'express';
import axios from 'axios';
import { handleNLP } from '../wit/handleNLP';

const router = Router();

/**
 * Verification endpoint for Facebook Messenger Webhook
 */
router.get('/', (req: Request, res: Response) => {
  const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || '';
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

/**
 * Handle incoming messages
 */
router.post('/', async (req: Request, res: Response) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry: any) => {
      const webhookEvent = entry.messaging[0];
      if (webhookEvent && webhookEvent.message) {
        const senderId = webhookEvent.sender.id;
        const text = webhookEvent.message.text;
        processMessage(senderId, text);
      }
    });
    return res.status(200).send('EVENT_RECEIVED');
  } else {
    return res.sendStatus(404);
  }
});

/**
 * Processes user message and responds
 */
async function processMessage(senderId: string, message: string) {
  try {
    const responseText = await handleNLP(message);

    // In production: fetch user’s page token from user-service
    // Hard-coded or environment-based token for demonstration:
    const PAGE_TOKEN = process.env.PAGE_TOKEN || '<PAGE_ACCESS_TOKEN>';
    if (!PAGE_TOKEN) {
      console.error('No PAGE_TOKEN set!');
      return;
    }

    await axios.post(
      `https://graph.facebook.com/v15.0/me/messages?access_token=${PAGE_TOKEN}`,
      {
        recipient: { id: senderId },
        message: { text: responseText }
      }
    );
  } catch (err) {
    console.error('Error processing message: ', err);
  }
}

export default router;
