import React, { useEffect } from 'react';
// import '../chatbotComponent/chatbotstyles.css';
import { useState } from 'react';
import { useRef } from 'react';
import TypeIt from 'typeit-react';
import audioFile from './ping.mp3';
import YoutubeCarousel from './Youtubevideos';
import RenderMultipleCards from './renderMultipleCards';
import ChatbotStyles from './chatbotstyles.module.css';
import pemlogo from '../assets/pemlogo.png'


const GcpChatbot = ({ apiURL}) => {
  console.log('apiURL', apiURL)
  const [chatclick, setchatclicked] = useState(false);
  const [txtInputValue, settextInputValue] = useState("");
  const [showmic, setshowmic] = useState(true);
  const [messages, setMessages] = useState([]); // Store chat messages here
  const [isThumbsUpSelected, setIsThumbsUpSelected] = useState([]);
  const [isThumbsDownSelected, setIsThumbsDownSelected] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const pingAudioRef = new Audio(audioFile);
  const [micname, setmicname] = useState("mic")
  // const [audioChunks, setAudioChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [currentAudioSource, setCurrentAudioSource] = useState(null);
  const [lastmsgs, setLastmsgs] = useState([])
  const chatBodyRef = useRef(null);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const abortController = new AbortController();
  const [showsetting, setshowsettings] = useState(false);
  const [isContrastOn, setIsContrastOn] = useState(false);
  const [fontSize, setFontSize] = useState('medium');








  useEffect(() => {
    // Place your initialization logic here
    // For example, you can call getConversationId()
    //console.log("hey")
    if (!localStorage.getItem('session_id')) {
      let id = generateRandomString();
      localStorage.setItem('session_id', id);
    }


    getChatbotResponse();
    // initializeConversation();
    //renderFirstMessage();

  }, []);
  // useEffect(() => {

  //   let session=generateRandomString();
  //   setsession_id(session);
  //   console.log(session_id,session)

  // }, [session_id]);
  useEffect(() => {
    setScrollPosition()
  }, [messages])

  // Call setContrastStyles whenever isContrastOn changes
  useEffect(() => {
    setContrastStyles();
  }, [isContrastOn]);

  function generateRandomString() {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  //apicalls for getting conversationid
  async function initializeConversation() {
    try {
      const conversationId = await getConversationIdresponse();
      localStorage.setItem("conversation_id", conversationId);

    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  }

  async function getConversationIdresponse() {
    const response = await fetch("https://directline.botframework.com/v3/directline/conversations", {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer vaGZhBz9bWc.wdfBHyEl4p1fAld1k-N1JmL5fWzMRgYPlad64cxOk-w",
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let loadingobj = {
      type: "loadingchat",
      content: "Loading",
    }
    setMessages((prevMessages) => [...prevMessages, loadingobj]);

    const jsonData = await response.json();
    setMessages((prevMessages) => prevMessages.slice(0, -1));
    // pingAudioRef.play();
    return jsonData.conversationId;
  }

  //Api calls for chatbotresponses
  async function response(url, data) {
   

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${BEARER_TOKEN}`
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {

      setMessages((prevMessages) => prevMessages.slice(0, -1));
      setIsLoading(false)
      let errorresponses = {
        translated_response: "I'm sorry there was an error with the Bot Response, please try again",
        quick_replies: [],
        cards: [],
        urls: []

      };
      const newMessage = {
        type: 'chatbot',
        content: errorresponses,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      settextInputValue("")

    }
    const jsonData = await response.json();
    console.log("Pinaki")
    setIsLoading(false)
    console.log(jsonData);
    return jsonData;



  }

  async function getChatbotResponse(userInput) {

    let url = apiURL;
    let  lastmsgsTemp= [...lastmsgs];
    //"
    //let url = "http://127.0.0.1:5001"
    if (userInput === undefined) {
      // url = url + "/welcome"
      // url = url;
    }
    else {
      //url = url + "/middleware"
      url = url;
      let userobj = { role: "user", content: userInput };
     
      
      lastmsgsTemp.push(userobj)
      setLastmsgs(lastmsgsTemp);
    }
    const data = {
      "messages": lastmsgsTemp,
      //"text": userInput,
      "project_id": "chatbot-393112",
      "session_id": localStorage.getItem('session_id'),
    }
    //console.log(data)
    let loadingobj = {
      type: "loadingchat",

      content: "Loading",
    }

    setIsLoading(true)
    setMessages((prevMessages) => [...prevMessages, loadingobj]);
    let resp;
    try {
      
      resp = await response(url, data);
    }
    catch (e) {
      let errorresponses = {
        translated_response: `Thank you for reaching out.As an HR bot,
    I am only able to assist with human resources related questions.Do you have any HR questions I can try to answer for Penn Engineering?`,
        quick_replies: [],
        cards: [],
        urls: []

      };
      const newMessage = {
        type: 'chatbot',
        content: errorresponses,
      };
      resp = newMessage
    }

    setMessages((prevMessages) => prevMessages.slice(0, -1));
    setIsLoading(false)
    settextInputValue("")
    if (userInput !== undefined) {
      pingAudioRef.play();

    }
    if (userInput == undefined) {
      const newMessage = {
        type: 'chatbot',
        content: resp,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }



    if (userInput !== undefined) {
      let responseobj = { role: "assistant", content: resp?.translated_response }
      lastmsgsTemp.push(responseobj);
      setLastmsgs(lastmsgsTemp);
    }
    if (lastmsgsTemp.length > 6) {
      lastmsgsTemp.splice(0, 2);
      setLastmsgs(lastmsgsTemp);
    }
    //console.log(resp)
    return resp
  };


  //Api call for text to audio response
  async function texToAudioResponse(url, data) {

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...data }),
      signal: abortController.signal, // Pass the signal here

    })
      .then(response => response.arrayBuffer())
      .then(wavData => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Decode the WAV data into an audio buffer
        audioContext.decodeAudioData(wavData, (audioBuffer) => {
          // Create a buffer source node and connect it to the audio context's destination
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);

          // Start playing the audio
          setCurrentAudioSource(source);
          //console.log(currentAudioSource)

          source.start();
        });
      });
  }

  async function getTextToAudioResponse(userInput) {

    let url = "https://chatbot-393112.ue.r.appspot.com/"
    //let url="http://127.0.0.1:5000"
    url = url + "/text_to_speech"

    const data = {
      "text": userInput.text,
      "detected_language": userInput.detected_language
    }

    const resp = await texToAudioResponse(url, data)
    //console.log(resp)
    return resp
  };

  //Api call for users Audio to text response
  async function audioresponse(url, data) {
    try {
      const formData = new FormData();
      formData.append('file', data, 'audio.weba'); // Your audio file should be a File or Blob representing the audio data.

      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // throw new Error('Network response was not ok');

      }

      const responseData = await response.json();

      return responseData
    } catch (error) {
      console.error('Error in audioresponse:', error);
      // Handle the error as needed, e.g., by displaying an error message in the chat interface.
    }
  }


  async function getChatbotAudioResponse(userInput) {

    let url = "https://chatbot-393112.ue.r.appspot.com/"
    //let url="http://127.0.0.1:5000"

    url = url + "/speech_to_text"

    const data = userInput
    let loadingobj = {
      type: "user-audio",
      content: "Loading",
    }
    setIsLoading(!isLoading)
    setMessages((prevMessages) => [...prevMessages, loadingobj]);
    //console.log(isLoading,messages,loadingobj)

    const resp = await audioresponse(url, data)
    setMessages((prevMessages) => prevMessages.slice(0, -1));
    setIsLoading(false)
    settextInputValue("")
    //console.log(resp)
    return resp
  };

  const renderFirstMessage = () => {
    let firstmsg = {};
    firstmsg.translated_response = `Hello! Welcome to HR. `;
    firstmsg.quick_replies = [];
    firstmsg.urls = [];
    const newMessage = {
      type: 'chatbot',
      content: firstmsg,
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }
  const setScrollPosition = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }
  //when minimize or click the chatbot
  const handlechatclick = () => {
    setchatclicked(prev => !prev);
    //console.log(chatclick);
  }

  const handleInputChange = (event) => {
    settextInputValue(event.target.value);
    if (event.target.value.length == 0) {
      setshowmic(true)
    }
    if (event.target.value.length > 0) {
      setshowmic(false);
      //console.log(currentAudioSource)
      if (currentAudioSource !== null) {
        currentAudioSource.stop();
        setCurrentAudioSource(null)
      }

    }
  }

  const handleInputKeydown = (event) => {

    if (event.keyCode == 13 && event.target.value.length > 0 && isLoading === false) {
      // renderMessageEle(event.target.value, "user");
      const newMessage = {
        type: 'user',
        content: txtInputValue,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      handleusermessage(txtInputValue)
      settextInputValue("");
      //setScrollPosition();
    }
  }
  const handlesend = (event) => {
    if (txtInputValue.length > 0) {
      //renderMessageEle(txtInputValue, "user");
      const newMessage = {
        type: 'user',
        content: txtInputValue,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      handleusermessage(txtInputValue)
      settextInputValue("");
      //setScrollPosition();
    }
  }

  const handleusermessage = async (usermessage, type) => {
    //setScrollPosition()
    if (type === undefined) {
      const res = await getChatbotResponse(usermessage)
      const newMessage = {
        type: 'chatbot',
        content: res,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    else {
      const res = await getChatbotResponse(usermessage)
      const newMessage = {
        type: 'chatbot',
        content: res,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      let translatedtext = res.translated_response



      if (res.cards.length > 0) {
        res.cards.map((card) => {

          let text = card.title + "." + card.subtitle
          translatedtext += text + "."
        })
      }
      translatedtext = translatedtext.replace(/\[([^\]]+)\]\(([^)]+)\)/gi, " ")
      translatedtext = translatedtext.replace(/\*\*(.*?)\*\*/g, "")


      let obj = {
        "text": translatedtext,
        "detected_language": type
      }
      getTextToAudioResponse(obj)

    }

    //setScrollPosition()

  }
  function handleQuickReplyClick(ele) {
    const newMessage = {
      type: 'user',
      content: ele,
    };
    // setScrollPosition();

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    //setScrollPosition();
    handleusermessage(ele)


  }
  const renderchatbotmessages = (message, index) => {
    const elements = [];
    if (message?.content?.translated_response && message?.content?.urls?.length === 0) {
      message.content.translated_response = message.content.translated_response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      let modifiedContent = message?.content?.translated_response.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, $1, $2) {
        if ($1.includes("Doc")) {
          $1 = $1.replace("Doc", "")
          return '<sup style="font-weight:bold;"><a href="' + $2 + '" target="_blank">[' + $1 + ']</a></sup>&nbsp;';
        } else {
          return '<a href="' + $2 + '" target="_blank">' + $1 + '</a>';
        }
      });
      elements.push(rendertranslatedresponse(modifiedContent, index));
    }
    if (message?.content?.translated_response && message?.content?.urls?.length > 0) {
      message.content.translated_response = message.content.translated_response.replace(/\\n/g, '<br />');
      message.content.translated_response = message.content.translated_response.replace(/['"]+/g, '');
      const regex = /https:\/\/www\.youtube\.com\/embed\/([\w-]+)/g;
      const matches = message.content.urls[0].url.match(regex);
      if (matches) {
        message.content.translated_response = message.content.translated_response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        let modifiedContent = message.content.translated_response.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, $1, $2) {
          if ($1.includes("Doc")) {
            $1 = $1.replace("Doc", "")
            return '<sup style="font-weight:bold;"><a href="' + $2 + '" target="_blank">[' + $1 + ']</a></sup>&nbsp;';
          } else {
            return '<a href="' + $2 + '" target="_blank">' + $1 + '</a>';
          }
        });
        elements.push(rendertranslatedresponse(modifiedContent, index));
        elements.push(rendertranslatedresponsewithYturls(message.content.urls))
      }
      else {
        message.content.translated_response = message.content.translated_response.replace(/\\n/g, '<br />');
        message.content.translated_response = message.content.translated_response.replace(/['"]+/g, '');
        message.content.translated_response = message.content.translated_response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        let modifiedContent = message.content.translated_response.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (match, $1, $2) {
          if ($1.includes("Doc")) {
            $1 = $1.replace("Doc", "")
            return '<sup style="font-weight:bold;"><a href="' + $2 + '" target="_blank">[' + $1 + ']</a></sup>&nbsp;';
          } else {
            return '<a href="' + $2 + '" target="_blank">' + $1 + '</a>';
          }
        });
        elements.push(rendertranslatedresponsewithurls(modifiedContent, message.content.urls, index));

      }
    }
    if (message?.content?.quick_replies?.length) {
      elements.push(renderquickreplies(message.content.quick_replies));
    }
    if (message?.content?.cards?.length > 0) {
      elements.push(rendercards(message.content.cards));
    }
    return elements.map(element => {
      //setScrollPosition()
      return element;
    });
  }
  const rendertranslatedresponse = (message, toggleindex) => {

    //console.log(message)
    return (
      <div className={ChatbotStyles["chatbot-message"]} >
        <pre>
          <TypeIt
            options={{
              strings: [message],
              speed: 5,
              waitUntilVisible: true,
              cursor: false,
              html: true,
              afterComplete() {
                setScrollPosition()
              }



            }}


          >
          </TypeIt>
        </pre>

        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: '8px' }}>
          <i
            className={`material-symbols-outlined ${ChatbotStyles["thumbs-icon"]} ${ChatbotStyles["thumbscolor"]} ${isThumbsUpSelected.includes(toggleindex) ? `${ChatbotStyles["thumbs-up-selected"]}` : ''
              }`}
            id="thumbupid"
            onClick={() => { handleThumbsUpClick(toggleindex) }}
          >
            thumb_up
          </i>
          <i
            className={`material-symbols-outlined ${ChatbotStyles["thumbs-icon"]} ${ChatbotStyles["thumbscolor"]} ${isThumbsDownSelected.includes(toggleindex) ? `${ChatbotStyles["thumbs-down-selected"]}` : ''
              }`}
            id="thumbdownid"
            onClick={() => { handleThumbsDownClick(toggleindex) }}
          >
            thumb_down
          </i>
        </div>


      </div>
    )
  }
  const rendertranslatedresponsewithurls = (message, urls, toggleindex) => {

    //console.log(message)
    return (
      <div className={ChatbotStyles["chatbot-message"]}>
        <pre>
          <TypeIt
            options={{
              strings: [message],
              speed: 20,
              waitUntilVisible: true,
              cursor: false,
              html: true,
              afterComplete() {
                setScrollPosition()
              }


            }}
          >
          </TypeIt>
        </pre>
        <div className={ChatbotStyles.dropdown}>
          <span className={ChatbotStyles["references-toggle"]} onClick={() => handleToggleClick(toggleindex)}>
            References
          </span>
          <div className={`references-collapse ${expandedIndexes.includes(toggleindex) ? 'expanded' : ''}`}>
            <div className={ChatbotStyles["references-dropdown"]}>
              {urls.map((pdf, index) => (
                <a
                  key={index}
                  href={pdf.url}
                  target="_blank"
                  className={ChatbotStyles["reference-link"]}
                >
                  {`${index + 1}. ${pdf.filename}`}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', paddingRight: '8px' }}>
          <i
            className={`material-symbols-outlined ${ChatbotStyles["thumbs-icon"]} ${ChatbotStyles["thumbscolor"]} ${isThumbsUpSelected.includes(toggleindex) ? `${ChatbotStyles["thumbs-up-selected"]}` : ''
              }`}
            id="thumbupid"
            onClick={() => { handleThumbsUpClick(toggleindex) }}
          >
            thumb_up
          </i>
          <i
            className={`material-symbols-outlined ${ChatbotStyles["thumbs-icon"]} ${ChatbotStyles["thumbscolor"]} ${isThumbsDownSelected.includes(toggleindex) ? `${ChatbotStyles["thumbs-down-selected"]}` : ''
              }`}
            id="thumbdownid"
            onClick={() => { handleThumbsDownClick(toggleindex) }}
          >
            thumb_down
          </i>
        </div>

      </div>
    )
  }
  const rendertranslatedresponsewithYturls = (content) => {

    return <YoutubeCarousel videos={content} />

  }
  const renderquickreplies = (message) => {
    return (
      <div style={{ width: '100%', fontSize: '14px', display: 'flex', flexWrap: "wrap" }}>
        {message.map((ele, index) => (
          <button key={index} className={ChatbotStyles.quickbtn} onClick={() => handleQuickReplyClick(ele)} disabled={isLoading}>
            {ele}
          </button>
        ))}
      </div>
    )
  }
  const rendercards = (cards) => {
    if (cards.length === 1) {
      return (
        <div className={ChatbotStyles.cardsdiv}>
          {cards.map((card, index) => (
            <div key={index} className={ChatbotStyles.cardCard}>
              {card.image_uri && <img src={card.image_uri} alt={card.title} />}
              <div className={ChatbotStyles.cardtitle}>
                <span className={ChatbotStyles["font-weight-bold"]}>{card.title}</span>
                <div style={{ fontWeight: 'normal', fontSize: 'small' }}>
                  {card.subtitle &&
                    card.subtitle.split('\n').map((subtitle, subIndex) => (
                      <React.Fragment key={subIndex}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: subtitle.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                          }}
                        />

                      </React.Fragment>
                    ))}
                </div>
              </div>
              {card.buttons.length > 0 &&
                card.buttons.map((button, buttonIndex) => (
                  <a key={buttonIndex} href={button.postback} target="_blank" className={ChatbotStyles.cardlink}>
                    {button.text}
                  </a>
                ))}

            </div>
          ))}
        </div>
      );
    }
    else {
      return <RenderMultipleCards cards={cards} />
    }

  }

  const runAudioRecording = () => {
    if (currentAudioSource !== null) {
      currentAudioSource.stop();
      setCurrentAudioSource(null)

    }
    if (!isRecording) {
      startRecording();
    }
    else {
      stopRecording();
    }
  }
  const startRecording = () => {
    setmicname("radio_button_checked")
    const audioChunks = []
    setIsRecording(true);

    if (currentAudioSource !== null) {
      currentAudioSource.stop();
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data)
          }
        };

        recorder.onstop = () => {
          convertToWav(audioChunks);
        };

        recorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    setmicname("mic")

    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const convertToWav = async (audioChunks) => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    //console.log(audioBlob)

    // Call the function to handle the audioBlob as needed
    const responseData = await getChatbotAudioResponse(audioBlob);
    if (responseData.transcripts?.length > 0) {
      const newMessage = {
        type: 'user',
        content: responseData.transcripts,
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      handleusermessage(responseData.transcripts[0], responseData.detected_language)
    }

  };
  const toggleCard = (index) => {
    if (activeCardIndex === index) {
      setActiveCardIndex(null);
    } else {
      setActiveCardIndex(index);
    }
  };



  const handleToggleClick = (index) => {
    setExpandedIndexes(prevIndexes => {
      if (prevIndexes.includes(index)) {
        return prevIndexes.filter(i => i !== index);
      } else {
        return [...prevIndexes, index];
      }
    });
  }



  const handleThumbsUpClick = (index) => {
    setIsThumbsUpSelected((prevSelected) => {
      const updatedSelected = [...prevSelected];
      if (updatedSelected.includes(index)) {
        updatedSelected.splice(updatedSelected.indexOf(index), 1); // Remove if already selected
      } else {
        updatedSelected.push(index); // Add if not selected
      }
      return updatedSelected;
    });
    // Ensure thumbs-down is not selected for the same message
    setIsThumbsDownSelected((prevSelected) =>
      prevSelected.filter((item) => item !== index)
    );
  };

  const handleThumbsDownClick = (index) => {
    setIsThumbsDownSelected((prevSelected) => {
      const updatedSelected = [...prevSelected];
      if (updatedSelected.includes(index)) {
        updatedSelected.splice(updatedSelected.indexOf(index), 1); // Remove if already selected
      } else {
        updatedSelected.push(index); // Add if not selected
      }
      return updatedSelected;
    });
    // Ensure thumbs-up is not selected for the same message
    setIsThumbsUpSelected((prevSelected) =>
      prevSelected.filter((item) => item !== index)
    );
  };




  //loading animations
  const ChatLoadingAnimation = (type) => {

    const containerClass = type !== 'user-audio' ? 'loading-container' : 'user-loading-container';
    const containerBall = type !== 'user-audio' ? 'ball' : 'user-ball';
    return (
      <div className={ChatbotStyles[containerClass]}>
        <div className={ChatbotStyles["bouncing-balls"]}>
          {[1, 2, 3].map((index) => (
            <div key={index} className={ChatbotStyles[containerBall]}></div>
          ))}
        </div>
      </div>
    );
  };
  const SendLoadingAnimation = () => {
    return (
      <div className={ChatbotStyles["send-loading-container"]} id="send-loading-container">
        <div className={ChatbotStyles["bouncing-balls"]}>
          {[1, 2, 3].map((index) => (
            <div key={index} className={ChatbotStyles["send-ball"]}></div>
          ))}
        </div>
      </div>
    );
  };


  //chat reset
  const resetChat = () => {
    setMessages([])
    let id = generateRandomString();
    localStorage.setItem('session_id', id);
    getChatbotResponse();
    abortController.abort();


  }

  const setsettings = () => {
    setshowsettings(prev => !prev)
  }
  const toggleContrast = () => {
    setIsContrastOn((prevState) => !prevState);
  };

  const setContrastStyles = () => {
    if (isContrastOn) {
      document.documentElement.style.setProperty("--chatbot-primary-color", "yellow");
      document.documentElement.style.setProperty("--chatbot-light-color", "black");
      document.documentElement.style.setProperty("--chatbot-dark-color", "yellow");
      document.documentElement.style.setProperty("--chat-background-color", "black");
      document.documentElement.style.setProperty("--quick-reply-background-color", "yellow");
    } else {
      document.documentElement.style.setProperty("--chatbot-primary-color", "#0099D8");
      document.documentElement.style.setProperty("--chatbot-light-color", "white");
      document.documentElement.style.setProperty("--chatbot-dark-color", "black");
      document.documentElement.style.setProperty("--chat-background-color", "#d9e7f6");
      document.documentElement.style.setProperty("--quick-reply-background-color", "#6c757d");
    }
  };


  const handleFontSizeChange = (newSize) => {

    if (newSize === 'small') {
      document.documentElement.style.setProperty("--chatbot-font-size", "0.8rem");

    } else if (newSize === 'medium') {
      document.documentElement.style.setProperty("--chatbot-font-size", "1rem");
    } else if (newSize === 'large') {
      document.documentElement.style.setProperty("--chatbot-font-size", "1.2rem");
    }

  };




  return (
    <div className='chatbot-component'>
      <div className={ChatbotStyles["chat-icon"]} id="chat-icon" onClick={handlechatclick}>
        <span className="material-symbols-outlined chaticon" style={{ color: "var(--chatbot-light-color", fontSize: "30px" }}>
          chat
        </span>
      </div>
      {chatclick == true && (
        <div className={`${ChatbotStyles['chat-container']}`} id="chat-container">

          <div className={ChatbotStyles["chat-header"]} id="chat-header">
            <div className={ChatbotStyles.logo}>
              <img
                src={pemlogo}
                alt="MHS Indiana logo"
                className={ChatbotStyles.headerimg}
              />
            </div>
            

            <div className={ChatbotStyles.title}>HR Bot</div>

            <div  className={ChatbotStyles["chat-buttons"]}>

              <div className={ChatbotStyles["settings-div"]} id="settingsdiv" >
                <span className="material-symbols-rounded" onClick={setsettings}>
                  settings
                </span>
                {
                  showsetting && (<div className={ChatbotStyles["settings-options"]}>
                    <div className={ChatbotStyles["contrast-option"]}>
                      <label htmlFor="contrast-switch" className={ChatbotStyles["contrast-switch"]}>
                        Contrast
                      </label>

                      <label className={ChatbotStyles.switch}>
                        <input type="checkbox" id="contrast-switch" checked={isContrastOn}
                          onChange={toggleContrast} />
                        <span className={ChatbotStyles.slider}></span>
                      </label>
                    </div>

                    <div className={ChatbotStyles['font-size-options']}>
                      <label htmlFor="font-size" className={ChatbotStyles['font-size']}>
                        Font Size
                      </label>

                      <div className={ChatbotStyles['font-size-buttons']}>
                        <button
                          className={ChatbotStyles['font-size-button']}
                          onClick={() => handleFontSizeChange('small')}
                          data-size="small"
                        >
                          Small
                        </button>
                        <button
                          className={ChatbotStyles['font-size-button']}
                          onClick={() => handleFontSizeChange('medium')}
                          data-size="medium"
                        >
                          Medium
                        </button>
                        <button
                          className={ChatbotStyles['font-size-button']}
                          onClick={() => handleFontSizeChange('large')}
                          data-size="large"
                        >
                          Large
                        </button>
                      </div>
                    </div>
                  </div>)
                }

              </div>

              <div className={ChatbotStyles["reset-chat"]} id="reset-chat" onClick={resetChat}>
                <span className="material-symbols-outlined mt-2">
                  restart_alt
                </span>
              </div>

              <div className={ChatbotStyles["minimize-chat"]} id="minimize-chat" onClick={handlechatclick}>
                <span className="material-symbols-outlined">
                  Minimize
                </span>
              </div>

            </div>

          </div>

          <div className={ChatbotStyles["chat-body"]} ref={chatBodyRef}>
            {messages.map((message, index) => {

              if (message.type === 'user') {
                return (
                  <div key={index} className={ChatbotStyles["user-message"]}>
                    <pre>{message.content}</pre>
                  </div>
                );
              }
              else if (message.type === 'chatbot') {
                return renderchatbotmessages(message, index)
              }
              else if (message.type === 'loadingchat') {
                return ChatLoadingAnimation()
              }
              else if (message.type === 'user-audio') {
                return ChatLoadingAnimation("user-audio")
              }


            })}
          </div>


          <div className={ChatbotStyles["chat-input"]}>

            <div className={ChatbotStyles["input-sec"]}>
              <input
                type="text"
                id="txtInput"
                className={ChatbotStyles["txtInput"]}
                placeholder="How can I help you?"
                autoFocus
                autoComplete="off"
                value={txtInputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeydown}
              // onKeyPress={handleInputKeyPress}
              />
            </div>

            {isLoading ? <div className={ChatbotStyles.send} id="senddiv">{SendLoadingAnimation()}</div> : <div className={ChatbotStyles.send} id="senddiv">
              {
                txtInputValue.length == 0 ? (<span
                  className="material-symbols-rounded"
                  id="micicon"
                  style={{ fontSize: '28px', cursor: 'pointer' }}
                  onClick={runAudioRecording}
                >
                
                </span>)
                  :

                  (<span
                    className="material-symbols-rounded"
                    alt="send"
                    id="sendmsg"
                    onClick={handlesend}
                  >
                    send
                  </span>)
              }

            </div>}


          </div>

          <div className={ChatbotStyles["footer-msg"]}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '12px', marginRight: '5px' }}
            >
              info
            </span>
            <span>
              Verification of critical info from AI generated responses is recommended
            </span>

          </div>

        </div>
      )}

    </div>
  );
}
export default GcpChatbot;