'use server';

import Anthropic from '@anthropic-ai/sdk';
import { rateLimit } from '@/lib/rateLimit';
import { buildUserMessage, MAX_INPUT_LENGTH, SYSTEM_PROMPT } from './prompt';

export type TranslateState =
  | { status: 'idle' }
  | { status: 'done'; input: string; translation: string }
  | { status: 'error'; input: string; message: string };

export const translate = async (
  _previous: TranslateState,
  formData: FormData
): Promise<TranslateState> => {
  const input = String(formData.get('text') ?? '').trim();

  if (!input) {
    return {
      status: 'error',
      input,
      message: 'Du måste ju för i helvete skriva något.',
    };
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return {
      status: 'error',
      input,
      message: `Max ${MAX_INPUT_LENGTH} tecken. Ingen orkar läsa mer än så, inte ens jag.`,
    };
  }

  const allowed = await rateLimit('oversatt', {
    requests: 10,
    window: '1 h',
    windowMs: 60 * 60 * 1000,
  });

  if (!allowed) {
    return {
      status: 'error',
      input,
      message:
        'Nu har du översatt tillräckligt för en timme. Gå ut och ta en jävla promenad.',
    };
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 2000,
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(input) }],
    });

    if (response.stop_reason === 'refusal') {
      return {
        status: 'error',
        input,
        message: 'Det där vägrar jag översätta. Skärp dig för i helvete.',
      };
    }

    const translation = response.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('')
      .trim();

    if (!translation) {
      return {
        status: 'error',
        input,
        message: 'Jag blev helt mållös. Prova igen.',
      };
    }

    return { status: 'done', input, translation };
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return {
        status: 'error',
        input,
        message: 'För många som översätter samtidigt. Vänta en jävla stund.',
      };
    }

    console.error('translate failed', error);
    return {
      status: 'error',
      input,
      message: 'Något gick åt helvete. Prova igen om en stund.',
    };
  }
};
