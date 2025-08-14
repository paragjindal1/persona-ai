import { useState,useEffect } from "react";
import hiteshChoudary from "./assets/hiteshchoudary.png";
import piyushGarg from "./assets/piyushgarg.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, GithubIcon, Bot, User, Sparkles } from "lucide-react";
import { useAIStore } from "./aiStore/ai";
import { systemPrompt } from "./SystemPrompt/systemPrompt";




const App = () => {
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [chat, setChat] = useState([]);

  const {response, setResponse} = useAIStore();

  // Sample persona data
  const personas = [
    {
      id: 1,
      title: "Hitesh Choudhary",
      description:
        "Helps with creative writing, brainstorming, and artistic projects",
      image: hiteshChoudary,
      systemPrompt: systemPrompt.hiteshChoudhary,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "Piyush Garg",
      description:
        "Expert in programming, software development, and technical guidance",
      image: piyushGarg,
      systemPrompt: systemPrompt.piyushGarg,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  useEffect(() => {
   setMessages([]);
   setChat([]);
  }, [selectedPersona]);

  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setMessages([
      {
        id: 1,
        text: `Hi! I'm your ${persona.title}. How can I help you today?`,
        sender: "persona",
        timestamp: new Date(),
      },
    ]);
  };

  

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedPersona) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    const newChat = {
      role: "user",
      content: inputValue,
    };

    // Update chat first, then messages
    const updatedChat = [...chat, newChat];
    setChat(updatedChat);
    setMessages((prev) => [...prev, newMessage]);

    console.log("chat - ", updatedChat);
    console.log("systemPrompt2 -- , ", selectedPersona.systemPrompt);

    // Call setResponse with updated chat
    await setResponse(selectedPersona.systemPrompt, updatedChat);

    // Clear input
    setInputValue("");
  };

  // Separate useEffect to handle response updates
  useEffect(() => {
    if (
      response &&
      messages.length > 0 &&
      messages[messages.length - 1].sender === "user"
    ) {
      const messageResponse = {
        id: messages.length + 1,
        text: response,
        sender: "persona",
        timestamp: new Date(),
      };

      const chatResponse = {
        role: "assistant", // Fixed typo from "assistent"
        content: response,
      };

      setChat((prev) => [...prev, chatResponse]);
      setMessages((prev) => [...prev, messageResponse]);
    }
  }, [response]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Persona
            </h1>
          </div>
          <Button
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <GithubIcon className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Persona Selection Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-200">
            Choose Your Persona
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {personas.map((persona) => (
              <Card
                key={persona.id}
                className={`cursor-pointer transition-all duration-300 border-2 bg-gray-800/50 hover:bg-gray-700/50 ${
                  selectedPersona?.id === persona.id
                    ? "border-purple-500 ring-2 ring-purple-500/20"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                onClick={() => handlePersonaSelect(persona)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${persona.color} flex items-center justify-center text-2xl mb-3`}
                  >
                    <img src={persona.image} alt={persona.title} />
                  </div>
                  <CardTitle className="text-white text-lg">
                    {persona.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-center text-sm">
                    {persona.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        {selectedPersona && (
          <Card className="bg-gray-800/50 border-gray-600">
            <CardHeader className="border-b border-gray-600">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${selectedPersona.color} flex items-center justify-center`}
                >
                  <img
                    src={selectedPersona.image}
                    alt={selectedPersona.title}
                  />
                </div>
                <div>
                  <CardTitle className="text-white">
                    {selectedPersona.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedPersona.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages Area */}
              <div className="h-96 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-blue-600"
                          : `bg-gradient-to-br ${selectedPersona.color}`
                      }`}
                    >
                      {message.sender === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <img
                          src={selectedPersona.image}
                          alt={selectedPersona.title}
                        />
                      )}
                    </div>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-600 p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Message ${selectedPersona.title}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedPersona && (
          <Card className="bg-gray-800/30 border-gray-600 border-dashed">
            <CardContent className="py-16 text-center">
              <Bot className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Select a Persona to Start Chatting
              </h3>
              <p className="text-gray-500">
                Choose one of the persona cards above to begin your conversation
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default App;
