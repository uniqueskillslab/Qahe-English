'use client';

import { useEffect, useState, useRef } from 'react';
import { Save, RotateCcw, Download } from 'lucide-react';

interface WritingEditorProps {
  /**
   * Initial text content
   */
  initialText?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * LocalStorage key for auto-saving
   */
  storageKey: string;
  /**
   * Callback when text changes
   */
  onChange?: (text: string) => void;
  /**
   * Callback when text is saved
   */
  onSave?: (text: string) => void;
  /**
   * Minimum height for the editor
   */
  minHeight?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export default function WritingEditor({
  initialText = '',
  placeholder = 'Start writing your response here...',
  storageKey,
  onChange,
  onSave,
  minHeight = 'min-h-[400px]',
  className = ''
}: WritingEditorProps) {
  const [text, setText] = useState(initialText);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load text from localStorage on mount
  useEffect(() => {
    const savedText = localStorage.getItem(storageKey);
    if (savedText && savedText !== initialText) {
      setText(savedText);
      onChange?.(savedText);
    }
  }, [storageKey, initialText, onChange]);

  // Auto-save with debouncing
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (text.trim()) {
        setIsSaving(true);
        localStorage.setItem(storageKey, text);
        setLastSaved(new Date());
        onSave?.(text);
        
        // Show saving indicator briefly
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 1000); // Save after 1 second of inactivity

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [text, storageKey, onSave]);

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange?.(newText);
  };

  // Manual save
  const handleSave = () => {
    localStorage.setItem(storageKey, text);
    setLastSaved(new Date());
    onSave?.(text);
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  // Clear/Reset text
  const handleClear = () => {
    if (confirm('Are you sure you want to clear all text? This action cannot be undone.')) {
      setText('');
      localStorage.removeItem(storageKey);
      onChange?.('');
      textareaRef.current?.focus();
    }
  };

  // Download as text file
  const handleDownload = () => {
    if (!text.trim()) {
      alert('Please write some content before downloading.');
      return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `ielts-writing-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return null;
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `Saved ${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `Saved ${Math.floor(diffInSeconds / 60)}m ago`;
    } else {
      return `Saved at ${lastSaved.toLocaleTimeString()}`;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800">Writing Editor</h3>
          
          {/* Save Status */}
          <div className="flex items-center space-x-2">
            {isSaving ? (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-medium">Saving...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center space-x-2 text-green-600">
                <Save className="w-4 h-4" />
                <span className="text-sm">{formatLastSaved()}</span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">Not saved</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              flex items-center space-x-2 px-3 py-1.5 rounded-lg
              bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300
              text-white text-sm font-medium transition-colors duration-200
            "
            title="Save Now"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className="
              flex items-center space-x-2 px-3 py-1.5 rounded-lg
              bg-green-500 hover:bg-green-600 disabled:bg-gray-300
              text-white text-sm font-medium transition-colors duration-200
            "
            title="Download as Text File"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button
            onClick={handleClear}
            className="
              flex items-center space-x-2 px-3 py-1.5 rounded-lg
              bg-red-500 hover:bg-red-600
              text-white text-sm font-medium transition-colors duration-200
            "
            title="Clear All Text"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Text Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          className={`
            w-full p-6 rounded-xl border-2 border-gray-200 
            focus:border-blue-400 focus:ring-4 focus:ring-blue-100
            resize-none transition-all duration-200
            text-gray-800 text-base leading-relaxed
            ${minHeight}
          `}
          style={{
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif'
          }}
        />

        {/* Character limit indicator (optional) */}
        {text.length > 1000 && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
            {text.length} characters
          </div>
        )}
      </div>

      {/* Writing Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="text-sm text-blue-800">
          <h4 className="font-semibold mb-2">💡 Writing Tips:</h4>
          <ul className="space-y-1 text-blue-700">
            <li>• Plan your response before writing</li>
            <li>• Use clear topic sentences for each paragraph</li>
            <li>• Check grammar and spelling before submitting</li>
            <li>• Your work is automatically saved every second</li>
          </ul>
        </div>
      </div>
    </div>
  );
}