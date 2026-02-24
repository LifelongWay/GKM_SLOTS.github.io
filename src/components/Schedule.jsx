import { Fragment, useState } from 'react';
import { DAYS, DAY_SHORT, HOURS, formatHour, formatHalf, slotKey, halfSlotKey } from '../utils';
import TimeSlot from './TimeSlot';

export default function Schedule({ slots, onBook, onClear }) {
  const [splitCells, setSplitCells] = useState(new Set());

  const toggleSplit = (cellKey) => {
    setSplitCells((prev) => {
      const next = new Set(prev);
      if (next.has(cellKey)) next.delete(cellKey);
      else next.add(cellKey);
      return next;
    });
  };

  const renderCell = (dayIndex, hour) => {
    const fullKey = slotKey(dayIndex, hour);
    const h1Key = halfSlotKey(dayIndex, hour, 1);
    const h2Key = halfSlotKey(dayIndex, hour, 2);
    const hasFullBooking = !!slots[fullKey];
    const hasHalfBooking = !!slots[h1Key] || !!slots[h2Key];
    const isSplit = splitCells.has(fullKey) || hasHalfBooking;

    if (isSplit && !hasFullBooking) {
      return (
        <div className="slot-cell slot-cell--split">
          <div className="slot-cell__half">
            <span className="slot-cell__half-label">{formatHalf(hour, 1)}</span>
            <div className="slot-cell__half-slot">
              <TimeSlot
                name={slots[h1Key] || ''}
                onBook={(name) => onBook(h1Key, name)}
                onClear={() => onClear(h1Key)}
                compact
              />
            </div>
          </div>
          <div className="slot-cell__half">
            <span className="slot-cell__half-label">{formatHalf(hour, 2)}</span>
            <div className="slot-cell__half-slot">
              <TimeSlot
                name={slots[h2Key] || ''}
                onBook={(name) => onBook(h2Key, name)}
                onClear={() => onClear(h2Key)}
                compact
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <TimeSlot
        name={slots[fullKey] || ''}
        onBook={(name) => onBook(fullKey, name)}
        onClear={() => onClear(fullKey)}
        onSplit={() => toggleSplit(fullKey)}
        canSplit={!hasFullBooking}
      />
    );
  };

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
              <span className="day-name day-name--short">{DAY_SHORT[day]}</span>
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
              {DAYS.map((day, dayIndex) => {
                const key = slotKey(dayIndex, hour);
                return (
                  <div key={key} className="schedule__cell">
                    {renderCell(dayIndex, hour)}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      {/* Mobile card layout */}
      <div className="schedule-mobile">
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="day-card">
            <div className="day-card__header">{day}</div>
            <div className="day-card__slots">
              {HOURS.map((hour) => {
                const fullKey = slotKey(dayIndex, hour);
                const h1Key = halfSlotKey(dayIndex, hour, 1);
                const h2Key = halfSlotKey(dayIndex, hour, 2);
                const hasFullBooking = !!slots[fullKey];
                const hasHalfBooking = !!slots[h1Key] || !!slots[h2Key];
                const isSplit = splitCells.has(fullKey) || hasHalfBooking;

                if (isSplit && !hasFullBooking) {
                  return (
                    <div key={fullKey} className="day-card__row day-card__row--split">
                      <div className="day-card__half-row">
                        <div className="day-card__time">
                          <span>{formatHalf(hour, 1)}</span>
                        </div>
                        <div className="day-card__slot">
                          <TimeSlot
                            name={slots[h1Key] || ''}
                            onBook={(name) => onBook(h1Key, name)}
                            onClear={() => onClear(h1Key)}
                            compact
                          />
                        </div>
                      </div>
                      <div className="day-card__half-row">
                        <div className="day-card__time">
                          <span>{formatHalf(hour, 2)}</span>
                        </div>
                        <div className="day-card__slot">
                          <TimeSlot
                            name={slots[h2Key] || ''}
                            onBook={(name) => onBook(h2Key, name)}
                            onClear={() => onClear(h2Key)}
                            compact
                          />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={fullKey} className="day-card__row">
                    <div className="day-card__time">
                      <span>{formatHour(hour)}</span>
                    </div>
                    <div className="day-card__slot">
                      <TimeSlot
                        name={slots[fullKey] || ''}
                        onBook={(name) => onBook(fullKey, name)}
                        onClear={() => onClear(fullKey)}
                        onSplit={() => toggleSplit(fullKey)}
                        canSplit={!hasFullBooking}
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
