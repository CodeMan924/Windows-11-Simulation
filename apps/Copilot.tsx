
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paperclip, X, Image as ImageIcon, Download } from 'lucide-react';
import { chatWithGemini, ChatMessage } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
  images?: string[]; // Contains base64 data URIs
}

const Copilot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm your Windows Copilot. I can help you write code, draft emails, or even generate and edit images." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ data: string, mimeType: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract base64 and mime
        const match = result.match(/^data:(.*);base64,(.*)$/);
        if (match) {
          setAttachedImage({
            mimeType: match[1],
            data: match[2]
          });
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = () => {
    setAttachedImage(null);
  };

  const downloadImage = (dataUri: string) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `copilot-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMsgText = input.trim();
    const userImage = attachedImage ? `data:${attachedImage.mimeType};base64,${attachedImage.data}` : undefined;
    
    // Optimistic Update
    const newUserMsg: Message = { 
      role: 'user', 
      text: userMsgText,
      images: userImage ? [userImage] : []
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setAttachedImage(null);
    setIsLoading(true);

    // Prepare History
    const history: ChatMessage[] = messages.map(m => {
      const parts: any[] = [];
      if (m.text) parts.push({ text: m.text });
      if (m.images) {
        m.images.forEach(img => {
          const match = img.match(/^data:(.*);base64,(.*)$/);
          if (match) {
            parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
          }
        });
      }
      return { role: m.role, parts };
    });

    try {
      // Call API
      const response = await chatWithGemini(
        userMsgText, 
        attachedImage?.data || null, 
        attachedImage?.mimeType || null, 
        history
      );

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text, 
        images: response.images 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 select-text">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'model' ? 'bg-indigo-600 text-white' : 'bg-slate-300 text-slate-600'
            }`}>
              {msg.role === 'model' ? <Bot size={18} /> : <User size={18} />}
            </div>
            
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.images && msg.images.map((img, idx) => (
                <div key={idx} className="relative group inline-block">
                  <img 
                    src={img} 
                    alt="Generated or uploaded content" 
                    className="rounded-lg max-w-full border border-slate-200 shadow-sm block" 
                    style={{ maxHeight: '250px' }}
                  />
                  <button 
                    onClick={() => downloadImage(img)}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                </div>
              ))}
              {msg.text && (
                <div className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'model' 
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-sm' 
                    : 'bg-indigo-600 text-white'
                }`}>
                  {msg.text}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-pulse">
                <Sparkles size={16} />
             </div>
             <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-sm text-slate-400">
               Thinking...
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-200 select-none">
        {attachedImage && (
          <div className="mb-2 flex items-center gap-2 bg-slate-100 rounded-lg p-2 w-fit">
            <div className="w-10 h-10 bg-slate-200 rounded overflow-hidden">
               <img src={`data:${attachedImage.mimeType};base64,${attachedImage.data}`} className="w-full h-full object-cover" alt="preview" />
            </div>
            <span className="text-xs text-slate-500 max-w-[100px] truncate">Image attached</span>
            <button onClick={removeAttachment} className="p-1 hover:bg-slate-300 rounded-full"><X size={12} /></button>
          </div>
        )}
        
        <div className="flex gap-2 bg-slate-100 rounded-lg p-2 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-md transition-colors"
            title="Attach image"
          >
            <Paperclip size={16} />
          </button>
          
          <input 
            type="text" 
            placeholder="Ask me anything or describe an image..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 text-slate-900 select-text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoFocus
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !attachedImage)}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Copilot;
