import React from 'react';

interface Props {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const PREFERENCES = [
  "美食", "自然", "城市", "历史", "亲子", "蜜月", "摄影", "小众路线"
];

export const PreferenceSelector: React.FC<Props> = ({ selectedTags, onChange }) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {PREFERENCES.map(tag => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
              isSelected 
                ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};
