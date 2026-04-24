import React, { useState } from 'react';
import { useQuoteCardStore } from '../store/quoteCardStore';
import { Trash2, Plus } from 'lucide-react';

const QuoteInput: React.FC = () => {
  const { quotes, addQuote, removeQuote, updateQuote } = useQuoteCardStore();
  const [newQuote, setNewQuote] = useState({ text: '', author: '' });

  const handleAddQuote = () => {
    if (newQuote.text.trim()) {
      addQuote(newQuote.text, newQuote.author);
      setNewQuote({ text: '', author: '' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">语录管理</h2>
      </div>
      
      <div className="space-y-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex flex-col space-y-2 p-4 border rounded-lg">
            <textarea
              value={quote.text}
              onChange={(e) => updateQuote(quote.id, e.target.value, quote.author)}
              placeholder="输入语录内容"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <input
              type="text"
              value={quote.author}
              onChange={(e) => updateQuote(quote.id, quote.text, e.target.value)}
              placeholder="作者"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => removeQuote(quote.id)}
              className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-700"
            >
              <Trash2 size={16} />
              删除
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col space-y-2 p-4 border border-dashed rounded-lg">
        <textarea
          value={newQuote.text}
          onChange={(e) => setNewQuote({ ...newQuote, text: e.target.value })}
          placeholder="输入新语录内容"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={3}
        />
        <input
          type="text"
          value={newQuote.author}
          onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
          placeholder="作者"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddQuote}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus size={16} />
          添加语录
        </button>
      </div>
    </div>
  );
};

export default QuoteInput;
