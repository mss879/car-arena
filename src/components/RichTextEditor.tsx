import React, { useRef, useEffect, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({ value, onChange, placeholder = "Enter vehicle description...", disabled }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const isFirstRender = useRef(true);

  // Sync state to innerHTML only when there's an external update (e.g. form reset or load)
  useEffect(() => {
    if (editorRef.current) {
      // If it's the first render, or the external value doesn't match the current content
      if (isFirstRender.current || (editorRef.current.innerHTML !== value && value !== undefined)) {
        editorRef.current.innerHTML = value || "";
        isFirstRender.current = false;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If the editor is empty (e.g. user cleared it), send empty string
      if (html === "<br>" || html === "") {
        onChange("");
      } else {
        onChange(html);
      }
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    if (disabled) return;
    document.execCommand(command, false, arg);
    handleInput();
    // Re-focus the editor if it lost focus
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div 
      className={`border rounded-md overflow-hidden bg-black/40 transition-all duration-200 ${
        isFocused ? "border-[#C2A661] ring-1 ring-[#C2A661]/40" : "border-white/10"
      }`}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 bg-zinc-950 p-1 border-b border-white/10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("bold")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("italic")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("underline")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <span className="h-4 w-px bg-white/10 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("insertUnorderedList")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("insertOrderedList")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <span className="h-4 w-px bg-white/10 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("formatBlock", "<h1>")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          disabled={disabled}
          className="h-8 w-8 text-white/70 hover:text-white hover:bg-zinc-800 disabled:opacity-50"
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            handleInput();
          }}
          className="min-h-[160px] max-h-[400px] overflow-y-auto p-3 text-white focus:outline-none prose prose-invert prose-sm max-w-none text-justify"
          style={{ caretColor: "#C2A661" }}
        />
        {!value && (
          <div className="absolute top-3 left-3 text-zinc-500 pointer-events-none text-sm select-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
