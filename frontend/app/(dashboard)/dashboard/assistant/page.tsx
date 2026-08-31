'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Bot, SendHorizonal, Sparkles, User as UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, apiErrorMessage } from '@/lib/api';
import type { AssistantAnswer } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Ask me about sea ice extent, datasets, publications, expeditions, stations, scientists or recent environmental events. Every answer is generated live from the Polar Nexus PostgreSQL database.',
    },
  ]);

  const suggestionsQuery = useQuery({
    queryKey: ['assistant-suggestions'],
    queryFn: async () => (await api.get<string[]>('/ai-assistant/suggestions')).data,
  });

  const ask = useMutation({
    mutationFn: async (value: string) => {
      const { data } = await api.post<AssistantAnswer>('/ai-assistant/ask', { question: value });
      return data;
    },
    onSuccess: (data) =>
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: data.answer, sources: data.sources },
      ]),
    onError: (error) =>
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: apiErrorMessage(error, 'The assistant is unavailable.') },
      ]),
  });

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setQuestion('');
    ask.mutate(trimmed);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Polar data assistant</h1>
        <p className="mt-1 text-sm text-slate-400">
          Grounded answers computed from live database queries — no external LLM required.
        </p>
      </div>

      <Card className="flex-1">
        <CardContent className="space-y-4 py-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn('flex gap-3', message.role === 'user' ? 'flex-row-reverse' : '')}
            >
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                  message.role === 'assistant'
                    ? 'bg-ice-500/15 text-ice-300'
                    : 'bg-aurora-violet/20 text-aurora-violet',
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
              </span>
              <div
                className={cn(
                  'max-w-[80%] whitespace-pre-wrap rounded-2xl border border-white/10 p-4 text-sm',
                  message.role === 'assistant'
                    ? 'bg-white/5 text-slate-200'
                    : 'bg-ice-500/10 text-slate-100',
                )}
              >
                {message.content}
                {message.sources && message.sources.length > 0 ? (
                  <p className="mt-3 text-xs text-slate-500">Sources: {message.sources.join(', ')}</p>
                ) : null}
              </div>
            </div>
          ))}
          {ask.isPending ? (
            <p className="text-sm text-slate-500">Querying the polar database…</p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {(suggestionsQuery.data ?? []).map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => submit(suggestion)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10"
          >
            <Sparkles className="h-3 w-3 text-ice-300" />
            {suggestion}
          </button>
        ))}
      </div>

      <form
        className="flex gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit(question);
        }}
      >
        <Input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="How much has Arctic sea ice changed this year?"
        />
        <Button type="submit" loading={ask.isPending}>
          <SendHorizonal className="h-4 w-4" /> Ask
        </Button>
      </form>
    </div>
  );
}
