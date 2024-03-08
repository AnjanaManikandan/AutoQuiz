// Import necessary dependencies and components
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../img/quizlogo.svg';

function AutoQuiz() {
  const [quizTopic, setQuizTopic] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setQuizTopic(''); // Clear input when the component mounts or when the page is refreshed
  }, []);

  const handleFeedbackChange = (event) => {
    setQuizTopic(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo-16k',
          messages: [
            {
              role: 'system',
              content: `You must create a multiple choice (A, B, C, and D choices) quiz on the following topic: ${quizTopic}. Please generate 2 questions in THIS EXACT JSON FORMAT: {
                "questions": [
                  {
                    "id": 1,
                    "question": "CHAT GPT GENERATED QUESTION",
                    "options": [
                      {
                        "id": "A",
                        "text": "Option A"
                      },
                      {
                        "id": "B",
                        "text": "Option B"
                      },
                      {
                        "id": "C",
                        "text": "Option C"
                      },
                      {
                        "id": "D",
                        "text": "Option D"
                      }
                    ],
                    "correct_option": "C"
                  },
                  {
                    "id": 2,
                    "question": "CHAT GPT GENERATED QUESTION",
                    "options": [
                      {
                        "id": "A",
                        "text": "Option A"
                      },
                      {
                        "id": "B",
                        "text": "Option B"
                      },
                      {
                        "id": "C",
                        "text": "Option C"
                      },
                      {
                        "id": "D",
                        "text": "Option D"
                      }
                    ],
                    "correct_option": "C"
                  }
                ]
              } . Return VALID JSON. MUST BE COMPLETE`,
            },
            {
              role: 'user',
              content: quizTopic,
            },
          ],
          temperature: 0.7,
          max_tokens: 256,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setLoading(false);
      if (result.data.choices && result.data.choices.length > 0) {
        const quizContent = result.data.choices[0].message.content;
        try {
          const parsedQuiz = JSON.parse(quizContent);
          setResponse(parsedQuiz);
        } catch (parseError) {
          console.error('Error parsing quiz data:', parseError);
          console.log("Chat gpt gen:   " + quizContent);
          // Use the provided JSON in case of a parsing error
          const hardcodedJSON = {
            "questions": [
              {
                "id": 1,
                "question": "What does OOP stand for?",
                "options": [
                  {"id": "A", "text": "Object-Oriented Programming"},
                  {"id": "B", "text": "Object-Oriented Process"},
                  {"id": "C", "text": "Object-Oriented Protocol"},
                  {"id": "D", "text": "Object-Oriented Prototype"}
                ],
                "correct_option": "A"
              },
              {
                "id": 2,
                "question": "Which OOP principle promotes code reusability by allowing a class to inherit properties and behaviors from another class?",
                "options": [
                  {"id": "A", "text": "Encapsulation"},
                  {"id": "B", "text": "Abstraction"},
                  {"id": "C", "text": "Inheritance"},
                  {"id": "D", "text": "Polymorphism"}
                ],
                "correct_option": "C"
              },
              {
                "id": 3,
                "question": "What is the purpose of encapsulation in OOP?",
                "options": [
                  {"id": "A", "text": "To allow a class to inherit properties"},
                  {"id": "B", "text": "To hide the implementation details of a class"},
                  {"id": "C", "text": "To provide multiple forms of a function"},
                  {"id": "D", "text": "To represent real-world entities in code"}
                ],
                "correct_option": "B"
              }
            ]
          };
          setResponse(hardcodedJSON);
        }
      } else {
        console.error('Invalid API response format');
      }
    } catch (error) {
      console.error('API Request Error:', error);
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const formatQuizResponse = (quizData) => {
    if (!quizData || !quizData.questions) {
      return <p>Error parsing quiz data</p>;
    }

    return (
      <form onSubmit={handleSubmit}>
        {quizData.questions.map((question, index) => (
          <div key={index}>
            <p>{`Question ${index + 1}: ${question.question}`}</p>
            {question.options.map((option) => (
              <div key={option.id}>
                <input
                  type="radio"
                  name={`question_${index}`}
                  value={option.id}
                  id={`q${index}_option${option.id}`}
                  onChange={() => handleAnswerChange(index, option.id)}
                  checked={userAnswers[index] === option.id}
                  disabled={submitted}
                />
                <label htmlFor={`q${index}_option${option.id}`}>
                  {`${option.text}`}
                </label>
              </div>
            ))}
            {submitted && (
              <>
                {userAnswers[index] === question.correct_option ? (
                  <p style={{ color: 'green' }}>Correct!</p>
                ) : userAnswers[index] ? (
                  <p style={{ color: 'red' }}>
                    Incorrect. Correct answer: {question.correct_option}
                  </p>
                ) : null}
              </>
            )}
          </div>
        ))}
        <button type="submit" disabled={submitted}>
          Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <div className="header">Auto Quiz Generator</div>
      <img
        src={Logo}
        className="logo mx-auto d-block mb-4"
        alt="Feedback Emojifier Logo"
        width="140px"
      />
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="feedback"
                name="feedback"
                placeholder="Enter Quiz Topic to generate quiz..."
                value={quizTopic}
                onChange={handleFeedbackChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setQuizTopic(''); // Clear input on "Generate Quiz" button click
                generateQuiz();
                setSubmitted(false);
              }}
            >
              Generate Quiz
            </button>
          </form>

          {loading && <p>Loading...</p>}
          {response && !loading && formatQuizResponse(response)}
        </div>
      </div>
    </div>
  );
}

export default AutoQuiz;
