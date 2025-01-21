import React, { useState } from 'react';
import './FAQ.css';

const faqData = [
  
  {
    question: 'Can I get a refund?',
    answer: 'Due to the nature of digital products, all sales are final. However, if you have any issues, please contact our support.'
  }
];

const ChevronIcon = ({ open }) => (
  <svg
    className={`faq-toggle${open ? ' open' : ''}`}
    width="22"
    height="22"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqData.map((item, idx) => (
          <div className={`faq-item${openIndex === idx ? ' open' : ''}`} key={idx}>
            <button className="faq-question" onClick={() => toggleFAQ(idx)}>
              {item.question}
              <ChevronIcon open={openIndex === idx} />
            </button>
            {openIndex === idx && (
              <div className="faq-answer">{item.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ; 