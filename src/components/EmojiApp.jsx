import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Sentiment from 'sentiment';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import Logo from '../img/emojilogo.png';
import emojiDictionary from './EmojiData';

function EmojiApp() {
  const [feedback, setFeedback] = useState('');
  const [updatedFeedback, setUpdatedFeedback] = useState('');
  const [response, setResponse] = useState('');
  const sentiment = new Sentiment();

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
    setUpdatedFeedback(event.target.value);
  };

  const handleEmojiClick = (emoji) => {
    setUpdatedFeedback(updatedFeedback + emoji);
  };

  const options = {
    includeScore: true,
    keys: ['description'],
  };

  const fuse = new Fuse(emojiDictionary, options);

  const handleAnalysis = (text) => {
    const tokens = text.toLowerCase().split(/\s+/);
    let matchedEmojis = [];

    tokens.forEach((token) => {
      const result = fuse.search(token);
      const emojis = result.map((item) => item.item);

      matchedEmojis = [...matchedEmojis, ...emojis];
    });

    matchedEmojis.sort((a, b) => b.sentiment - a.sentiment);

    return matchedEmojis;
  };

  useEffect(() => {
    const getEmojis = async () => {
      try {
        const result = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo-16k',
            messages: [
              {
                role: 'system',
                content:
                  'User propose a faculty feedback for a student. (keep it short!) add emojis to it suitable to the context. Add a sentence containing a growth minset concept to encourage students to who this feedback was provided and suitable to this feedback without mentioning that this is a growth mindset statement. Make sure you use diverse emojis with different skin colors. Make sure the result is serious and appropriate for academic use',
              },
              {
                role: 'user',
                content: feedback,
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
        console.log("key:"+  process.env.CHAT_GPT_API_KEY);
        setResponse(result.data.choices[0].message.content);
      } catch (error) {
        console.error(error);
      }
    };

    if (feedback) {
      getEmojis();
    }
  }, [feedback]);

  const emojiResults = handleAnalysis(feedback);

  return (
    <div>
      <div class ="header">Feedback Emojifier</div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <img
            src={Logo}
            className="logo mx-auto d-block mb-4"
            alt="Feedback Emojifier Logo"
            width="140px"
          />
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="feedback"
                name="feedback"
                placeholder="Enter your feedback here..."
                value={feedback}
                onChange={handleFeedbackChange}
              />
            </div>
          </form>

          <p>{response}</p>
          {feedback && (
            <div>
              <div class = "text-formal">More Emojis Recommendations</div>
              <div className="row">
                {emojiResults.slice(0, 4).map((emoji, index) => (
                  <div key={emoji.emoji + index} className="col-3 btn-warning">
                    <button
                      className="btn btn-outline-warning mb-2"
                      onClick={() => handleEmojiClick(emoji.emoji)}
                    >
                      {emoji.emoji}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmojiApp;
