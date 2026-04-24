import React, { useRef, useEffect } from 'react';
import QuoteInput from '../components/QuoteInput';
import TemplateSelector from '../components/TemplateSelector';
import CardPreview from '../components/CardPreview';
import ExportButton from '../components/ExportButton';
import { useQuoteCardStore } from '../store/quoteCardStore';

const Home: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { loadFromUrl } = useQuoteCardStore();

  useEffect(() => {
    loadFromUrl();
  }, [loadFromUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            语录卡片生成器
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            选择语录，选择模板，创建美观的卡片并导出为图片
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <QuoteInput />
            <TemplateSelector />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <CardPreview ref={cardRef} />
            <ExportButton cardRef={cardRef} />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>通过URL参数加载语录: ?quotes=语录1|语录2&author=作者</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
