import { Fragment } from 'react';
import { DAYS, HOURS, formatHour, slotKey } from '../utils';
import TimeSlot from './TimeSlot';

export default function Schedule({ slots, onBook, onClear }) {
  return (
    <>
      {/* Desktop / tablet grid */}
      <div className="schedule-wrapper">
        <div className="schedule">
          {/* Header row */}
          <div className="schedule__corner">
            <span className="schedule__corner-icon">🕐</span>
          </div>
          {DAYS.map((day) => (
            <div key={day} className="schedule__day-header">
              <span className="day-name day-name--full">{day}</span>
              <span className="day-name day-name--short">{day.slice(0, 3)}</span>
            </div>
          ))}

          {/* Time rows */}
          {HOURS.map((hour) => (
            <Fragment key={hour}>
              <div className="schedule__time-label">
                <span>{formatHour(hour)}</span>
                <span className="time-dash">–</span>
                <span>{formatHour(hour + 1)}</span>
              </div>
              {DAYS.map((day) => {
                const key = slotKey(day, hour);
                return (
                  <div key={key} className="schedule__cell">
                    <TimeSlot
                      name={slots[key] || ''}
                      onBook={(name) => onBook(key, name)}
                      onClear={() => onClear(key)}
                    />
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="schedule-mobile">
        {DAYS.map((day) => (
          <div key={day} className="day-card">
            <div className="day-card__header">{day}</div>
            <div className="day-card__slots">
              {HOURS.map((hour) => {
                const key = slotKey(day, hour);
                return (
                  <div key={key} className="day-card__row">
                    <div className="day-card__time">
                      <span>{formatHour(hour)}</span>
                    </div>
                    <div className="day-card__slot">
                      <TimeSlot
                        name={slots[key] || ''}
                        onBook={(name) => onBook(key, name)}
                        onClear={() => onClear(key)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
