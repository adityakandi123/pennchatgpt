import React, { useState } from 'react';
import ChatbotStyles from './chatbotstyles.module.css';

const RenderMultipleCards = ({ cards }) => {
  const [expandedCards, setExpandedCards] = useState([]);

  const toggleCard = (index) => {
    if (expandedCards.includes(index)) {
      // If the card is already expanded, close it
      setExpandedCards(expandedCards.filter((item) => item !== index));
    } else {
      // If the card is not expanded, open it
      setExpandedCards([...expandedCards, index]);
    }
  };

  return (
    <div className={ChatbotStyles.cardsdiv}>
      <div style={{width:'100%'}}>
        {cards.map((card, index) => (
          <div key={index} className={ChatbotStyles["accordion-cards"]}>
            <div
              className={ChatbotStyles["accordion-button"]}
              onClick={() => toggleCard(index)}
            >
              <span className="material-symbols-outlined card-icons">
                {card.image_uri.split(' ')[0]}
              </span>
              <span>{card.title}</span>
              <span className="material-symbols-outlined">
                {expandedCards.includes(index) ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
            </div>
            <div
              className={`collapse ${expandedCards.includes(index) ? 'show' : ''}`}
              id={`collapse-${index}`}
            >
              <div className={ChatbotStyles["card-body"]}>
                {card.subtitle &&
                  card.subtitle.split('\n').map((subtitles, i) => (
                    <div key={i} className={ChatbotStyles["card-text"]}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: subtitles.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                        }}
                      />
                    </div>
                  ))}
                {card.buttons.length > 0 && (
                  <div className={ChatbotStyles.cardbuttonsdiv}>
                    {card.buttons.map((button, i) => (
                      <a
                        key={i}
                        href={button.postback}
                        target="_blank"
                        className={ChatbotStyles["btn btn-primary"]}
                      >
                        {button.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RenderMultipleCards;
