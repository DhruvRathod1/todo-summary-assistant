// backend/services/slack.ts
import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

export async function postToSlack(message: string): Promise<void> {
  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
    return;
  }

  try {
    await axios.post(SLACK_WEBHOOK_URL, {
      text: `📝 Todo Summary:\n${message}`,
    });
    console.log('Posted to Slack successfully');
  } catch (error) {
    console.error('Failed to post to Slack:', error);
    throw error;
  }
}