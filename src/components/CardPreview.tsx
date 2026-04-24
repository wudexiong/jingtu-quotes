import React, { useRef } from 'react';
import { useQuoteCardStore } from '../store/quoteCardStore';

interface CardPreviewProps {
  ref: React.Ref<HTMLDivElement>;
}

const CardPreview: React.FC<CardPreviewProps> = ({ ref }) => {
  const { quotes, selectedTemplate, cardConfig, templates } = useQuoteCardStore();
  
  const currentTemplate = templates.find(t => t.id === selectedTemplate) || templates[0];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">卡片预览</h2>
      
      <div className="flex justify-center">
        <div
          ref={ref}
          className="shadow-xl"
          style={{
            width: `${cardConfig.width}px`,
            height: `${cardConfig.height}px`,
            borderRadius: `${cardConfig.borderRadius}px`,
            backgroundColor: currentTemplate.background,
            padding: `${cardConfig.padding}px`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: currentTemplate.font,
          }}
        >
          {quotes.length > 0 ? (
            quotes.map((quote, index) => (
              <div key={quote.id} className={`${index > 0 ? 'mt-8' : ''}`}>
                <p 
                  className="text-lg md:text-xl" 
                  style={{ color: currentTemplate.textColor }}
                >
                  "{quote.text}"
                </p>
                {quote.author && (
                  <p 
                    className="mt-4 text-sm md:text-base" 
                    style={{ color: currentTemplate.authorColor }}
                  >
                    — {quote.author}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p style={{ color: currentTemplate.textColor }}>请添加语录</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
