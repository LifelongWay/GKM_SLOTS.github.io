import { useState, useCallback, useEffect } from 'react';
import Schedule from './components/Schedule';
import Notes from './components/Notes';
import {
  subscribeSlots, saveSlot, removeSlot,
  subscribeNotes, addNote, removeNote,
  getWeekKey, migrateLocalStorage, migrateSlotKeys,
} from './utils';

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
  const [slots, setSlots] = useState({});
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('gkm-theme') || 'light');

  const weekKey = getWeekKey();

  // Migrate old localStorage data to Firebase, then subscribe to real-time updates
  useEffect(() => {
    let unsubSlots;
    let unsubNotes;

    migrateLocalStorage().then(() => migrateSlotKeys()).then(() => {
      let slotsLoaded = false;
      let notesLoaded = false;

      const checkReady = () => {
        if (slotsLoaded && notesLoaded) setLoading(false);
      };

      unsubSlots = subscribeSlots((data) => {
        setSlots(data);
        slotsLoaded = true;
        checkReady();
      });

      unsubNotes = subscribeNotes((data) => {
        setNotes(data);
        notesLoaded = true;
        checkReady();
      });
    });

    return () => {
      if (unsubSlots) unsubSlots();
      if (unsubNotes) unsubNotes();
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gkm-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const handleBook = useCallback((key, name) => {
    saveSlot(key, name);
  }, []);

  const handleClear = useCallback((key) => {
    removeSlot(key);
  }, []);

  const handleAddNote = useCallback((text, author) => {
    const newNote = {
      id: Date.now().toString(),
      text,
      author,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    addNote(newNote);
  }, []);

  const handleRemoveNote = useCallback((id) => {
    removeNote(id);
  }, []);

  const bookedCount = Object.keys(slots).length;
  const totalSlots = 40; // 8 hours × 5 days

  if (loading) {
    return (
      <div className="app">
        <FloatingNotes />
        <div style={{ textAlign: 'center', marginTop: '4rem', fontSize: '1.3rem' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <FloatingNotes />

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

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
        <Notes notes={notes} onAdd={handleAddNote} onRemove={handleRemoveNote} />
      </main>

      <footer className="footer">
        <span>♪</span>
        <span>Made with ♥ for the GKM Music Community</span>
        <span>♪</span>
      </footer>
    </div>
  );
}
