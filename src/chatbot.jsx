import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css'; // Assuming you have a CSS file for styles
import './App.css'; // Import global styles if needed

const faqQA = [
  {
    question: "What are your rental charges?",
    answer: `Our pricing is as follows:
• XX for the first 30 minutes
• ₹YY per additional hour
• ₹ZZ daily cap (24-hour max charge)
You’ll see all pricing details on the website before confirming the rental.`,
    keywords: ['price', 'cost', 'charges', 'rental'],
  },
  {
    question: "What types of devices are supported?",
    answer: `Each power bank has 3 built-in cables:
• USB-C (Android, new devices)
• Lightning (iPhones)
• Micro-USB (older Android phones, some accessories)`,
    keywords: ['devices', 'supported', 'cables', 'types'],
  },
  {
    question: "How do I pay?",
    answer: `We accept multiple payment methods:
• UPI (Stripe/PayPal)
• Credit/Debit Cards
• Wallets & Net Banking
Payment is deducted automatically after return.`,
    keywords: ['pay', 'payment', 'methods'],
  },
  {
    question: "Do I need to register to use the service?",
    answer: `Yes, you need to sign up with your phone number and complete a quick verification to start renting.`,
    keywords: ['register', 'sign up', 'account', 'login'],
  },
  {
    question: "Is there a deposit required?",
    answer: `No deposit is required. However, a temporary security hold may be applied and refunded upon return.`,
    keywords: ['deposit', 'security', 'hold'],
  },
  {
    question: "Where can I return the power bank?",
    answer: `You can return it at any ChargeMe station. Use the map on the website to locate nearby return points.`,
    keywords: ['return', 'drop off', 'station', 'locations'],
  },
  {
    question: "What if I lose or damage the power bank?",
    answer: `You may be charged a replacement fee of ₹XXX. Contact support if you encounter accidental damage or technical issues.`,
    keywords: ['lose', 'damage', 'broken', 'replacement'],
  },
  {
    question: "What if the power bank doesn't work or charge properly?",
    answer: `Try:
• Switching cables
• Ensuring your device is not the issue
• Replacing the power bank at a nearby station
Still facing issues? Reach out to support via the website.`,
    keywords: ['not working', 'charge', 'problem', 'faulty'],
  },
  {
    question: "How long can I keep the power bank?",
    answer: `You can use it for as long as you need. The rental will continue to be charged until:
• It is returned, OR
• It reaches the maximum daily charge cap.`,
    keywords: ['keep', 'duration', 'time limit', 'rental period'],
  },
  {
    question: "Can I reserve a power bank in advance?",
    answer: `Not currently. All rentals are available on a first-come, first-served basis.`,
    keywords: ['reserve', 'book', 'advance'],
  },
  {
    question: "What if the station doesn’t dispense a power bank?",
    answer: `Please ensure:
• The app has Bluetooth and location enabled
• There are power banks available
• You have a valid payment method
If the issue persists, contact support.`,
    keywords: ['dispense', 'station problem', 'no power bank', 'issue'],
  },
];

function getRandomFaqs(count) {
  const copy = [...faqQA];
  const selected = [];
  while (selected.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(idx, 1)[0]);
  }
  return selected;
}

// Utility: match user free text input with FAQ keywords
function findMatchingFaq(input) {
  const lowerInput = input.toLowerCase();
  return faqQA.find(({ keywords }) =>
    keywords.some((kw) => lowerInput.includes(kw))
  );
}

const SupportForm = () => {
  // Your existing SupportForm code but replace inline styles with CSS classes
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate sending
    setStatus('Support request sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="support-form">
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
        aria-label="Your Name"
        className="input-field"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
        aria-label="Your Email"
        className="input-field"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Describe your issue"
        required
        aria-label="Describe your issue"
        className="input-field textarea-field"
      />
      <button type="submit" className="send-button">
        Send Request
      </button>
      {status && <p className="status-text">{status}</p>}
    </form>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [quickReplies, setQuickReplies] = useState(getRandomFaqs(3));

  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, activeTab]);

  const toggleChat = () => setIsOpen((open) => !open);

  const addMessage = (sender, text) => {
    setChatHistory((prev) => [...prev, { sender, text }]);
  };


  // Map of related questions by question text
const relatedQuestionsMap = {
  "What are your rental charges?": [
    "How do I pay?",
    "Is there a deposit required?",
    "Can I reserve a power bank in advance?"
  ],
  "What types of devices are supported?": [
    "What if the power bank doesn't work or charge properly?",
    "Where can I return the power bank?",
    "Do I need to register to use the service?"
  ],
  // ... add other mappings as needed
};

const getRelatedQuickReplies = (currentQuestion) => {
  const related = relatedQuestionsMap[currentQuestion];
  if (related) {
    // Map related question texts to full faqQA objects
    const relatedFaqs = related
      .map((q) => faqQA.find((f) => f.question === q))
      .filter(Boolean);
    // Return up to 3 related questions
    return relatedFaqs.slice(0, 3);
  }
  // Fallback: random 3 from faqQA excluding current question
  return getRandomFaqsFromArray(
    3,
    faqQA.filter((f) => f.question !== currentQuestion)
  );
};

const handleUserQuestion = (question) => {
    addMessage('user', question);

    const faq = faqQA.find((f) => f.question === question) || findMatchingFaq(question);

    if (faq) {
      addMessage('bot', faq.answer);
      setQuickReplies(getRelatedQuickReplies(faq.question));
    } else {
      addMessage('bot', "Sorry, I didn't quite get that. Could you please rephrase?");
      setQuickReplies(getRandomFaqs(3));
    }
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    handleUserQuestion(chatInput);
    setChatInput('');
  };

  const handleQuickReplyClick = (question) => {
    handleUserQuestion(question);
    const remaining = faqQA.filter((f) => f.question !== question);
    setQuickReplies(getRandomFaqsFromArray(3, remaining));
  };

  // Helper to get random FAQs from a given array
  const getRandomFaqsFromArray = (count, arr) => {
    const copy = [...arr];
    const selected = [];
    while (selected.length < count && copy.length > 0) {
      const idx = Math.floor(Math.random() * copy.length);
      selected.push(copy.splice(idx, 1)[0]);
    }
    return selected;
  };

  return (
    <div>
      {!isOpen && (
        <button
          className="chat-bubble"
          onClick={toggleChat}
          aria-label="Open chatbot"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          ⚡
        </button>
      )}

      {isOpen && (
        <div className="chat-window" aria-modal="true" role="dialog" aria-label="ChargeMe chatbot window">
          <div className="chat-header">
            ChargeMe Support
            <button
              className="close-button"
              onClick={toggleChat}
              aria-label="Close chatbot"
              title="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="scroll-area" ref={scrollRef}>
            {activeTab === 'home' && (
              <div className="home-content">
                <h2>What is ChargeMe?</h2>
                <p>
                  ChargeMe is a smart IoT-based power bank sharing service. We provide portable chargers at convenient locations,
                  allowing users to rent and return power banks from any of our stations.
                </p>
                <h2>How does it work?</h2>
                <ol>
                  <li>Download & open the ChargeMe app</li>
                  <li>Scan the QR code on a station</li>
                  <li>Collect the power bank automatically dispensed</li>
                  <li>Charge your device anywhere</li>
                  <li>Return it at any ChargeMe station</li>
                </ol>
              </div>
            )}

            {activeTab === 'chat' && (
              <>
                {chatHistory.length === 0 && (
                  <p style={{ color: '#555', fontStyle: 'italic' }}>Choose a question below or type your query to get started.</p>
                )}

                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}
                  >
                    <div className={`chat-bubble-message ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {quickReplies.length > 0 && (
                  <div className="quick-replies-container" aria-label="Suggested questions">
                    {quickReplies.map(({ question }) => (
                      <button
                        key={question}
                        className="quick-reply-button"
                        onClick={() => handleQuickReplyClick(question)}
                        aria-label={`Ask: ${question}`}
                      >
                        {question}
                      </button>
                    ))}
                    <button
                      className="quick-reply-button"
                      style={{ backgroundColor: '#666' }}
                      onClick={() => addMessage('bot', 'Please type your question below.')}
                    >
                      No, something else
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'knowledge' && (
              <div>
                <h3>User Documentation</h3>
                <p>Here you can browse FAQs and guides.</p>
                <ul>
                  <li>How to use the ChargeMe chatbot</li>
                  <li>Common rental questions</li>
                  <li>Support & troubleshooting</li>
                </ul>
              </div>
            )}

            {activeTab === 'support' && (
              <>
                <h3>Contact Customer Support</h3>
                <p>
                  You can reach out via in-app live chat, email at{' '}
                  <a href="mailto:support@technoiot.com">support@technoiot.com</a>, or call +91-XXXXXXXXXX.
                </p>
                <SupportForm />
              </>
            )}
          </div>

          {activeTab === 'chat' && (
            <div className="input-container">
              <input
                type="text"
                aria-label="Type your message"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                className="input-field"
              />
              <button
                onClick={handleSend}
                aria-label="Send message"
                className="send-button"
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </div>
          )}

          <nav className="nav-container" role="tablist" aria-label="Chatbot navigation">
            {['home', 'chat', 'knowledge', 'support'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'chat') setQuickReplies(getRandomFaqs(3));
                }}
                className={`nav-button ${activeTab === tab ? 'active' : ''}`}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`tabpanel-${tab}`}
                id={`tab-${tab}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Chatbot;