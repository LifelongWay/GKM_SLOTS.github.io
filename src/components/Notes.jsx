import { useState, useEffect, useRef } from 'react';

export default function Notes({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    // Debounce save
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(newVal), 400);
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
      <textarea
        className="notes__textarea"
        value={localValue}
        onChange={handleChange}
        placeholder="Write a note for the community... &#10;e.g. 'Piano needs tuning!' or 'Looking for a drummer for Thursday jam'"
        rows={5}
        maxLength={2000}
      />
      <div className="notes__footer">
        <span>{localValue.length}/2000</span>
      </div>
    </section>
  );
}
