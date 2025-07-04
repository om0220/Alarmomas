import React, { useState, useEffect, useRef } from 'react';
import './AlarmClock.css';

const AlarmClock = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [alarms, setAlarms] = useState([]);
  const [newAlarmTime, setNewAlarmTime] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRingtone, setSelectedRingtone] = useState('/Alarm.mp3');
  const audioRef = useRef(null);

  // Apply dark mode to body
  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  // Get current time and check alarms every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const current = `${hours}:${minutes}`;
      const today = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
      setCurrentTime(current);

      alarms.forEach((alarm, index) => {
        if (
          !alarm.triggered &&
          alarm.time === current &&
          alarm.days.includes(today)
        ) {
          const updatedAlarms = [...alarms];
          updatedAlarms[index].triggered = true;
          setAlarms(updatedAlarms);

          if (audioRef.current) {
            audioRef.current.src = alarm.ringtone;
            audioRef.current.play().catch(err => console.warn('Playback failed:', err));
          }

          // Show banner instead of alert
          const banner = document.createElement('div');
          banner.className = 'ringing-banner';
          banner.innerText = `⏰ Alarm ringing: ${alarm.time}`;
          document.body.appendChild(banner);
          setTimeout(() => banner.remove(), 5000);
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms]);

  const handleAlarmChange = (e) => setNewAlarmTime(e.target.value);

  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSetAlarm = () => {
    if (newAlarmTime && selectedDays.length > 0) {
      setAlarms([
        ...alarms,
        {
          time: newAlarmTime,
          days: selectedDays,
          ringtone: selectedRingtone,
          triggered: false,
        },
      ]);
      alert(`✅ Alarm set for ${newAlarmTime} on ${selectedDays.join(', ')}`);
      setNewAlarmTime('');
      setSelectedDays([]);
    } else {
      alert('Please select a time and at least one day.');
    }
  };

  const handleClearAlarms = () => {
    setAlarms([]);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <button className="theme-toggle-fixed" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="alarm-container">
        <h1 className="alarm-title">⏰ Alarm Clock</h1>
        <h2 className="current-time">
          Current Time: <span>{currentTime}</span>
        </h2>

        <div className="input-section">
          <label htmlFor="alarm-input">Set Alarm Time:</label>
          <input type="time" id="alarm-input" onChange={handleAlarmChange} value={newAlarmTime} />

          <label>Repeat on:</label>
          <div className="days-checkboxes">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  value={day}
                  checked={selectedDays.includes(day)}
                  onChange={handleDayChange}
                />
                {day}
              </label>
            ))}
          </div>

          <label htmlFor="ringtone-select">Choose Ringtone:</label>
          <select
            id="ringtone-select"
            onChange={(e) => setSelectedRingtone(e.target.value)}
            value={selectedRingtone}
          >
            <option value="/Alarm.mp3">Classic Alarm</option>
            <option value="/chime.mp3">Chime</option>
            <option value="/Digital.mp3">Digital Beep</option>
            <option value="/Nature.mp3">Nature Sound</option>
          </select>

          <div className="button-group">
            <button onClick={handleSetAlarm}>Set Alarm</button>
            <button onClick={handleClearAlarms} className="clear-btn">Clear All</button>
            <button onClick={handleStopAlarm} className="stop-btn">Stop Alarm</button>
          </div>

          <p className="alarm-set-text">
            {alarms.length > 0 ? (
              <>
                Alarms:
                <ul>
                  {alarms.map((a, i) => (
                    <li key={i}>
                      {a.time} — {a.days.join(', ')}
                    </li>
                  ))}
                </ul>
              </>
            ) : 'No alarm set'}
          </p>
        </div>

        <audio ref={audioRef} preload="auto" />
      </div>
    </>
  );
};

export default AlarmClock;
