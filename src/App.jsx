import { useState, useCallback } from 'react';
import Schedule from './components/Schedule';
import Notes from './components/Notes';
import { loadSlots, saveSlots, loadNotes, saveNotes, getWeekKey } from './utils';

// Floating music notes for decoration
const FLOATING_NOTES = ['♪', '♫', '♬', '♩', '🎵', '🎶', '🎸', '🎹', '🎻', '🥁'];

function FloatingNotes() {
  return (
    <div className="floating-notes" aria-hidden="true">
      {FLOATING_NOTES.map((note, i) => (
        <span
          key={i}
          className="floating-note"
          style={{
            left: `${5 + i * 9.5}%`,
            animationDelay: `${i * 1.3}s`,
            animationDuration: `${8 + (i % 4) * 2}s`,
            fontSize: `${1.2 + (i % 3) * 0.5}rem`,
          }}
        >
          {note}
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [slots, setSlots] = useState(loadSlots);
  const [notes, setNotes] = useState(loadNotes);

  const weekKey = getWeekKey();

  const handleBook = useCallback((key, name) => {
    setSlots((prev) => {
      const next = { ...prev, [key]: name };
      saveSlots(next);
      return next;
    });
  }, []);

  const handleClear = useCallback((key) => {
    setSlots((prev) => {
      const next = { ...prev };
      delete next[key];
      saveSlots(next);
      return next;
    });
  }, []);

  const handleNotesChange = useCallback((val) => {
    setNotes(val);
    saveNotes(val);
  }, []);

  const bookedCount = Object.keys(slots).length;
  const totalSlots = 40; // 8 hours × 5 days

  return (
    <div className="app">
      <FloatingNotes />

      <header className="header">
        <div className="header__top">
          <span className="header__note">🎵</span>
          <h1 className="header__title">GKM Practice Room</h1>
          <span className="header__note">🎵</span>
        </div>
        <p className="header__subtitle">
          Book your practice slot for the week!
        </p>
        <div className="header__meta">
          <span className="badge badge--week">📅 {weekKey}</span>
          <span className="badge badge--slots">
            🎸 {bookedCount}/{totalSlots} slots booked
          </span>
        </div>
      </header>

      <main className="main">
        <Schedule slots={slots} onBook={handleBook} onClear={handleClear} />
        <Notes value={notes} onChange={handleNotesChange} />
      </main>

      <footer className="footer">
        <span>♪</span>
        <span>Made with ♥ for the GKM Music Community</span>
        <span>♪</span>
      </footer>
    </div>
  );
}
