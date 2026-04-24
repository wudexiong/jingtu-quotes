import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  cardRef: React.RefObject<HTMLDivElement>;
}

const ExportButton: React.FC<ExportButtonProps> = ({ cardRef }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!cardRef.current) return;

    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `quote-card-${Date.now()}.png`;
      link.click();
    } catch (error) {
      console.error('导出失败:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">导出卡片</h2>
      
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <Download size={18} />
        {isExporting ? '导出中...' : '导出为图片'}
      </button>
      
      <p className="text-sm text-gray-600">
        点击按钮将卡片导出为PNG图片，可直接用于社交媒体分享
      </p>
    </div>
  );
};

export default ExportButton;
