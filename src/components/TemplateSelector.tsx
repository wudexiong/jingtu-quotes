import React from 'react';
import { useQuoteCardStore } from '../store/quoteCardStore';

const TemplateSelector: React.FC = () => {
  const { templates, selectedTemplate, selectTemplate } = useQuoteCardStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">选择模板</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => selectTemplate(template.id)}
            className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${selectedTemplate === template.id ? 'border-indigo-500 shadow-lg' : 'border-gray-200 hover:border-gray-400'}`}
          >
            <div
              className="h-32 flex items-center justify-center text-white font-medium"
              style={{
                backgroundColor: template.background,
                fontFamily: template.font,
              }}
            >
              <div className="text-center px-4">
                <p style={{ color: template.textColor }}>"示例语录"</p>
                <p className="text-sm mt-2" style={{ color: template.authorColor }}>— 作者</p>
              </div>
            </div>
            <div className="p-3 text-center font-medium">
              {template.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
