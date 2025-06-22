import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Play, Pause, Mic, MicOff } from "lucide-react";

const Messages = () => {
  const [progress, setProgress] = useState(65);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "Hi there, I hope you're doing well. I've got service booking on your Toyota Corolla 18 and can you explain briefly",
      timestamp: "2:30 PM",
    },
    {
      id: 2,
      sender: "mechanic",
      text: "Hey! I'm well, thank you.",
      timestamp: "2:31 PM",
    },
    {
      id: 3,
      sender: "mechanic",
      text: "So, Toyota Corolla broken, I need to let me know if everything unusual comes up.",
      timestamp: "2:31 PM",
    },
    {
      id: 4,
      sender: "user",
      text: "Sure. So far has seemed like lot of and becomes the most brake prob. They were really warm too. 😨",
      timestamp: "2:32 PM",
    },
    {
      id: 5,
      sender: "user",
      text: "I'm replacing them now. I also noticed the front left tire is low on air - do you want me to top it up?",
      timestamp: "2:33 PM",
    },
    {
      id: 6,
      sender: "mechanic",
      text: "Yes please. That would be helpful.",
      timestamp: "2:34 PM",
    },
    {
      id: 7,
      sender: "user",
      type: "audio",
      duration: "0:05",
      timestamp: "2:35 PM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: "user",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks = [];

        mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
          const audioUrl = URL.createObjectURL(audioBlob);
          const newAudioMessage = {
            id: messages.length + 1,
            sender: "user",
            type: "audio",
            duration: "0:05",
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            audioUrl,
          };
          setMessages([...messages, newAudioMessage]);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  const toggleAudioPlay = (messageId) => {
    setPlayingAudio(playingAudio === messageId ? null : messageId);
  };

  const formatDuration = (duration) => duration || "0:05";

  const updateProgress = (newProgress) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
  };

  return (
    <div className="w-full p-0 md:p-8 lg:p-10">
      <div className="flex flex-col bg-white w-full mx-auto">
        {/* Header */}
        <div className="bg-white w-full border-b border-gray-200 px-4 py-5">
          <div className="flex w-full items-center justify-between">
            <div className="w-full">
              <h1 className="text-xl md:text-2xl font-semibold text-[#141414]">
                Service Request - Toyota Corolla 2018
              </h1>
              <div className="flex flex-col items-start mt-3">
                <div className="text-sm md:text-base font-medium text-[#141414]">
                  In Progress
                </div>
                <div className="w-full mt-2 mb-2">
                  <div className="flex items-center w-full justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      {progress === 100 ? "Complete!" : `${progress}% Complete`}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => updateProgress(progress - 5)}
                        // className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded text-gray-700"
                      >
                        {/* -5% */}
                      </button>
                      <button
                        onClick={() => updateProgress(progress + 5)}
                        // className="px-2 py-1 text-xs bg-blue-200 hover:bg-blue-300 rounded text-blue-700"
                      >
                        {/* +5% */}
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 w-full rounded-full transition-all duration-300 ease-out ${
                        progress === 100 ? "bg-green-500" : "bg-purple-700"
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-[12px] md:text-sm font-medium text-[#757575]">
                  Estimated completion: 2 days
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <div className="text-sm md:text-base font-medium text-[#141414]">
              Mechanic:
            </div>
            <div className="flex space-x-3 items-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="">
                <h1 className="font-medium text-base"> John Doe</h1>
                <h1 className="font-light text-sm text-gray-700">
                  Certifield Mechanic
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                {message.sender === "mechanic" && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-gray-600">
                      DB
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  {message.type === "audio" ? (
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleAudioPlay(message.id)}
                          className={`p-1 rounded-full ${
                            message.sender === "user"
                              ? "bg-blue-400 hover:bg-blue-300"
                              : "bg-gray-100 hover:bg-gray-200"
                          } transition-colors`}
                        >
                          {playingAudio === message.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        {message.audioUrl && (
                          <audio
                            ref={(el) => {
                              if (playingAudio === message.id) el?.play();
                              else el?.pause();
                            }}
                            src={message.audioUrl}
                          />
                        )}
                        <div className="flex-1">
                          <div
                            className={`flex items-center space-x-1 ${
                              message.sender === "user"
                                ? "text-white"
                                : "text-gray-600"
                            }`}
                          >
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full ${
                                  playingAudio === message.id && i < 8
                                    ? "bg-current h-4"
                                    : "bg-current opacity-40 h-2"
                                } transition-all duration-150`}
                                style={{
                                  animationDelay: `${i * 50}ms`,
                                  animation:
                                    playingAudio === message.id
                                      ? "pulse 1s infinite"
                                      : "none",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        <span
                          className={`text-xs ${
                            message.sender === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatDuration(message.duration)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          message.sender === "user"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {message.text}
                      </p>
                    </div>
                  )}
                  <span
                    className={`text-xs text-gray-500 mt-1 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white">You</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-end space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type something..."
                aria-label="Type a message"
                className="w-full px-4 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="1"
                style={{ minHeight: "40px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
