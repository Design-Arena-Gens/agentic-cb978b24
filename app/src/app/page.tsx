'use client';

import { FormEvent, useMemo, useState } from "react";
import { simulateAgent, type AgentSimulation } from "@/lib/agent";
import { agentCapabilities, agentTools } from "@/lib/tools";

type UserMessage = {
  id: string;
  role: "user";
  content: string;
  timestamp: Date;
};

type AgentMessage = {
  id: string;
  role: "agent";
  prompt: string;
  simulation: AgentSimulation;
  timestamp: Date;
};

type ConversationItem = UserMessage | AgentMessage;

const starterPrompt =
  "Draft a product launch playbook for our AI knowledge base including research, a rollout plan, and stakeholder comms.";
const starterSimulation = simulateAgent(starterPrompt);
const initialConversation: ConversationItem[] = [
  {
    id: crypto.randomUUID(),
    role: "user",
    content: starterPrompt,
    timestamp: new Date(),
  },
  {
    id: crypto.randomUUID(),
    role: "agent",
    prompt: starterPrompt,
    simulation: starterSimulation,
    timestamp: new Date(),
  },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] =
    useState<ConversationItem[]>(initialConversation);
  const [isProcessing, setIsProcessing] = useState(false);

  const relativeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed || isProcessing) return;

    const userMessage: UserMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setConversation((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsProcessing(true);

    window.setTimeout(() => {
      const simulation = simulateAgent(trimmed);
      const agentMessage: AgentMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        prompt: trimmed,
        simulation,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, agentMessage]);
      setIsProcessing(false);
    }, 420);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.25),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(212,212,255,0.18),_transparent_60%)]" />
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-16 lg:gap-16 lg:px-12">
        <header className="grid gap-8 lg:grid-cols-[1.6fr,1fr] lg:items-end">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-sky-100 shadow-lg shadow-sky-500/30 backdrop-blur">
              Agentic Workflow OS
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Orchestrate every tool with one AI operator.
            </h1>
            <p className="max-w-2xl text-lg text-slate-200/80">
              Feed messy requests into the AI Tool Agent and watch it plan,
              execute, and report using your preferred stack. Visualize the
              plan, inspect tool calls, and share polished summaries without
              leaving the flow.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-sky-500/10 backdrop-blur md:flex-row md:items-center"
            >
              <label className="sr-only" htmlFor="prompt">
                Ask the AI Tool Agent
              </label>
              <input
                id="prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe the outcome you need…"
                className="flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-slate-100 outline-none ring-2 ring-transparent transition focus:ring-sky-400"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isProcessing}
              >
                {isProcessing ? "Synthesizing…" : "Generate plan"}
              </button>
            </form>
            <dl className="grid gap-6 text-sm text-slate-200/80 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Average turnaround
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  &lt; 6 seconds
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Tool automations
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">+45</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Retained context window
                </dt>
                <dd className="mt-1 text-lg font-semibold text-white">
                  90 days
                </dd>
              </div>
            </dl>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-sky-500/20 backdrop-blur">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-100">
              What the agent excels at
            </h2>
            <ul className="space-y-3 text-sm text-slate-200/80">
              {agentCapabilities.map((capability) => (
                <li
                  key={capability.title}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-lg shadow-slate-900/20"
                >
                  <p className="font-semibold text-white">{capability.title}</p>
                  <p className="mt-1 text-slate-200/75">{capability.details}</p>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.8fr,1fr] xl:gap-12">
          <section className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold uppercase tracking-wide text-slate-300">
                  Live agent transcript
                </h2>
                <p className="text-sm text-slate-400">
                  Inspect every reasoning step, tool call, and resulting output.
                </p>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200/80">
                Replay
              </div>
            </div>
            <div className="space-y-6">
              {conversation.map((message) =>
                message.role === "user" ? (
                  <article
                    key={message.id}
                    className="ml-auto max-w-xl rounded-2xl border border-sky-300/30 bg-sky-400/10 px-5 py-4 text-sm text-slate-200 shadow-lg shadow-sky-500/20"
                  >
                    <header className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-sky-200">
                      <span>Request</span>
                      <time>{relativeFormatter.format(message.timestamp)}</time>
                    </header>
                    <p className="leading-relaxed text-slate-100">
                      {message.content}
                    </p>
                  </article>
                ) : (
                  <article
                    key={message.id}
                    className="max-w-xl rounded-3xl border border-white/10 bg-white/5 px-5 py-5 text-sm text-slate-200 shadow-xl shadow-slate-900/40"
                  >
                    <header className="mb-4 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
                      <span>AI Tool Agent</span>
                      <time>{relativeFormatter.format(message.timestamp)}</time>
                    </header>
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Execution plan
                        </p>
                        <ol className="mt-2 space-y-2">
                          {message.simulation.plan.map((step, index) => (
                            <li
                              key={step.id}
                              className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-900/60 px-4 py-3"
                            >
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-400/20 text-xs font-semibold text-sky-100">
                                {index + 1}
                              </span>
                              <p className="text-slate-100">{step.text}</p>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Tool calls
                        </p>
                        <div className="space-y-3">
                          {message.simulation.actions.map((action) => (
                            <div
                              key={action.id}
                              className="rounded-2xl border border-white/5 bg-white/5 p-4"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-white">
                                  {action.tool.name}
                                </h3>
                                <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-100">
                                  {action.tool.category}
                                </span>
                              </div>
                              <p className="mt-2 text-slate-200/80">
                                {action.rationale}
                              </p>
                              <ul className="mt-3 space-y-2 text-xs text-slate-300/80">
                                {action.artifacts.map((artifact, idx) => (
                                  <li
                                    key={`${action.id}-artifact-${idx}`}
                                    className="rounded-xl border border-white/5 bg-slate-900/60 px-3 py-2"
                                  >
                                    {artifact}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-3 text-sm font-medium text-slate-100">
                                Outcome · {action.outcome}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                        <p className="font-semibold uppercase tracking-wide">
                          Final brief
                        </p>
                        <p className="mt-1 text-emerald-50">
                          {message.simulation.summary}
                        </p>
                        <footer className="mt-3 flex flex-wrap gap-2 text-xs text-emerald-200/80">
                          <span className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-3 py-1">
                            Confidence: {message.simulation.confidence}
                          </span>
                          {message.simulation.followUps.map((followUp) => (
                            <span
                              key={followUp}
                              className="rounded-full border border-emerald-200/30 bg-emerald-200/10 px-3 py-1"
                            >
                              {followUp}
                            </span>
                          ))}
                        </footer>
                      </div>
                    </div>
                  </article>
                ),
              )}
              {isProcessing && (
                <article className="flex max-w-xl items-center gap-3 rounded-2xl border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-xs font-medium text-sky-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-200" />
                  Agent thinking through tools…
                </article>
              )}
            </div>
          </section>

          <aside className="flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-900/30 backdrop-blur">
            <div>
              <h2 className="text-base font-semibold uppercase tracking-wide text-slate-300">
                Connected toolkit
              </h2>
              <p className="text-sm text-slate-400">
                Swap or customize any tool. The agent adapts instantly.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {agentTools.map((tool) => (
                <div
                  key={tool.id}
                  className="space-y-2 rounded-2xl border border-white/5 bg-slate-950/60 p-4 shadow-lg shadow-slate-900/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {tool.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {tool.category}
                      </p>
                    </div>
                    <span className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-100">
                      Ready
                    </span>
                  </div>
                  <p className="text-sm text-slate-200/90">{tool.headline}</p>
                  <p className="text-xs text-slate-400">{tool.description}</p>
                  <p className="text-xs font-medium text-sky-200">
                    {tool.usage}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
