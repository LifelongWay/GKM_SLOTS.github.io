import { Fragment } from 'react';
import { DAYS, HOURS, formatHour, slotKey } from '../utils';
import TimeSlot from './TimeSlot';

export default function Schedule({ slots, onBook, onClear }) {
  return (
    <div className="schedule-wrapper">
      <div className="schedule">
        {/* Header row */}
        <div className="schedule__corner">
          <span className="schedule__corner-icon">🕐</span>
        </div>
        {DAYS.map((day) => (
          <div key={day} className="schedule__day-header">
            <span className="day-name">{day}</span>
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
  );
}
