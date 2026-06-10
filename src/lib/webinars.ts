export type Speaker = {
  name: string;
  image: string;
};

export type AgendaItem = {
  lead: string;
  text: string;
};

export type Webinar = {
  slug: string;
  episode: string;
  series: string;
  titleLine1: string;
  titleLine2: string;
  title: string;
  description: string;
  dateISO: string;
  dateLabel: string;
  dateShort: string;
  timeLabel: string;
  duration: string;
  mailchimpTag: string;
  agenda: AgendaItem[];
  speakers: Speaker[];
  icsStartUTC: string;
  icsEndUTC: string;
};

export const UPCOMING_WEBINAR: Webinar = {
  slug: "what-is-a-context-engine",
  episode: "Episode 01",
  series: "The Context Engine series",
  titleLine1: "What is a Context Engine —",
  titleLine2: "and why your agents need one.",
  title: "What is a Context Engine — and why your agents need one",
  description:
    "Coding agents don't fail because the model is weak — they fail because they're fed the wrong context. We break down what a context engine actually is, why it's becoming core infrastructure, and what the data says about the performance you get back.",
  dateISO: "2026-06-25T15:00:00+02:00",
  dateLabel: "Thursday, June 25, 2026",
  dateShort: "Thu, June 25 2026",
  timeLabel: "15:00 CET",
  duration: "45 min talk + live Q&A",
  mailchimpTag: "webinar-context-engine-ep01",
  agenda: [
    { lead: "What a Context Engine is", text: "the layer between your org and your agents." },
    { lead: "Why you need one", text: "the cost, quality, and context-window problem." },
    { lead: "Studies on optimizing performance", text: "what ranking & pruning buys you." },
  ],
  speakers: [
    { name: "Viktor Zeman", image: "/webinar/speaker-viktor.png" },
    { name: "Yasha Boroumand", image: "/webinar/speaker-yasha.png" },
    { name: "Štefan Moravík", image: "/webinar/speaker-stefan.png" },
  ],
  icsStartUTC: "20260625T130000Z",
  icsEndUTC: "20260625T134500Z",
};
