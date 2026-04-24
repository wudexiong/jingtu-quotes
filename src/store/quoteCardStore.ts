import { create } from 'zustand';

interface Quote {
  id: string;
  text: string;
  author: string;
}

interface Template {
  id: string;
  name: string;
  background: string;
  textColor: string;
  authorColor: string;
  font: string;
  layout: string;
}

interface CardConfig {
  width: number;
  height: number;
  padding: number;
  borderRadius: number;
}

interface QuoteCardState {
  quotes: Quote[];
  selectedTemplate: string;
  cardConfig: CardConfig;
  templates: Template[];
  addQuote: (text: string, author: string) => void;
  removeQuote: (id: string) => void;
  updateQuote: (id: string, text: string, author: string) => void;
  selectTemplate: (templateId: string) => void;
  updateCardConfig: (config: Partial<CardConfig>) => void;
  loadFromUrl: () => void;
}

const defaultTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Classic',
    background: '#6366f1',
    textColor: '#ffffff',
    authorColor: '#e0e7ff',
    font: 'Playfair Display',
    layout: 'center',
  },
  {
    id: 'template2',
    name: 'Minimal',
    background: '#ffffff',
    textColor: '#1f2937',
    authorColor: '#6b7280',
    font: 'Inter',
    layout: 'center',
  },
  {
    id: 'template3',
    name: 'Elegant',
    background: '#f43f5e',
    textColor: '#ffffff',
    authorColor: '#fee2e2',
    font: 'Playfair Display',
    layout: 'center',
  },
  {
    id: 'template4',
    name: 'Modern',
    background: '#1f2937',
    textColor: '#ffffff',
    authorColor: '#9ca3af',
    font: 'Inter',
    layout: 'center',
  },
];

export const useQuoteCardStore = create<QuoteCardState>((set, get) => ({
  quotes: [],
  selectedTemplate: 'template1',
  cardConfig: {
    width: 600,
    height: 400,
    padding: 40,
    borderRadius: 12,
  },
  templates: defaultTemplates,
  
  addQuote: (text, author) => {
    const newQuote: Quote = {
      id: Date.now().toString(),
      text,
      author,
    };
    set((state) => ({ quotes: [...state.quotes, newQuote] }));
  },
  
  removeQuote: (id) => {
    set((state) => ({ quotes: state.quotes.filter((quote) => quote.id !== id) }));
  },
  
  updateQuote: (id, text, author) => {
    set((state) => ({
      quotes: state.quotes.map((quote) =>
        quote.id === id ? { ...quote, text, author } : quote
      ),
    }));
  },
  
  selectTemplate: (templateId) => {
    set({ selectedTemplate: templateId });
  },
  
  updateCardConfig: (config) => {
    set((state) => ({
      cardConfig: { ...state.cardConfig, ...config },
    }));
  },
  
  loadFromUrl: () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quotesParam = urlParams.get('quotes');
    const authorParam = urlParams.get('author');
    
    if (quotesParam) {
      const quotesArray = quotesParam.split('|');
      const newQuotes: Quote[] = quotesArray.map((text, index) => ({
        id: `url-${index}`,
        text,
        author: authorParam || '',
      }));
      set({ quotes: newQuotes });
    }
  },
}));

export type { Quote, Template, CardConfig };
