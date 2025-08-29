import { useState, useRef, useEffect } from 'react';
import { Send, Pin, PinOff, Plus, MessageSquare } from 'lucide-react';

const ChatInterface = () => {

  const initialChats = [
    {
      id: 1,
      title: "Alpie Launch Checklist",
      description: "End-to-end steps for web app GA: auth, chat, workspaces, memory review, logging.",
      tags: ["launch", "product", "memory"],
      author: "team@169pi.com",
      created_at: "2025-08-20T10:00:00Z",
      pinned: false
    },
    {
      id: 2,
      title: "Vibe Coding – MVP Scope",
      description: "Run Python snippets safely, view live output, store run history, and allow replay.",
      tags: ["vibe-coding", "mvp", "python"],
      author: "eng@169pi.com",
      created_at: "2025-08-21T09:25:00Z",
      pinned: true
    },
    {
      id: 3,
      title: "Memory Design Notes",
      description: "Explicit saves, consent UI, project-level memory, and visibility of all recalls.",
      tags: ["memory", "design", "consent"],
      author: "ux@169pi.com",
      created_at: "2025-08-22T14:12:00Z",
      pinned: false
    },
    {
      id: 4,
      title: "Education: Reasoning Benchmarks",
      description: "Focus on math/logic datasets; target latency and accuracy improvements.",
      tags: ["education", "benchmarks", "reasoning"],
      author: "research@169pi.com",
      created_at: "2025-08-19T08:02:00Z",
      pinned: false
    },
    {
      id: 5,
      title: "Workspace UX Ideas",
      description: "Pin messages to memory panel, rename sessions, quick filters by tag.",
      tags: ["ux", "workspace", "memory"],
      author: "design@169pi.com",
      created_at: "2025-08-25T17:40:00Z",
      pinned: true
    }
  ];

  const [chats, setChats] = useState(initialChats);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const inputRef = useRef(null);

  const sortedChats = [...chats].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleSubmit = (e, shouldPin = false) => {
    e.preventDefault();
    if (!currentPrompt.trim()) return;

    const newChat = {
      id: Date.now(),
      title: currentPrompt.slice(0, 50) + (currentPrompt.length > 50 ? '...' : ''),
      description: currentPrompt,
      tags: ['user-chat'],
      author: 'user',
      created_at: new Date().toISOString(),
      pinned: shouldPin
    };

    setChats(prev => [newChat, ...prev]);
    setCurrentPrompt('');
    setSelectedChatId(newChat.id);
  };

  const togglePin = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
    ));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'i' && currentPrompt.trim()) {
        e.preventDefault();
        handleSubmit(e, true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPrompt]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <button className="flex items-center gap-2 w-full p-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" /> 
            <span className="text-sm">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                selectedChatId === chat.id
                  ? 'bg-gray-800 border border-gray-600'
                  : 'hover:bg-gray-800 border border-transparent'
              }`}
            >
              {chat.pinned && (
                <div className="absolute top-2 right-2">
                  <Pin className="w-3 h-3 text-yellow-500 fill-current" />
                </div>
              )}

              <div className="pr-8">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                  {chat.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                  {chat.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {chat.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{formatDate(chat.created_at)}</span>
                  <span className="truncate ml-2">{chat.author}</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(chat.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700 rounded"
              >
                {chat.pinned ? (
                  <PinOff className="w-3 h-3" />
                ) : (
                  <Pin className="w-3 h-3" />
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            Press <kbd className="px-1 bg-gray-800 rounded">Ctrl+P</kbd> to pin chat
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedChatId ? (
            <div className="max-w-3xl mx-auto">
              {chats.find(chat => chat.id === selectedChatId) && (
                <div className="mb-8">
                  <h1 className="text-2xl font-semibold mb-4">
                    {chats.find(chat => chat.id === selectedChatId).title}
                  </h1>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300">
                      {chats.find(chat => chat.id === selectedChatId).description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl text-gray-400 mb-2">Welcome to ChatAI</h2>
                <p className="text-gray-500">Start a conversation or select a chat from the sidebar</p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="flex items-end space-x-3 bg-gray-800 rounded-2xl p-2">
                <textarea
                  ref={inputRef}
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e, false);
                    }
                  }}
                  placeholder="Message ChatAI..."
                  className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-400 max-h-32 min-h-[24px] py-2 px-3"
                  rows="1"
                />
                <button
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={!currentPrompt.trim()}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPrompt.trim()
                      ? 'bg-white text-gray-900 hover:bg-gray-200'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Enter to send, Shift+Enter for new line, Cmd+i to pin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;