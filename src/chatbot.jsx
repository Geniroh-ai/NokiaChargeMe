import React, { useState, useEffect, useRef } from 'react';

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

const styles = {
  bubble: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    color: 'white',
    border: 'none',
    fontSize: 28,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,176,155,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    userSelect: 'none',
  },
  chatWindow: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    width: 440, // widened as per your request
    height: 540,
    borderRadius: 24,
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    background: 'linear-gradient(135deg, #f7fdf9, #eafaf1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
    userSelect: 'none',
  },
  header: {
    padding: '16px 24px',
    background: 'linear-gradient(90deg, #00b09b 0%, #96c93d 100%)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    userSelect: 'none',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 26,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    userSelect: 'none',
  },
  navContainer: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    backgroundColor: '#f9f9f9',
    padding: '10px 0',
    justifyContent: 'space-around',
  },
  navButton: (active) => ({
    flex: 1,
    margin: '0 10px',
    padding: 14,
    border: 'none',
    backgroundColor: active ? '#96c93d' : 'transparent',
    color: active ? '#fff' : '#555',
    cursor: 'pointer',
    fontWeight: active ? '700' : '600',
    fontSize: 16,
    borderRadius: 12,
    userSelect: 'none',
    transition: 'all 0.3s ease',
  }),
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 28px',
    scrollbarWidth: 'thin',
    scrollbarColor: '#96c93d transparent',
    backgroundColor: 'transparent'
  },
  chatBubble: (isUser) => ({
    display: 'inline-block',
    padding: '14px 20px',
    borderRadius: 28,
    background: isUser
        ? 'linear-gradient(135deg, rgba(162, 233, 199, 0.9), rgba(0, 176, 155, 0.9))'
        : 'rgba(255, 255, 255, 0.9)',
    color: isUser ? '#004d40' : '#333',
    maxWidth: '75%',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    marginBottom: 14,
    userSelect: 'text',
  }),
  inputContainer: {
    padding: 16,
    borderTop: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f7f3',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    borderRadius: 24,
    border: '1.5px solid #96c93d',
    fontSize: 16,
    outline: 'none',
    transition: 'box-shadow 0.3s ease',
  },
  sendButton: {
    marginLeft: 12,
    background: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 24,
    padding: '14px 24px',
    fontWeight: '700',
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(150,201,61,0.5)',
    userSelect: 'none',
  },
  quickRepliesContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    padding: '8px 20px',
    backgroundColor: '#e2f5e9',
    borderRadius: 20,
    marginTop: 10,
  },
  quickReplyButton: {
    background: '#96c93d',
    color: 'white',
    border: 'none',
    borderRadius: 18,
    padding: '8px 14px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 14,
    userSelect: 'none',
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
  },
  supportForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    padding: '0 28px 28px 28px',
  },
  inputField: {
    padding: 12,
    borderRadius: 8,
    border: '1.5px solid #ccc',
    fontSize: 15,
    outline: 'none',
  },
  textareaField: {
    minHeight: 100,
  },
  statusText: {
    color: '#2e7d32',
    fontWeight: '600',
    textAlign: 'center',
  },
  homeContent: {
    color: '#2e3a59',
  },
};

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
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your email sending API integration here
    setStatus('Support request sent! We will get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={styles.supportForm}>
      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
        style={styles.inputField}
        aria-label="Your Name"
      />
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
        style={styles.inputField}
        aria-label="Your Email"
      />
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Describe your issue"
        required
        style={{ ...styles.inputField, ...styles.textareaField }}
        aria-label="Describe your issue"
      />
      <button type="submit" style={styles.sendButton}>
        Send Request
      </button>
      {status && <p style={styles.statusText}>{status}</p>}
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
    // Update quick replies to related questions for smooth flow
    setQuickReplies(getRelatedQuickReplies(faq.question));
  } else {
    addMessage('bot', "Sorry, I didn't quite get that. Could you please rephrase?");
    // Show random quick replies if no match
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
    // Refresh quick replies with new random 3 questions except the one clicked
    const remaining = faqQA.filter((f) => f.question !== question);
    setQuickReplies(getRandomFaqsFromArray(3, remaining));
  };

  // Helper: pick random faqs from provided array
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
          style={styles.bubble}
          onClick={toggleChat}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Open chatbot"
        >
          ⚡
        </button>
      )}

      {isOpen && (
        <div style={styles.chatWindow} aria-modal="true" role="dialog" aria-label="ChargeMe chatbot window">
          {/* Header */}
          <div style={styles.header}>
            ChargeMe Support
            <button
              style={styles.closeButton}
              onClick={toggleChat}
              aria-label="Close chatbot"
              title="Close chatbot"
            >
              ×
            </button>
          </div>

          {/* Content Area */}
          <div style={styles.scrollArea} ref={scrollRef}>
            {activeTab === 'home' && (
              <div style={styles.homeContent}>
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
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: 10,
                    }}
                  >
                    <div style={styles.chatBubble(msg.sender === 'user')}>
                      {msg.text.split('\n').map((line, idx) => (
                        <p key={idx} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Quick Replies */}
                {quickReplies.length > 0 && (
                  <div style={styles.quickRepliesContainer} aria-label="Suggested questions">
                    {quickReplies.map(({ question }) => (
                      <button
                        key={question}
                        style={styles.quickReplyButton}
                        onClick={() => handleQuickReplyClick(question)}
                        aria-label={`Ask: ${question}`}
                      >
                        {question}
                      </button>
                    ))}
                    <button
                      style={{ ...styles.quickReplyButton, backgroundColor: '#666' }}
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
                  You can reach out via in-app live chat, email at <a href="mailto:support@technoiot.com">support@technoiot.com</a>, or call +91-XXXXXXXXXX.
                </p>
                <SupportForm />
              </>
            )}
          </div>

          {/* Input & Send (only for Chat tab) */}
          {activeTab === 'chat' && (
            <div style={styles.inputContainer}>
              <input
                type="text"
                aria-label="Type your message"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                style={styles.input}
              />
              <button
                onClick={handleSend}
                aria-label="Send message"
                style={styles.sendButton}
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </div>
          )}

          {/* Bottom Navigation */}
          <nav style={styles.navContainer} role="tablist" aria-label="Chatbot navigation">
            {['home', 'chat', 'knowledge', 'support'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'chat') setQuickReplies(getRandomFaqs(3)); // refresh quick replies on chat tab open
                }}
                style={styles.navButton(activeTab === tab)}
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
}

export default Chatbot;