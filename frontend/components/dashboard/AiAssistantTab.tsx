'use client';

import React, { useState } from 'react';
import {
  Bot,
  Check,
  Copy,
  Database,
  Send,
  Sparkles,
  User,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  citations?: { code: string; title: string }[];
  timestamp: string;
}

const AUDIENCE_LEVELS = [
  { id: 'researcher', label: 'Researcher' },
  { id: 'student', label: 'Student' },
  { id: 'public', label: 'Public' },
];

const PRESET_QUERIES = [
  'What research has been conducted on Antarctic climate change?',
  'Which datasets describe sea-ice variability in the Weddell Sea?',
  'Compare temperature observations at Maitri and Bharati stations.',
  'Show current observations that differ significantly from the historical average.',
];

const MOCK_ANSWERS: Record<string, { answer: string; citations: { code: string; title: string }[] }> = {
  'What research has been conducted on Antarctic climate change?': {
    answer:
      'Extensive multidisciplinary research on Antarctic climate change has been undertaken by NCPOR researchers across Dronning Maud Land and Princess Elizabeth Land:\n\n1. **Long-Term Surface Temperature Trends**: Instrumental series at Maitri (1989-2024) and Bharati (2012-2024) reveal pronounced seasonal warming patterns modulated by the positive phase of the Southern Annular Mode (SAM).\n2. **Ice-Core Paleoclimatology**: High-resolution ice cores from Central Dronning Maud Land provide 500-year records of stable isotopes (δ18O) and wildfire biomass plumes from the Southern Hemisphere.\n3. **Marine Biosphere Responses**: Multi-year oceanographic surveys demonstrate that declining winter sea ice in Prydz Bay stimulates micro-diatom to nanoflagellate shifts in coastal phytoplankton biomass.',
    citations: [
      { code: 'NCPOR-CLM-0094', title: 'Antarctic Peninsula air temperature reanalysis' },
      { code: 'NCPOR-GLC-0312', title: 'Dronning Maud Land ice core stable isotope record' },
      { code: 'NCPOR-BIO-0073', title: 'Antarctic coastal phytoplankton biomass survey' },
    ],
  },
  'Which datasets describe sea-ice variability in the Weddell Sea?': {
    answer:
      'The primary NCPOR dataset for Weddell Sea sea ice is **NCPOR-SI-0207** (*Weddell Sea sea-ice thickness composite*).\n\n- **Parameters**: Sea Ice Thickness, Snow Depth, Freeboard Height, and Ice Concentration.\n- **Sensors Used**: CryoSat-2 SARIn altimetry merged with ICESat-2 laser profiles and calibrated via helicopter electromagnetic induction soundings.\n- **Temporal Coverage**: 2010-09 to 2026-05 with 12.5 km polar stereographic resolution.',
    citations: [
      { code: 'NCPOR-SI-0207', title: 'Weddell Sea sea-ice thickness composite' },
      { code: 'NCPOR-SI-0228', title: 'Ross Sea polynya extent record' },
    ],
  },
  'Compare temperature observations at Maitri and Bharati stations.': {
    answer:
      '**Maitri Station (Schirmacher Oasis, 70°46\'S)**:\n- Mean Annual Temperature: -10.8°C\n- Winter Low: -25.2°C (August)\n- Summer High: -2.1°C (January)\n- Characteristics: Inland rocky oasis with strong katabatic wind forcing and lower maritime moderating influence.\n\n**Bharati Station (Larsemann Hills, 69°24\'S)**:\n- Mean Annual Temperature: -9.8°C\n- Winter Low: -21.1°C (August)\n- Summer High: -0.8°C (January)\n- Characteristics: Coastal fjord location with marine buffering, leading to ~2-4°C warmer winter minimums compared to Maitri.',
    citations: [
      { code: 'IN-MAITRI', title: 'Maitri Meteorological Base Station' },
      { code: 'IN-BHARATI', title: 'Bharati Polar Observatory' },
    ],
  },
};

export function AiAssistantTab() {
  const theme = useAuthStore((state) => state.theme);
  const isDark = theme !== 'light';

  const [level, setLevel] = useState('researcher');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: 'Greetings! I am the NCPOR Polar Research Assistant. I provide evidence-based answers exclusively synthesized from approved Indian Antarctic and Arctic research records, sensor feeds, and peer-reviewed literature. How can I assist your investigation today?',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const matched = MOCK_ANSWERS[q];
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text:
          matched?.answer ||
          `Based on indexed NCPOR records for "${q}", our database contains multiple relevant datasets and observational transects. Researchers have characterized this domain during Indian Scientific Expeditions (ISEA) with validated parameters stored in the national repository.`,
        citations: matched?.citations || [
          { code: 'NCPOR-CLM-0094', title: 'Antarctic Climate Records' },
        ],
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
        <div>
          <h1 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0b1721]'}`}>
            <Sparkles className="w-5 h-5 text-[#008b8b]" />
            <span>Polar Research Assistant</span>
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#8aa0b3]' : 'text-[#5a6f82]'}`}>
            Answers synthesized strictly from approved NCPOR datasets, publications, and stations.
          </p>
        </div>

        {/* Audience Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
          {AUDIENCE_LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setLevel(lvl.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                level === lvl.id
                  ? 'bg-[#008b8b] text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-white'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Prompts */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        {PRESET_QUERIES.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(p)}
            className={`text-xs px-3 py-1.5 rounded-full border text-left transition ${
              isDark
                ? 'bg-[#0f2233] border-white/10 text-[#c7d8e8] hover:bg-[#008b8b]/20 hover:text-[#5fd0c4]'
                : 'bg-white border-[#e5e7eb] text-[#4b5563] hover:bg-[#e0f2f7] hover:text-[#008b8b]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div
        className={`flex-1 overflow-y-auto p-4 rounded-2xl border space-y-4 ${
          isDark ? 'bg-[#091826] border-white/10' : 'bg-white border-[#e5e7eb]'
        }`}
      >
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              {isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#008b8b] text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  isAssistant
                    ? isDark
                      ? 'bg-[#0f2233] text-gray-200 border border-white/5'
                      : 'bg-[#f4f7f9] text-[#0b1721] border border-gray-200'
                    : 'bg-[#008b8b] text-white'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-white/10 space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-[#5fd0c4] flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      <span>Verified NCPOR Citations</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-black/20 text-[10px] font-mono text-cyan-200"
                        >
                          [{c.code}] {c.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {isAssistant && (
                  <div className="mt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-gray-400 hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {!isAssistant && (
                <div className="w-8 h-8 rounded-lg bg-[#0B5C8E] text-white flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#5fd0c4]">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Consulting NCPOR research databases...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Ask about polar climate, sea-ice models, expeditions, or station sensors..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className={`flex-1 h-11 px-4 text-xs rounded-xl outline-none border transition ${
            isDark
              ? 'bg-[#0f2233] border-white/10 text-white placeholder-[#6d849b] focus:border-[#008b8b]'
              : 'bg-white border-[#e5e7eb] text-[#0b1721] placeholder-[#9aa5b1] focus:border-[#008b8b]'
          }`}
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputQuery.trim()}
          className="h-11 px-5 rounded-xl bg-[#008b8b] hover:bg-[#007575] disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
