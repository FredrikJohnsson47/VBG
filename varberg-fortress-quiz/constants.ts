import { QuizItem } from './types';

export const IMAGE_URL = 'https://i.imgur.com/42u9s8c.jpeg';

export const QUIZ_DATA: QuizItem[] = [
  {
    id: 1,
    name: "Vita munken",
    question: "Klicka på Vita munken",
    position: { top: '24%', left: '13.7%' }, // Position confirmed by user
  },
  {
    id: 2,
    name: "Grå munken",
    question: "Klicka på Grå munken",
    position: { top: '30%', left: '90.5%' }, 
  },
  {
    id: 3,
    name: "Röda munken",
    question: "Klicka på Röda munken",
    position: { top: '61%', left: '91%' },
  },
  {
    id: 4,
    name: "Dammbastionen",
    question: "Klicka på Dammbastionen",
    position: { top: '67.5%', left: '59.9%' }, // Fine-tuned for precise centering
  },
  {
    id: 5,
    name: "Smedjebastionen",
    question: "Klicka på Smedjebastionen",
    position: { top: '63%', left: '18.5%' }, // Fine-tuned for precise centering
  },
];