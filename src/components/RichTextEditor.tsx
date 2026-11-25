import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bold, Italic, Underline, Strikethrough, AArrowDown, AArrowUp } from 'lucide-react';
import {
  MIN_FONT_SIZE_DELTA,
  MAX_FONT_SIZE_DELTA,
  FONT_SIZE_STEP,
  clampFontSizeDelta,
  formatDeltaFontSizeCss,
  sanitizeRichTextHtml,
  stripRichTextHtml,
} from '../utils/richText';

interface RichTextEditorProps {
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  singleLine?: boolean;
  toolbarVisibility?: 'always' | 'onFocus';
  ariaLabel?: string;
}

interface SelectionFormattingState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  hasSelection: boolean;
  insideSizedSpan: boolean;
  deltas: number[];
}

const DEFAULT_SELECTION_STATE: SelectionFormattingState = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  hasSelection: false,
  insideSizedSpan: false,
  deltas: [],
};

function findClosestDeltaSpan(node: Node | null, boundaryRoot: HTMLElement): HTMLElement | null {
  let curr: Node | null = node;
  while (curr && curr !== boundaryRoot) {
    if (curr instanceof HTMLElement && curr.tagName === 'SPAN' && curr.hasAttribute('data-fs-delta')) {
      return curr;
    }
    curr = curr.parentNode;
  }
  return null;
}

function getSpanDelta(span: HTMLElement): number {
  const raw = parseInt(span.getAttribute('data-fs-delta') || '0', 10);
  return Number.isNaN(raw) ? 0 : clampFontSizeDelta(raw);
}

function createDeltaSpan(delta: number): HTMLSpanElement {
  const span = document.createElement('span');
  const clamped = clampFontSizeDelta(delta);
  span.setAttribute('data-fs-delta', String(clamped));
  span.style.fontSize = formatDeltaFontSizeCss(clamped);
  return span;
}

function pruneEmptyInlineShells(root: ParentNode) {
  const inlineTags = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'SPAN']);
  const children = Array.from(root.childNodes);
  for (const child of children) {
    if (child instanceof HTMLElement && inlineTags.has(child.tagName)) {
      pruneEmptyInlineShells(child);
      if (child.childNodes.length === 0) {
        child.parentNode?.removeChild(child);
      }
    } else if (child.nodeType === Node.TEXT_NODE && child.textContent === '') {
      child.parentNode?.removeChild(child);
    }
  }
}

function hasVisibleFragmentContent(frag: DocumentFragment): boolean {
  if ((frag.textContent || '').length > 0) return true;
  return Boolean(frag.querySelector('br'));
}

function unwrapElement(el: HTMLElement) {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function mergeAdjacentFontSizeSpans(root: Node) {
  const children = Array.from(root.childNodes);
  for (const child of children) {
    if (child instanceof HTMLElement) {
      mergeAdjacentFontSizeSpans(child);
    }
  }

  let curr = root.firstChild;
  while (curr) {
    const next = curr.nextSibling;
    if (
      curr instanceof HTMLElement &&
      next instanceof HTMLElement &&
      curr.tagName === 'SPAN' &&
      next.tagName === 'SPAN' &&
      curr.hasAttribute('data-fs-delta') &&
      next.hasAttribute('data-fs-delta') &&
      curr.getAttribute('data-fs-delta') === next.getAttribute('data-fs-delta')
    ) {
      while (next.firstChild) {
        curr.appendChild(next.firstChild);
      }
      next.parentNode?.removeChild(next);
      continue;
    }
    curr = next;
  }
}

function collectSelectedTextSlices(
  editorEl: HTMLElement,
  range: Range
): { node: Text; start: number; end: number }[] {
  const slices: { node: Text; start: number; end: number }[] = [];
  const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();

  while (current) {
    const tn = current as Text;
    const len = tn.length;
    if (len > 0) {
      let start = -1;
      let end = -1;

      if (tn === range.startContainer && tn === range.endContainer) {
        start = range.startOffset;
        end = range.endOffset;
      } else if (tn === range.startContainer) {
        start = range.startOffset;
        end = len;
      } else if (tn === range.endContainer) {
        start = 0;
        end = range.endOffset;
      } else {
        try {
          if (range.comparePoint(tn, 0) === 0 && range.comparePoint(tn, len) === 0) {
            start = 0;
            end = len;
          }
        } catch {
          // Node outside range tree
        }
      }

      if (start >= 0 && end > start) {
        slices.push({ node: tn, start, end });
      }
    }
    current = walker.nextNode();
  }

  return slices;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  editorClassName = '',
  singleLine = false,
  toolbarVisibility = 'always',
  ariaLabel,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastEmittedRef = useRef<string | null>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const isComposingRef = useRef(false);

  const [isFocused, setIsFocused] = useState(false);
  const [selState, setSelState] = useState<SelectionFormattingState>(DEFAULT_SELECTION_STATE);

  // Sync external prop changes into contentEditable without resetting caret while typing
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (value === lastEmittedRef.current) return;

    const sanitized = sanitizeRichTextHtml(value);
    if (el.innerHTML !== sanitized) {
      el.innerHTML = sanitized;
    }
    lastEmittedRef.current = value;
  }, [value]);

  const emitCleanedHtml = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const rawHtml = el.innerHTML;
    const cleaned = sanitizeRichTextHtml(rawHtml);
    const finalValue = stripRichTextHtml(cleaned) === '' ? '' : cleaned;
    lastEmittedRef.current = finalValue;
    onChange(finalValue);
  }, [onChange]);

  const refreshSelectionState = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      setSelState(DEFAULT_SELECTION_STATE);
      return;
    }

    const range = sel.getRangeAt(0);
    if (!el.contains(range.commonAncestorContainer)) {
      return;
    }

    savedRangeRef.current = range.cloneRange();

    let bold = false;
    let italic = false;
    let underline = false;
    let strike = false;
    try {
      bold = document.queryCommandState('bold');
      italic = document.queryCommandState('italic');
      underline = document.queryCommandState('underline');
      strike = document.queryCommandState('strikeThrough');
    } catch {
      // Ignore unsupported queryCommandState in headless browsers
    }

    const deltas: number[] = [];
    let insideSizedSpan = false;

    if (!range.collapsed) {
      const slices = collectSelectedTextSlices(el, range);
      for (const s of slices) {
        const span = findClosestDeltaSpan(s.node, el);
        deltas.push(span ? getSpanDelta(span) : 0);
      }
    } else {
      const span = findClosestDeltaSpan(range.startContainer, el);
      if (span) {
        insideSizedSpan = true;
        deltas.push(getSpanDelta(span));
      }
    }

    setSelState({
      bold,
      italic,
      underline,
      strike,
      hasSelection: !range.collapsed,
      insideSizedSpan,
      deltas,
    });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const el = editorRef.current;
      if (!el) return;
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        refreshSelectionState();
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [refreshSelectionState]);

  const restoreSelectionIfNeeded = (): Range | null => {
    const el = editorRef.current;
    if (!el) return null;

    if (document.activeElement !== el) {
      el.focus({ preventScroll: true });
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      return sel.getRangeAt(0);
    }

    if (savedRangeRef.current && el.contains(savedRangeRef.current.commonAncestorContainer)) {
      const restored = savedRangeRef.current.cloneRange();
      sel?.removeAllRanges();
      sel?.addRange(restored);
      return restored;
    }

    return null;
  };

  const applyInlineCommand = (command: 'bold' | 'italic' | 'underline' | 'strikeThrough') => {
    const el = editorRef.current;
    if (!el) return;
    restoreSelectionIfNeeded();
    try {
      document.execCommand(command, false);
    } catch {
      // No-op if command fails
    }
    emitCleanedHtml();
    refreshSelectionState();
  };

  const applyFontSizeDelta = (stepDelta: number) => {
    const el = editorRef.current;
    if (!el) return;
    const range = restoreSelectionIfNeeded();
    if (!range) return;

    // Collapsed cursor inside an existing resized span adjusts that span directly
    if (range.collapsed) {
      const span = findClosestDeltaSpan(range.startContainer, el);
      if (!span) return;
      const currentDelta = getSpanDelta(span);
      const nextDelta = clampFontSizeDelta(currentDelta + stepDelta);
      if (nextDelta === currentDelta) return;

      if (nextDelta === 0) {
        unwrapElement(span);
      } else {
        span.setAttribute('data-fs-delta', String(nextDelta));
        span.style.fontSize = formatDeltaFontSizeCss(nextDelta);
      }
      mergeAdjacentFontSizeSpans(el);
      emitCleanedHtml();
      refreshSelectionState();
      return;
    }

    const slices = collectSelectedTextSlices(el, range);
    if (slices.length === 0) return;

    const targetNodes: Text[] = [];

    for (const { node: tn, start, end } of slices) {
      const fsSpan = findClosestDeltaSpan(tn, el);
      const currentDelta = fsSpan ? getSpanDelta(fsSpan) : 0;
      const newDelta = clampFontSizeDelta(currentDelta + stepDelta);

      let targetTn = start > 0 ? tn.splitText(start) : tn;
      if (end - start < targetTn.length) {
        targetTn.splitText(end - start);
      }
      targetNodes.push(targetTn);

      if (newDelta === currentDelta) {
        continue;
      }

      if (fsSpan) {
        const beforeRange = document.createRange();
        beforeRange.setStart(fsSpan, 0);
        beforeRange.setEndBefore(targetTn);
        const beforeFrag = beforeRange.extractContents();
        pruneEmptyInlineShells(beforeFrag);

        const afterRange = document.createRange();
        afterRange.setStartAfter(targetTn);
        afterRange.setEnd(fsSpan, fsSpan.childNodes.length);
        const afterFrag = afterRange.extractContents();
        pruneEmptyInlineShells(afterFrag);

        if (hasVisibleFragmentContent(beforeFrag)) {
          const beforeSpan = createDeltaSpan(currentDelta);
          beforeSpan.appendChild(beforeFrag);
          fsSpan.parentNode?.insertBefore(beforeSpan, fsSpan);
        }

        if (hasVisibleFragmentContent(afterFrag)) {
          const afterSpan = createDeltaSpan(currentDelta);
          afterSpan.appendChild(afterFrag);
          fsSpan.parentNode?.insertBefore(afterSpan, fsSpan.nextSibling);
        }

        if (newDelta === 0) {
          unwrapElement(fsSpan);
        } else {
          fsSpan.setAttribute('data-fs-delta', String(newDelta));
          fsSpan.style.fontSize = formatDeltaFontSizeCss(newDelta);
        }
      } else if (newDelta !== 0) {
        const wrapper = createDeltaSpan(newDelta);
        targetTn.parentNode?.insertBefore(wrapper, targetTn);
        wrapper.appendChild(targetTn);
      }
    }

    mergeAdjacentFontSizeSpans(el);

    if (targetNodes.length > 0) {
      const sel = window.getSelection();
      if (sel) {
        const first = targetNodes[0];
        const last = targetNodes[targetNodes.length - 1];
        const nextRange = document.createRange();
        nextRange.setStart(first, 0);
        nextRange.setEnd(last, last.length);
        sel.removeAllRanges();
        sel.addRange(nextRange);
        savedRangeRef.current = nextRange.cloneRange();
      }
    }

    emitCleanedHtml();
    refreshSelectionState();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const plain = e.clipboardData.getData('text/plain');

    if (html) {
      let clean = sanitizeRichTextHtml(html);
      if (singleLine) {
        clean = stripRichTextHtml(clean).replace(/\s+/g, ' ');
      }
      document.execCommand('insertHTML', false, clean);
    } else if (plain) {
      const text = singleLine ? plain.replace(/\r?\n/g, ' ') : plain;
      document.execCommand('insertText', false, text);
    }
    emitCleanedHtml();
    refreshSelectionState();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (singleLine && e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const canResizeTarget = selState.hasSelection || selState.insideSizedSpan;
  const canIncrease =
    canResizeTarget &&
    (selState.deltas.length === 0 || selState.deltas.some(d => d < MAX_FONT_SIZE_DELTA));
  const canDecrease =
    canResizeTarget &&
    (selState.deltas.length === 0 || selState.deltas.some(d => d > MIN_FONT_SIZE_DELTA));

  let deltaLabel = '0px';
  if (selState.deltas.length > 0) {
    const first = selState.deltas[0];
    const allSame = selState.deltas.every(d => d === first);
    if (!allSame) {
      deltaLabel = 'Mixed';
    } else if (first > 0) {
      deltaLabel = `+${first}px`;
    } else {
      deltaLabel = `${first}px`;
    }
  }

  const showToolbar = toolbarVisibility === 'always' || isFocused;

  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 focus-within:ring-2 focus-within:ring-white/35 transition-all overflow-hidden ${className}`}
    >
      {showToolbar && (
        <div
          role="toolbar"
          aria-label="Text formatting toolbar"
          onMouseDown={e => e.preventDefault()}
          className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-white/[0.06] border-b border-white/10 select-none"
        >
          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyInlineCommand('bold')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              selState.bold
                ? 'bg-white text-[#130f30] shadow-xs'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
            aria-pressed={selState.bold}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyInlineCommand('italic')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              selState.italic
                ? 'bg-white text-[#130f30] shadow-xs'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
            aria-pressed={selState.italic}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyInlineCommand('underline')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              selState.underline
                ? 'bg-white text-[#130f30] shadow-xs'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
            title="Underline (Ctrl+U)"
            aria-label="Underline"
            aria-pressed={selState.underline}
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyInlineCommand('strikeThrough')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              selState.strike
                ? 'bg-white text-[#130f30] shadow-xs'
                : 'text-white/75 hover:text-white hover:bg-white/10'
            }`}
            title="Strikethrough"
            aria-label="Strikethrough"
            aria-pressed={selState.strike}
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-white/15 mx-1" aria-hidden="true" />

          <button
            type="button"
            disabled={!canDecrease}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyFontSizeDelta(-FONT_SIZE_STEP)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-unisans-regular text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={
              !canResizeTarget
                ? 'Highlight text to decrease font size (-2px, max -10px)'
                : canDecrease
                ? 'Decrease font size by 2px (min -10px)'
                : 'Minimum font size reached (-10px)'
            }
            aria-label="Decrease font size by 2px"
          >
            <AArrowDown className="w-3.5 h-3.5" />
            <span>-2px</span>
          </button>

          <span
            className="px-1.5 py-0.5 text-[10px] font-mono-numbers rounded bg-white/10 text-white/75 min-w-[38px] text-center"
            title="Font size offset from base (range -10px to +10px)"
          >
            {deltaLabel}
          </span>

          <button
            type="button"
            disabled={!canIncrease}
            onMouseDown={e => e.preventDefault()}
            onClick={() => applyFontSizeDelta(FONT_SIZE_STEP)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-unisans-regular text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={
              !canResizeTarget
                ? 'Highlight text to increase font size (+2px, max +10px)'
                : canIncrease
                ? 'Increase font size by 2px (max +10px)'
                : 'Maximum font size reached (+10px)'
            }
            aria-label="Increase font size by 2px"
          >
            <AArrowUp className="w-3.5 h-3.5" />
            <span>+2px</span>
          </button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline={!singleLine}
        aria-label={ariaLabel}
        data-placeholder={placeholder}
        onFocus={() => {
          setIsFocused(true);
          refreshSelectionState();
        }}
        onBlur={() => {
          setIsFocused(false);
          emitCleanedHtml();
        }}
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false;
          emitCleanedHtml();
        }}
        onInput={() => {
          if (!isComposingRef.current) {
            emitCleanedHtml();
          }
          refreshSelectionState();
        }}
        onMouseUp={refreshSelectionState}
        onKeyUp={refreshSelectionState}
        onSelect={refreshSelectionState}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`rich-text-content rich-text-editor w-full focus:outline-none break-words ${editorClassName}`}
      />
    </div>
  );
};
