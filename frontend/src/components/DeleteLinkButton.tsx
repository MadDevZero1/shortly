import { useState } from 'react';
import { Trash } from '@phosphor-icons/react';
import { api } from '../services/api';

export function DeleteLinkButton({ code, onDeleted, onError }: { code: string; onDeleted: () => void; onError: (message: string) => void }) {
  const [pending, setPending] = useState(false);
  async function remove() {
    if (!window.confirm('Delete this link and its click history? This cannot be undone.')) return;
    setPending(true);
    onError('');
    try { await api.remove(code); onDeleted(); }
    catch (error) { onError(error instanceof Error ? error.message : 'Could not delete this link.'); }
    finally { setPending(false); }
  }
  return <button type="button" className="icon-button delete-button" aria-label={`Delete link ${code}`} title="Delete link" disabled={pending} onClick={remove}><Trash aria-hidden="true"/></button>;
}
