// ChatBot.js
import React from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import '../App.css';

const ChatBot = () => {
  const handleNewUserMessage = async (newMessage) => {
    // Call your API here to get a response based on user's message
    try {
      const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      const data = await response.json();

      // Display the response from the API
      addResponseMessage(data.response);
    } catch (error) {
      console.error('Error fetching response from API:', error);
      addResponseMessage('Oops! Something went wrong.');
    }
  };

  return (
    <Widget
      handleNewUserMessage={handleNewUserMessage}
      title="Chatbot"
    />
  );
};

export default ChatBot;
