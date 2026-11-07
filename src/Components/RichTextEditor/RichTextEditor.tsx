'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Code2,
    Link2,
    RemoveFormatting,
    Undo2,
    Redo2,
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: number;
    ariaLabel?: string;
}

const ToolButton = ({
    onCommand,
    label,
    children,
}: {
    onCommand: () => void;
    label: string;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        title={label}
        aria-label={label}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCommand}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-body)] transition-colors hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]"
    >
        {children}
    </button>
);

const Divider = () => <span className="mx-1 h-5 w-px bg-[var(--admin-border)]" aria-hidden />;

const normalizeUrl = (raw: string) => {
    const value = raw.trim();
    if (!value) return null;
    const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : `https://${value}`;
    try {
        const url = new URL(candidate);
        return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? candidate : null;
    } catch {
        return null;
    }
};

const RichTextEditor = ({
    value,
    onChange,
    placeholder = 'Start writing…',
    minHeight = 140,
    ariaLabel = 'Rich text editor',
}: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const lastValue = useRef(value);

    // Only write from React when the change came from outside and the user is
    // not typing, otherwise the caret would jump to the beginning.
    useEffect(() => {
        const el = editorRef.current;
        if (!el || value === lastValue.current) return;
        if (document.activeElement === el) return;
        el.innerHTML = value || '';
        lastValue.current = value;
    }, [value]);

    useEffect(() => {
        const el = editorRef.current;
        if (!el) return;
        el.innerHTML = value || '';
        lastValue.current = value;
        try {
            document.execCommand('defaultParagraphSeparator', false, 'p');
        } catch {
            // Older browsers do not support this command; the editor still works.
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sync = useCallback(() => {
        const html = editorRef.current?.innerHTML ?? '';
        lastValue.current = html;
        onChange(html);
    }, [onChange]);

    const run = useCallback(
        (command: string, argument?: string) => {
            editorRef.current?.focus();
            document.execCommand(command, false, argument);
            sync();
        },
        [sync]
    );

    const addLink = () => {
        const url = window.prompt('Link URL', 'https://');
        const safeUrl = url ? normalizeUrl(url) : null;
        if (!safeUrl) {
            if (url) window.alert('Please enter a valid http(s) or mailto link.');
            return;
        }
        run('createLink', safeUrl);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-soft)] transition-colors focus-within:ring-1 focus-within:ring-purple-500">
            <div
                role="toolbar"
                aria-label={`${ariaLabel} formatting`}
                className="flex flex-wrap items-center gap-0.5 border-b border-[var(--admin-border)] bg-[var(--admin-soft-2)] px-2 py-1.5"
            >
                <ToolButton label="Bold" onCommand={() => run('bold')}>
                    <Bold size={15} />
                </ToolButton>
                <ToolButton label="Italic" onCommand={() => run('italic')}>
                    <Italic size={15} />
                </ToolButton>
                <ToolButton label="Underline" onCommand={() => run('underline')}>
                    <Underline size={15} />
                </ToolButton>
                <ToolButton label="Strikethrough" onCommand={() => run('strikeThrough')}>
                    <Strikethrough size={15} />
                </ToolButton>
                <Divider />
                <ToolButton label="Heading 2" onCommand={() => run('formatBlock', 'h2')}>
                    <Heading2 size={15} />
                </ToolButton>
                <ToolButton label="Heading 3" onCommand={() => run('formatBlock', 'h3')}>
                    <Heading3 size={15} />
                </ToolButton>
                <ToolButton label="Paragraph" onCommand={() => run('formatBlock', 'p')}>
                    <span className="text-xs font-semibold">P</span>
                </ToolButton>
                <Divider />
                <ToolButton label="Bulleted list" onCommand={() => run('insertUnorderedList')}>
                    <List size={15} />
                </ToolButton>
                <ToolButton label="Numbered list" onCommand={() => run('insertOrderedList')}>
                    <ListOrdered size={15} />
                </ToolButton>
                <ToolButton label="Quote" onCommand={() => run('formatBlock', 'blockquote')}>
                    <Quote size={15} />
                </ToolButton>
                <ToolButton label="Code block" onCommand={() => run('formatBlock', 'pre')}>
                    <Code2 size={15} />
                </ToolButton>
                <Divider />
                <ToolButton label="Insert link" onCommand={addLink}>
                    <Link2 size={15} />
                </ToolButton>
                <ToolButton label="Clear formatting" onCommand={() => run('removeFormat')}>
                    <RemoveFormatting size={15} />
                </ToolButton>
                <span className="flex-1" />
                <ToolButton label="Undo" onCommand={() => run('undo')}>
                    <Undo2 size={15} />
                </ToolButton>
                <ToolButton label="Redo" onCommand={() => run('redo')}>
                    <Redo2 size={15} />
                </ToolButton>
            </div>

            {/* The editor content is written imperatively, so React must not own its children. */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-multiline="true"
                aria-label={ariaLabel}
                data-placeholder={placeholder}
                onInput={sync}
                onBlur={sync}
                className="rte-content custom-scrollbar w-full overflow-y-auto px-4 py-3 text-sm text-[var(--admin-text)] outline-none"
                style={{ minHeight }}
            />
        </div>
    );
};

export default RichTextEditor;
