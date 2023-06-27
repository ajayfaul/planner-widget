import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import '../styles/MyCustomWidget.css';

export default function MyCustomWidget() {
    const [mood, setMood] = useState('');
    const [moodNote, setMoodNote] = useState('');
    const [moodHistory, setMoodHistory] = useState([]);

    useEffect(() => {
        const storedMoodHistory = Cookies.get('moodHistory');
        if (storedMoodHistory) {
            setMoodHistory(JSON.parse(storedMoodHistory));
        }

        // Add event listener to reset cookie on page refresh
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            // Clean up event listener
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleBeforeUnload = () => {
        Cookies.remove('moodHistory');
    };

    const handleMoodSelection = (selectedMood) => {
        setMood(selectedMood);
    };

    const handleSaveMood = () => {
        const entry = {
            mood,
            note: moodNote,
            date: new Date().toISOString(),
        };

        const updatedMoodHistory = [...moodHistory, entry];
        setMoodHistory(updatedMoodHistory);

        Cookies.set('moodHistory', JSON.stringify(updatedMoodHistory));
        setMood('');
        setMoodNote('');
    };

    //Show Mood Options
    const renderMoodOptions = () => {
        const moodOptions = ['😄', '😊', '😐', '😞', '😢'];

        return moodOptions.map((option) => (
            <button
                key={option}
                className={`mood-option ${mood === option ? 'selected' : ''}`}
                onClick={() => handleMoodSelection(option)}
            >
                {option}
            </button>
        ));
    };

    //   Show Mood History
    const renderMoodHistory = () => {
        return moodHistory.map((entry, index) => {
            const date = new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });

            return (
                <div key={index} className="mood-history-entry">
                    <div className="mood-history-mood">{entry.mood}</div>
                    <div className="mood-history-note">{entry.note}</div>
                    <div className="mood-history-date">{date}</div>
                </div>
            );
        });
    };

    return (
        <div className="mood-tracker-widget">
            <h3>Mood Tracker</h3>
            <div className="mood-options">{renderMoodOptions()}</div>
            <div className="mood-notes">
                <input
                    type="text"
                    placeholder="Enter mood notes"
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                />
                <button onClick={handleSaveMood}>Save Mood</button>
            </div>
            <div className="mood-history">{renderMoodHistory()}</div>
        </div>
    );
}
