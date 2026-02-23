import { useState } from 'react';

export default function TimeSlot({ name, onBook, onClear }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(name || '');

  const handleBook = () => {
    const trimmed = input.trim();
    if (trimmed) {
      onBook(trimmed);
      setEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBook();
    if (e.key === 'Escape') {
      setInput(name || '');
      setEditing(false);
    }
  };

  // Slot is booked
  if (name && !editing) {
    return (
      <div className="slot slot--booked">
        <span className="slot__icon">🎶</span>
        <span className="slot__name">{name}</span>
        <div className="slot__actions">
          <button
            className="slot__btn slot__btn--edit"
            onClick={() => { setInput(name); setEditing(true); }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="slot__btn slot__btn--remove"
            onClick={onClear}
            title="Remove"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Editing or empty slot
  if (editing || !name) {
    return (
      <div className={`slot slot--free ${editing ? 'slot--editing' : ''}`}>
        <input
          className="slot__input"
          type="text"
          placeholder="Your name..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={editing}
          maxLength={25}
        />
        <button className="slot__btn slot__btn--confirm" onClick={handleBook} title="Book">
          ✓
        </button>
        {editing && (
          <button
            className="slot__btn slot__btn--cancel"
            onClick={() => { setInput(name || ''); setEditing(false); }}
            title="Cancel"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
}
