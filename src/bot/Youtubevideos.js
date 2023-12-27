import React, { useState, useRef } from 'react';
import ChabtbotStyles from './chatbotstyles.module.css'

const YoutubeCarousel = ({ videos }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [player, setPlayer] = useState(null);
  const isPlaying = useRef(false);

  const prevButtonHandler = () => {
    pauseVideo(); // Pause the video before moving to the previous slide
    setCurrentSlideIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  const nextButtonHandler = () => {
    pauseVideo(); // Pause the video before moving to the next slide
    setCurrentSlideIndex((prevIndex) =>
      prevIndex < videos.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  const onReady = () => {
    // Not used in this version with iframes
  };

  const pauseVideo = () => {
    if (isPlaying.current) {
      const iframe = document.getElementById('youtube-iframe');
      if (iframe) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
      isPlaying.current = false;
    }
  };

  const playVideo = () => {
    if (!isPlaying.current) {
      const iframe = document.getElementById('youtube-iframe');
      if (iframe) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      isPlaying.current = true;
    }
  };

  return (
    <div className={ChabtbotStyles["ytchatbot-message"]}>
      <div className={ChabtbotStyles.carousel} id="dynamicCarousel">
        {videos.length > 1 && (
          <a className={ChabtbotStyles["carousel-control-prev"]} role="button" onClick={prevButtonHandler}>
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </a>
        )}
        <div className={ChabtbotStyles["carousel-inner"]} style={{ padding: videos.length > 1 ? '0px' : '8px' , width:'100%'}}>
          {videos.map((video, index) => (
            <div
              key={index}
              className={`carousel-item ${index === currentSlideIndex ? 'active' : ''}`}
            >
              {index === currentSlideIndex && (
                <div className={ChabtbotStyles["responsive-video-container"]}>
                  <iframe
                    title={`YouTube Video ${index}`}
                    src={video.url}
                    frameBorder="0"
                    allowFullScreen
                    className={ChabtbotStyles["responsive-video"]}
                    id='youtube-iframe'
                  ></iframe>
                </div>
              )}
              <div className="font-weight-bold">
                {video.filename}
              </div>
            </div>
          ))}
        </div>

        {videos.length > 1 && (
          <a className={ChabtbotStyles["carousel-control-next"]} role="button" onClick={nextButtonHandler}>
            <span className="material-symbols-outlined" aria-hidden="true">arrow_forward_ios</span>
          </a>
        )}
      </div>

      
    </div>
  );
};

export default YoutubeCarousel;
