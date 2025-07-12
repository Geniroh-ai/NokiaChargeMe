import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css'; // Assuming you have a CSS file for styles
import './App.css'; // Import global styles if needed
import bannerImage from './chargemebanner.png';
import botimage from './bot-icon.png';
import userimage from './user-icon.png';

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

const AccordionFaq = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion-container">
      {faqs.map((faq, index) => (
        <div key={index} className="accordion-item">
          <div
            className="accordion-header"
            onClick={() => toggleIndex(index)}
            role="button"
            tabIndex={0}
            aria-expanded={openIndex === index}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') toggleIndex(index);
            }}
          >
            <span className="accordion-question">{faq.question}</span>
            <span className="accordion-icon">{openIndex === index ? '–' : '+'}</span>
          </div>
          {openIndex === index && (
            <div className="accordion-body">
              {faq.answer.split('\n').map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [quickReplies, setQuickReplies] = useState(getRandomFaqs(3));
  const [showFeedbackForIndex, setShowFeedbackForIndex] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(null);

  const scrollRef = useRef(null);

  const toggleChat = () => setIsOpen((open) => !open);

  const addMessage = (sender, text) => {
    setChatHistory((prev) => [...prev, { sender, text }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Scroll to top on tab change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

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

const handleSend = async () => {
  if (!chatInput.trim()) return;

  const userQuestion = chatInput;
  addMessage('user', userQuestion);
  setChatInput('');

  // 🔗 Call LangChain backend
  try {
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: userQuestion }),
    });

    const data = await res.json();
    addMessage('bot', data.response || "Sorry, I couldn't understand that.");
  } catch (error) {
    console.error('LLM fetch error:', error);
    addMessage('bot', "Hmm… I couldn’t reach the assistant. Please try again.");
  }

  setQuickReplies(getRandomFaqs(3));
};

  const handleQuickReplyClick = (question) => {
  setChatInput(question);
  handleSend(); // Triggers the same logic
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

  const handleEndChat = (index) => {
    setShowFeedbackForIndex(index);
  };

  const submitFeedback = async (rating, messageIndex) => {
    setFeedbackRating(rating);
    setShowFeedbackForIndex(null);

    // 🔗 Save rating to backend → store in ChromaDB
    try {
      await fetch('http://localhost:8000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          query: chatHistory[messageIndex - 1]?.text || '',
          response: chatHistory[messageIndex]?.text || '',
        }),
      });
      console.log("✅ Feedback submitted.");
    } catch (err) {
      console.error("❌ Feedback submission failed", err);
    }
    addMessage('bot', "Thanks for your feedback! The conversation has been closed. You can start a new one anytime.");
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
                <img 
                  src={bannerImage} 
                  alt="ChargeMe Banner" 
                  style={{ width: '100%', height: 'auto', marginBottom: '20px', borderRadius: '8px' }}
                />
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
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: 10,
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <img
                        src={botimage}
                        alt="Bot"
                        style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }}
                      />
                    )}

                    <div className={`chat-bubble-message ${msg.sender}`}>
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {line}
                        </p>
                      ))}

                      {msg.sender === 'bot' && (
                        <>
                          <button
                            className="end-chat-button"
                            onClick={() => handleEndChat(i)}
                            style={{
                              marginTop: '8px',
                              background: '#eee',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                            }}
                          >
                            End conversation
                          </button>

                          {showFeedbackForIndex === i && (
                            <div style={{ marginTop: '8px' }}>
                              <p style={{ marginBottom: '4px' }}>Rate this response:</p>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    cursor: 'pointer',
                                    color: feedbackRating >= star ? 'gold' : '#ccc',
                                    fontSize: '20px',
                                  }}
                                  onClick={() => submitFeedback(star, i)}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <img
                        src={userimage}
                        alt="You"
                        style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 8 }}
                      />
                    )}
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
                <h3>User Documentation & FAQs</h3>
                <AccordionFaq faqs={faqQA} />
              </div>
            )}

            {activeTab === 'support' && (
              <>
                <h3>Contact Customer Support</h3>
                <p>
                  You can reach out via in-app live chat, email at{' '}
                  <a href="mailto:support@technoiot.com">support@technoiot.com</a>, or call +351-XXXXXXXXXX.
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