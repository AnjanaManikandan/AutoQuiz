import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="heading">
        <h2>
          The second project focuses on researching and implementing a Growth Mindset framework in collaboration with Dr. Kumar and Dr. Li. A comprehensive website showcases the outcomes of this research, featuring three distinct applications:
        </h2>
      </div>
      <div className="content-container">
        <div className="application">
          <h3>Emojifier Application</h3>
          <p>
            Allows faculty to specify desired emojis for conveying feedback effectively.
            Provides appropriate emoji suggestions to enhance communication.
          </p>
        </div>
        <div className="application">
          <h3>GMS Application</h3>
          <p>
            Utilizes Chat GPT APIs to deliver feedback aligned with the Growth Mindset Standard.
            Empowers faculty to offer positive and constructive suggestions for student development.
          </p>
        </div>
        <div className="application">
          <h3>Auto Quiz Generator</h3>
          <p>
            Enables faculty to input prompts (e.g., 'Java Fundamentals') and receive 10 quiz questions.
            Future enhancements may explore multi-modality, introducing voice prompts alongside text inputs for quiz generation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
