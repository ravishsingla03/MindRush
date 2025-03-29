import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { socket } from "../../Components/SocketManger";
import "./QuizScreen.css";

function QuizScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get('room');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isEliminated, setIsEliminated] = useState(false);

  function decodeHTML(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}



  useEffect(() => {
    // Request questions from server
    socket.emit("get-questions", { roomCode });

    // Listen for questions from server
    socket.on("questions", (response) => {
      if (response.response_code === 0) {
        setQuestions(response.results);
      } else {
        console.error("Error loading questions");
      }
    });

    // Cleanup
    return () => {
      socket.off("questions");
    };
  }, []);

  //Socket listeners for game events
  useEffect(() => {
    socket.on("player-eliminated", ({ eliminatedPlayers}) => {
      if (eliminatedPlayers.includes(socket.id)) {
        alert("You've been eliminated!");
        navigate("/");
      }
    });

    socket.on("game-over", ({ winner }) => {
      if (socket.id === winner) {
        alert("Congratulations! You won!");
      }
      navigate("/");
    });

    socket.on("no-players-left", () => {
      alert("Game Over - No players remaining!");
      navigate("/");
    });

    return () => {
      socket.off("player-eliminated");
      socket.off("game-over");
      socket.off("no-players-left");
    };
  }, [navigate]);

    // Timer effect
    useEffect(() => {
      let timer;
      if (questions.length > 0) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              // Time's up - if no answer selected, player is eliminated
              if (!selectedAnswer) {
                socket.emit("answer-not-selected", { roomCode });
                setIsEliminated(true);
                alert("Time's up! You are eliminated!");
                navigate("/");
                return 0;
              }
              //wrong answer
              if(selectedAnswer !== currentQuestion.correct_answer) {
                socket.emit("wrong-answer", { roomCode });
                setIsEliminated(true);
                alert("Wrong answer! You are eliminated!");
                navigate("/");
                return 0;
              }
              // Reset timer and move to next question
              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedAnswer(null);
                return 10;
              }
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
  
      return () => clearInterval(timer);
    }, [questions, currentQuestionIndex, selectedAnswer, roomCode]);


  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if(answer === currentQuestion.correct_answer) {
      socket.emit("send-answer", { roomCode });
    }
    else {
      socket.emit("wrong-answer", { roomCode });
      setIsEliminated(true);
      alert("Wrong answer! You are eliminated!");
      navigate("/");
    }
  };

  // If no questions loaded yet
  if (questions.length === 0) {
    return <div className="quiz-container">Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    currentQuestion.correct_answer,
    ...currentQuestion.incorrect_answers,
  ];


  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <p className="timer">⏳ {timeLeft}s</p>
        <p className="question-counter">Question {currentQuestionIndex + 1}/{questions.length}</p>
        <p className="difficulty">Difficulty: {currentQuestion.difficulty}</p>
      </div>

      <div className="question-box">
        <h2>{decodeHTML(currentQuestion.question)}</h2>
      </div>

      <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className={`option-btn ${selectedAnswer === option ? "selected" : ""}`}
            onClick={() => handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            {decodeHTML(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizScreen;
