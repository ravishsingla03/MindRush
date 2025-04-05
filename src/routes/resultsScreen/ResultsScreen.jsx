import { useState } from 'react'
import './resultsScreen.css'

function ResultsScreen() {

  function decodeHTML(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const questions = [
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "Generally, which component of a computer draws the most power?",
      "correct_answer": "Video Card",
      "incorrect_answers": [
        "Hard Drive",
        "Processor",
        "Power Supply"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "Unix Time is defined as the number of seconds that have elapsed since when?",
      "correct_answer": "Midnight, January 1, 1970",
      "incorrect_answers": [
        "Midnight, July 4, 1976",
        "Midnight on the creator of Unix&#039;s birthday",
        "Midnight, July 4, 1980"
      ]
    },
    {
      "type": "boolean",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "The common software-programming acronym &quot;I18N&quot; comes from the term &quot;Interlocalization&quot;.",
      "correct_answer": "False",
      "incorrect_answers": [
        "True"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "What is the number of keys on a standard Windows Keyboard?",
      "correct_answer": "104",
      "incorrect_answers": [
        "64",
        "94",
        "76"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "Which of these is the name for the failed key escrow device introduced by the National Security Agency in 1993?",
      "correct_answer": "Clipper Chip",
      "incorrect_answers": [
        "Enigma Machine",
        "Skipjack",
        "Nautilus"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "Whistler was the codename of this Microsoft Operating System.",
      "correct_answer": "Windows XP",
      "incorrect_answers": [
        "Windows 2000",
        "Windows 7",
        "Windows 95"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "In CSS, which of these values CANNOT be used with the &quot;position&quot; property?",
      "correct_answer": "center",
      "incorrect_answers": [
        "static",
        "absolute",
        "relative"
      ]
    },
    {
      "type": "boolean",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "Android versions are named in alphabetical order.",
      "correct_answer": "True",
      "incorrect_answers": [
        "False"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "In HTML, which non-standard tag used to be be used to make elements scroll across the viewport?",
      "correct_answer": "&lt;marquee&gt;&lt;/marquee&gt;",
      "incorrect_answers": [
        "&lt;scroll&gt;&lt;/scroll&gt;",
        "&lt;move&gt;&lt;move&gt;",
        "&lt;slide&gt;&lt;/slide&gt;"
      ]
    },
    {
      "type": "multiple",
      "difficulty": "medium",
      "category": "Science: Computers",
      "question": "While Apple was formed in California, in which western state was Microsoft founded?",
      "correct_answer": "New Mexico",
      "incorrect_answers": [
        "Washington",
        "Colorado",
        "Arizona"
      ]
    }
  ]

  return (
    <div className='resultsScreen'>
      <h1>Answers</h1>
      <div className="results-container">
        {questions.map((question, index) => (
          <div key={index} className="question-result">
            <h2>{index + 1}. {decodeHTML(question.question)}</h2>
            <div className={`difficulty-badge ${question.difficulty}`}>
              {decodeHTML(question.difficulty)}
            </div>
            <div className="options-list">
              <div className="correct-option">
                <p>{decodeHTML(question.correct_answer)}</p>
                <span className="check-icon">✓</span>
              </div>
              {question.incorrect_answers.map((answer, i) => (
                <div key={i} className="incorrect-option">
                  <p>{decodeHTML(answer)}</p>
                  <span className="cross-icon">×</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsScreen