import { useState } from 'react';

export default function Notes({ notes, onAdd, onRemove }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedText = text.trim();
    const trimmedAuthor = author.trim();
    if (trimmedText && trimmedAuthor) {
      onAdd(trimmedText, trimmedAuthor);
      setText('');
    }
  };

  return (
    <section className="notes">
      <div className="notes__header">
        <span className="notes__icon">📝</span>
        <h2 className="notes__title">Community Notes</h2>
        <span className="notes__icon">🎤</span>
      </div>
      <p className="notes__subtitle">
        Leave messages for fellow musicians — reminders, song requests, or just say hi!
      </p>

      <form className="notes__form" onSubmit={handleSubmit}>
        <textarea
          className="notes__text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note for the community..."
          rows={3}
          maxLength={500}
        />
        <div className="notes__form-row">
          <input
            className="notes__name-input"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            maxLength={30}
          />
          <button
            className="notes__submit-btn"
            type="submit"
            disabled={!text.trim() || !author.trim()}
          >
            Post Note
          </button>
        </div>
      </form>

      {notes.length > 0 && (
        <div className="notes__list">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <p className="note-card__text">{note.text}</p>
              <div className="note-card__footer">
                <div className="note-card__meta">
                  <span className="note-card__author">— {note.author}</span>
                  <span className="note-card__date">{note.date}</span>
                </div>
                <button
                  className="note-card__delete"
                  onClick={() => onRemove(note.id)}
                  title="Remove note"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && (
        <p className="notes__empty">No notes yet. Be the first to share!</p>
      )}
    </section>
  );
}
