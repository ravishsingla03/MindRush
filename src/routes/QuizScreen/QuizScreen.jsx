import React, { useState, useEffect } from "react";
import "./QuizScreen.css";


function QuizScreen() {
  const currentTime = new Date().getTime();

  const [roomId, setRoomId] = useState("ABCD");
  const [playerName, setPlayerName] = useState("Player 1");
  const [question, setQuestion] = useState({
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correct: "Paris",
  },
  );
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeTaken, setTimetaken] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const selectedTime = new Date().getTime();
    setTimetaken(selectedTime - currentTime);
    console.log("Time taken:", (selectedTime - currentTime));
    console.log("Answer selected:", answer);
  };

  return (
    <div className="quiz-container">
      {/* Timer & Room Info */}
      <div className="quiz-header">
        <p className="timer">⏳ {timeLeft}s</p>
        <p className="room-info">Room ID: <span>{roomId}</span></p>
      </div>

      {/* Player Name */}
      <div className="player-name">👤 {playerName}</div>

      {/* Question Box */}
      <div className="question-box">
        <h2>{question.text}</h2>
      </div>

      {/* Answer Options */}
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
            onClick={() => handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>

    </div>
  );
}

export default QuizScreen;
