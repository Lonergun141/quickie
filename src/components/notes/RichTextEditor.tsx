"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-64 bg-muted/20 rounded-xl animate-pulse" />,
});

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "blockquote",
    "code-block",
    "link",
];

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
            <style jsx global>{`
                /* Editor container */
                .rich-text-editor .ql-container.ql-snow {
                    border: none;
                    font-family: inherit;
                    font-size: 1rem;
                    min-height: 400px;
                }
                
                .rich-text-editor .ql-editor {
                    min-height: 400px;
                    padding: 1.5rem;
                    line-height: 1.8;
                    color: inherit;
                }
                
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: var(--muted-foreground, #71717a);
                    font-style: normal;
                    left: 1.5rem;
                }

                /* Toolbar styling */
                .rich-text-editor .ql-toolbar.ql-snow {
                    border: none;
                    border-bottom: 1px solid var(--border, #e4e4e7);
                    padding: 12px 16px;
                    background: rgba(0, 0, 0, 0.02);
                }
                
                .dark .rich-text-editor .ql-toolbar.ql-snow {
                    background: rgba(255, 255, 255, 0.02);
                    border-bottom-color: rgba(255, 255, 255, 0.1);
                }

                /* Toolbar buttons */
                .rich-text-editor .ql-toolbar button {
                    width: 32px;
                    height: 32px;
                    padding: 4px;
                    border-radius: 6px;
                    margin-right: 2px;
                }
                
                .rich-text-editor .ql-toolbar button:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                .dark .rich-text-editor .ql-toolbar button:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Toolbar icons - default state */
                .rich-text-editor .ql-toolbar .ql-stroke {
                    stroke: #71717a;
                }
                
                .rich-text-editor .ql-toolbar .ql-fill {
                    fill: #71717a;
                }
                
                .rich-text-editor .ql-toolbar .ql-picker {
                    color: #71717a;
                }
                
                .rich-text-editor .ql-toolbar .ql-picker-label {
                    border: 1px solid transparent;
                    border-radius: 6px;
                    padding: 4px 8px;
                }
                
                .rich-text-editor .ql-toolbar .ql-picker-label:hover {
                    background: rgba(0, 0, 0, 0.05);
                }
                
                .dark .rich-text-editor .ql-toolbar .ql-picker-label:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Dark mode icon colors */
                .dark .rich-text-editor .ql-toolbar .ql-stroke {
                    stroke: #a1a1aa;
                }
                
                .dark .rich-text-editor .ql-toolbar .ql-fill {
                    fill: #a1a1aa;
                }
                
                .dark .rich-text-editor .ql-toolbar .ql-picker {
                    color: #a1a1aa;
                }

                /* Active/Hover state */
                .rich-text-editor .ql-toolbar button:hover .ql-stroke,
                .rich-text-editor .ql-toolbar button.ql-active .ql-stroke,
                .rich-text-editor .ql-toolbar .ql-picker-label:hover .ql-stroke,
                .rich-text-editor .ql-toolbar .ql-picker-item:hover .ql-stroke {
                    stroke: var(--primary, #6366f1);
                }
                
                .rich-text-editor .ql-toolbar button:hover .ql-fill,
                .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
                    fill: var(--primary, #6366f1);
                }
                
                .rich-text-editor .ql-toolbar button.ql-active {
                    background: rgba(99, 102, 241, 0.1);
                }

                /* Dropdown */
                .rich-text-editor .ql-toolbar .ql-picker-options {
                    background: white;
                    border: 1px solid #e4e4e7;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 4px;
                }
                
                .dark .rich-text-editor .ql-toolbar .ql-picker-options {
                    background: #18181b;
                    border-color: rgba(255, 255, 255, 0.1);
                }
                
                .rich-text-editor .ql-toolbar .ql-picker-item {
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                
                .rich-text-editor .ql-toolbar .ql-picker-item:hover {
                    background: rgba(0, 0, 0, 0.05);
                    color: inherit;
                }
                
                .dark .rich-text-editor .ql-toolbar .ql-picker-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }

                /* Editor content styling */
                .rich-text-editor .ql-editor h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                }
                
                .rich-text-editor .ql-editor h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.5rem;
                }
                
                .rich-text-editor .ql-editor h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .rich-text-editor .ql-editor p {
                    margin-bottom: 1rem;
                }
                
                .rich-text-editor .ql-editor ul,
                .rich-text-editor .ql-editor ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .rich-text-editor .ql-editor li {
                    margin-bottom: 0.25rem;
                }
                
                .rich-text-editor .ql-editor blockquote {
                    border-left: 3px solid var(--primary, #6366f1);
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    opacity: 0.9;
                }
                
                .rich-text-editor .ql-editor pre.ql-syntax {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 8px;
                    padding: 1rem;
                    overflow-x: auto;
                    font-family: monospace;
                }
                
                .dark .rich-text-editor .ql-editor pre.ql-syntax {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .rich-text-editor .ql-editor code {
                    background: rgba(0, 0, 0, 0.05);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                
                .dark .rich-text-editor .ql-editor code {
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .rich-text-editor .ql-editor strong {
                    font-weight: 600;
                }
                
                .rich-text-editor .ql-editor a {
                    color: var(--primary, #6366f1);
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}
