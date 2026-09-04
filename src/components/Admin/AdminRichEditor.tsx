import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Code,
  Undo,
  Redo,
  Video
} from 'lucide-react';

interface AdminRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const AdminRichEditor: React.FC<AdminRichEditorProps> = ({
  value,
  onChange,
  placeholder = 'এখানে সংবাদ বিস্তারিত লিখুন বা পেস্ট করুন...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    setHtmlContent(value);
  }, [value]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      onChange(html);
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlContent(val);
    onChange(val);
    if (editorRef.current) {
      editorRef.current.innerHTML = val;
    }
  };

  const insertLink = () => {
    const url = prompt('লিংক ইউআরএল লিখুন (https://...):');
    if (url) {
      exec('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('ছবির ইউআরএল দিন (https://...):');
    if (url) {
      const caption = prompt('ছবির ক্যাপশন দিন (ঐচ্ছিক):') || '';
      const html = `<figure class="my-4"><img src="${url}" class="w-full rounded-lg" alt="ছবি" />${caption ? `<figcaption class="text-center text-xs text-neutral-500 mt-1 italic">${caption}</figcaption>` : ''}</figure>`;
      exec('insertHTML', html);
    }
  };

  const insertVideoEmbed = () => {
    const url = prompt('ইউটিউব বা ভিডিও এম্বেড ইউআরএল দিন (e.g. https://www.youtube.com/embed/...):');
    if (url) {
      const html = `<div class="aspect-video w-full my-4 rounded-lg overflow-hidden"><iframe src="${url}" class="w-full h-full" frameborder="0" allowfullscreen></iframe></div>`;
      exec('insertHTML', html);
    }
  };

  return (
    <div className="border border-neutral-300 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Toolbar */}
      <div className="bg-neutral-100 border-b border-neutral-300 p-2 flex flex-wrap items-center gap-1 text-neutral-700 select-none">
        <button
          type="button"
          onClick={() => exec('undo')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="পূর্বাবস্থায় ফিরুন (Undo)"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('redo')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="পুনরায় করুন (Redo)"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1"></div>

        <button
          type="button"
          onClick={() => exec('bold')}
          className="p-1.5 rounded hover:bg-neutral-200 transition font-bold"
          title="বোল্ড (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="p-1.5 rounded hover:bg-neutral-200 transition italic"
          title="ইটালিক (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1"></div>

        <button
          type="button"
          onClick={() => exec('formatBlock', '<h2>')}
          className="p-1.5 rounded hover:bg-neutral-200 transition flex items-center text-xs font-bold"
          title="শিরোনাম ২ (H2)"
        >
          <Heading1 className="w-4 h-4 mr-0.5" /> H2
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<h3>')}
          className="p-1.5 rounded hover:bg-neutral-200 transition flex items-center text-xs font-bold"
          title="শিরোনাম ৩ (H3)"
        >
          <Heading2 className="w-4 h-4 mr-0.5" /> H3
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<p>')}
          className="px-2 py-1 rounded hover:bg-neutral-200 transition text-xs font-medium"
          title="প্যারাগ্রাফ (P)"
        >
          Paragraph
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1"></div>

        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="বুলেট লিস্ট"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="সংখ্যাযুক্ত লিস্ট"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', '<blockquote>')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="উদ্ধৃতি (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1"></div>

        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="বামে সারিবদ্ধ"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="মাঝামাঝি সারিবদ্ধ"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="ডানে সারিবদ্ধ"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-neutral-300 mx-1"></div>

        <button
          type="button"
          onClick={insertLink}
          className="p-1.5 rounded hover:bg-neutral-200 transition"
          title="লিংক যুক্ত করুন"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-1.5 rounded hover:bg-neutral-200 transition text-red-600"
          title="ছবি এম্বেড করুন"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={insertVideoEmbed}
          className="p-1.5 rounded hover:bg-neutral-200 transition text-red-600"
          title="ভিডিও এম্বেড করুন"
        >
          <Video className="w-4 h-4" />
        </button>

        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setShowHtml(!showHtml)}
            className={`p-1.5 rounded transition flex items-center gap-1 text-xs font-semibold ${
              showHtml ? 'bg-red-600 text-white' : 'hover:bg-neutral-200 text-neutral-600'
            }`}
            title="HTML সোর্স কোড"
          >
            <Code className="w-4 h-4" />
            <span>HTML</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      {showHtml ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          rows={14}
          className="w-full p-4 font-mono text-xs bg-neutral-900 text-emerald-400 focus:outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto article-prose focus:outline-none"
          data-placeholder={placeholder}
        />
      )}
    </div>
  );
};
