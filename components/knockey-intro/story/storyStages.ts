export type OledMode =
  | 'hello'
  | 'listening'
  | 'understanding'
  | 'memory'
  | 'expected'
  | 'notifying'
  | 'control'
  | 'responding'
  | 'ready';

export type StoryStage = {
  id: number;
  eyebrow?: string;
  headline: string;
  accent: string;
  description: string;
  label?: string;
  ringColor: string;
  oledMode: OledMode;
  sideUi?: 'transcript' | 'notification' | 'actions';
  singleLineHeadline?: boolean;
};

export const storyStages: StoryStage[] = [
  {
    id: 0,
    headline: 'Your door just got',
    accent: 'smarter.',
    description: 'Knockey turns the space outside your door into something your home can actually understand.',
    ringColor: '#8B5CFF',
    oledMode: 'hello',
  },
  {
    id: 1,
    headline: 'I',
    accent: 'listen.',
    description: 'Visitors don’t need an app or know how Knockey works. They can simply speak.',
    label: 'VOICE FIRST · NO APP REQUIRED',
    ringColor: '#FFB84D',
    oledMode: 'listening',
    sideUi: 'transcript',
    singleLineHeadline: true,
  },
  {
    id: 2,
    headline: 'I',
    accent: 'understand.',
    description: 'Knockey doesn’t just hear a voice. It understands who is there, why they came, and the context around the visit.',
    label: 'INTENT · CONTEXT · VISITOR',
    ringColor: '#955CFF',
    oledMode: 'understanding',
  },
  {
    id: 3,
    headline: 'I remember',
    accent: 'what matters.',
    description: 'With your permission, Knockey can learn the people, routines and preferences around your home.',
    label: 'PERSONAL · PRIVATE · USEFUL',
    ringColor: '#B18AFF',
    oledMode: 'memory',
  },
  {
    id: 4,
    headline: 'I know what',
    accent: 'you’re expecting.',
    description: 'Deliveries, scheduled visitors and household plans give Knockey context before someone arrives.',
    label: 'PLANS · SCHEDULES · MATCH',
    ringColor: '#91D874',
    oledMode: 'expected',
  },
  {
    id: 5,
    headline: 'And when you’re needed,',
    accent: 'I get you.',
    description: 'You get the useful part of the visit instantly, without figuring out what is happening first.',
    ringColor: '#9B4DFF',
    oledMode: 'notifying',
    sideUi: 'notification',
  },
  {
    id: 6,
    headline: 'You’re still',
    accent: 'in control.',
    description: 'Knockey handles the conversation. You decide what happens next.',
    ringColor: '#8B5CFF',
    oledMode: 'control',
    sideUi: 'actions',
  },
  {
    id: 7,
    headline: 'Sometimes, you don’t even need',
    accent: 'to answer.',
    description: 'Give Knockey simple rules and responses for moments you’d rather not interrupt your day.',
    ringColor: '#A56BFF',
    oledMode: 'responding',
  },
  {
    id: 8,
    headline: 'Made for where',
    accent: 'conversations begin.',
    description: 'Thoughtfully designed to blend in. Built to stay out and stay smart.',
    ringColor: '#8B5CFF',
    oledMode: 'ready',
  },
];
