// backend/controllers/summaryController.ts
import type { Request, Response } from 'express';
import supabase from '../services/supabase';
import { getAiClient } from '../services/gemini';
import { postToSlack } from '../services/slack';

export async function summarizeTodos(
  req: Request,
  res: Response
): Promise<void> {
  try {
    console.log('Starting summarization process...');
    
    // 1) Fetch all pending todos
    const { data: pending, error } = await supabase
      .from('todos')
      .select('text')
      .eq('completed', false);

    if (error) {
      console.error('Supabase error:', error);
      res.status(500).json({ error: 'Failed to fetch todos.' });
      return;
    }

    console.log('Pending todos found:', pending?.length || 0);

    if (!pending?.length) {
      res.json({ message: '✅ No pending todos to summarize.' });
      return;
    }

    // 2) Build LLM prompt
    const list = pending.map((t, i) => `${i + 1}. ${t.text}`).join('\n');
    const prompt = `Here are my pending tasks:\n${list}\n\nPlease provide a concise, human-friendly summary in one paragraph.`;

    console.log('Generated prompt:', prompt);

    // 3) Call Gemini
    try {
      const ai = await getAiClient();
      console.log('AI client obtained successfully');
      
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const response = await result.response;
      const summary = response.text();
      
      if (!summary || summary.trim() === '') {
        throw new Error('Empty response from Gemini');
      }

      console.log('Generated summary:', summary);

      // 4) Post to Slack (if configured)
      try {
        await postToSlack(summary);
        console.log('Posted to Slack successfully');
      } catch (slackError) {
        console.warn('Slack posting failed:', slackError);
        // Don't fail the whole request if Slack fails
      }

      // 5) Return result
      res.json({ message: 'Summary generated successfully!', summary });
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      throw new Error(`AI generation failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`);
    }

  } catch (err: unknown) {
    console.error('Summarize error:', err);
    const msg = err instanceof Error ? err.message : 'Summarization failed.';
    res.status(500).json({ error: msg });
  }
}