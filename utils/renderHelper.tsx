import React from 'react';
import katex from 'katex';

// Render text containing inline math ($...$) and bold markers (**...**)
export const renderInlineContent = (text: string, boldClassName = "font-bold text-slate-900") => {
  if (!text) return null;

  // Split by:
  // 1. $...$ for inline math (capture group)
  // 2. **...** for bold text (capture group)
  // Priority: Math takes precedence to avoid parsing ** inside math as bold.
  // Regex: /(\$[^\$]+?\$|\*\*.+?\*\*)/g
  const parts = text.split(/(\$[^\$]+?\$|\*\*.+?\*\*)/g);

  return parts.map((part, index) => {
    // Inline Math
    if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1);
      try {
        const html = katex.renderToString(math, { 
          displayMode: false, 
          throwOnError: false,
          output: 'html', // Generate HTML for accessibility and performance
          strict: false
        });
        // Use a wrapper to ensure vertical alignment of math with text
        return <span key={index} className="inline-math-wrapper" dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return <code key={index} className="text-red-500 bg-red-50 px-1 rounded">{part}</code>;
      }
    } 
    // Bold Text
    else if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className={boldClassName}>{part.slice(2, -2)}</strong>;
    } 
    // Plain Text
    else {
      return <span key={index}>{part}</span>;
    }
  });
};
