import { useState } from 'react';

type UseCopyToClipboardReturn = {
  copy: (text: string) => Promise<void>;
  copied: boolean;
};

export function useCopyToClipboard(resetDelay = 2000): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), resetDelay);
  };

  return { copy, copied };
}
