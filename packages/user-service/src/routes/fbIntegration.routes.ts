import { Router, Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const router = Router();

// Middleware to require auth (simple JWT check)
function requireAuth(req: Request, res: Response, next: Function) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No authorization header' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
}

/**
 * Step: user obtains a short-lived Page Access Token after consenting via FB OAuth (not fully shown here).
 * This route exchanges for a long-lived token and stores it.
 */
router.post('/save-page-token', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const { pageId, shortLivedToken } = req.body;

    // Exchange short-lived token for long-lived token
    // https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing
    const fbAppId = process.env.FB_APP_ID;
    const fbAppSecret = process.env.FB_APP_SECRET;

    const exchangeUrl = `https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${fbAppId}&client_secret=${fbAppSecret}&fb_exchange_token=${shortLivedToken}`;
    const responseToken = await axios.get(exchangeUrl);
    const longLivedToken = responseToken.data.access_token;

    // Store in DB
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.fbPageId = pageId;
    user.fbPageAccessToken = longLivedToken;
    await user.save();

    return res.json({ message: 'Page token saved', pageId, longLivedToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Could not save page token' });
  }
});

/**
 * Example route to get the stored token. 
 */
router.get('/page-token', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    const user = await User.findByPk(userId);
    if (!user || !user.fbPageAccessToken) {
      return res.json({ token: null });
    }
    res.json({ pageToken: user.fbPageAccessToken, pageId: user.fbPageId });
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch page token' });
  }
});

export default router;
