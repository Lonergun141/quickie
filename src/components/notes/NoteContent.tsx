"use client";

import { RichTextEditor } from "./RichTextEditor";

interface NoteContentProps {
    isEditing: boolean;
    content: string;
    editedContent: string;
    onContentChange: (content: string) => void;
}

export function NoteContent({
    isEditing,
    content,
    editedContent,
    onContentChange,
}: NoteContentProps) {
    if (isEditing) {
        return (
            <section>
                <div className="border border-border rounded-xl overflow-hidden">
                    <RichTextEditor
                        value={editedContent}
                        onChange={onContentChange}
                        placeholder="Write your summary here..."
                    />
                </div>
            </section>
        );
    }

    return (
        <section>
            <div
                className="note-content"
                dangerouslySetInnerHTML={{ __html: content || '<p class="empty">No summary available</p>' }}
            />
            <style jsx global>{`
                .note-content {
                    line-height: 1.8;
                    color: hsl(var(--muted-foreground));
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    white-space: normal;
                }
                .note-content .empty {
                    font-style: italic;
                    opacity: 0.7;
                }
                .note-content h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: hsl(var(--foreground));
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.3;
                }
                .note-content h2 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-top: 1.75rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.4;
                }
                .note-content h3 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: hsl(var(--foreground));
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }
                .note-content p {
                    margin-bottom: 1rem;
                }
                .note-content ul, .note-content ol {
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .note-content ul {
                    list-style-type: disc;
                }
                .note-content ol {
                    list-style-type: decimal;
                }
                .note-content li {
                    margin-bottom: 0.5rem;
                }
                .note-content li ul, .note-content li ol {
                    margin-top: 0.5rem;
                    margin-bottom: 0;
                }
                .note-content strong {
                    font-weight: 600;
                    color: hsl(var(--foreground));
                }
                .note-content em {
                    font-style: italic;
                }
                .note-content code {
                    background: hsl(var(--muted));
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.9em;
                }
                .note-content pre {
                    background: hsl(var(--muted));
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                .note-content blockquote {
                    border-left: 3px solid hsl(var(--primary));
                    padding-left: 1rem;
                    margin: 1rem 0;
                    font-style: italic;
                    opacity: 0.9;
                }
                .note-content a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                }
                .note-content a:hover {
                    opacity: 0.8;
                }
            `}</style>
        </section>
    );
}
