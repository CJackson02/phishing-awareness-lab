// Score tracking
const scoreState = {
  correctReports: 0,
  incorrectReports: 0,
  phishingClicks: 0,
  legitClicks: 0
};

// Section navigation handler
function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.add('hidden'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
    target.scrollIntoView({ behavior: 'smooth' });

    // Highlight progress tracker
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const step = document.getElementById(`step-${sectionId}`);
    if (step) step.classList.add('active');

    // Load inbox if navigating there
    if (sectionId === 'inbox') {
      loadInbox();
    }
  }
}

// Email scenarios (6 total, 2 phishing)
const emailPool = [
  {
    id: 1,
    sender: "Registrar <registrar@ualr.edu>",
    subject: "Spring 2025 Final Grades Posted",
    message: "Dear Student,<br/><br/>Your final grades for Spring 2025 are now available. Visit your student portal to review them.<br/><br/>Regards,<br/>UALR Registrar’s Office",
    phishing: false
  },
  {
    id: 2,
    sender: "Library Services <library@ualr.edu>",
    subject: "Overdue Book Reminder",
    message: "Hi,<br/><br/>This is a friendly reminder that one or more of your borrowed items are overdue. Please return them to the main campus library or renew online.<br/><br/>UALR Library Staff",
    phishing: false
  },
  {
    id: 3,
    sender: "IT Announcements <it-announce@ualr.edu>",
    subject: "Scheduled Maintenance Tonight",
    message: "Our systems will undergo maintenance tonight from 12:00 AM to 4:00 AM. Expect brief outages during this window.<br/><br/>- UALR IT Department",
    phishing: false
  },
  {
    id: 4,
    sender: "UALR IT Support <support@ualr-helpdesk.com>",
    subject: "Account Compromised - Reset Password Now",
    message: `We've detected a suspicious login attempt on your account. To protect your data, we require you to reset your password.<br/><br/>
              <button class="phish-action">Reset My Password</button>`,
    phishing: true
  },
  {
    id: 5,
    sender: "Human Resources <hr@ualr-hrmail.com>",
    subject: "Update Required: Annual Benefits Enrollment",
    message: `Our records indicate you haven't completed your benefits enrollment. Please complete your form by the end of the day.<br/><br/>
              <a href="http://benefits.ualr-hrmail.com" title="https://ualr.edu/benefits">Complete Enrollment</a><br/><br/>
              - HR Team`,
    phishing: true
  },
  {
    id: 6,
    sender: "Campus Dining <dining@ualr.edu>",
    subject: "New Vegan Options at Trojan Café!",
    message: "Check out our new plant-based options this semester at Trojan Café. Your health matters.<br/><br/>- UALR Dining Services",
    phishing: false
  }
];

// Render inbox view
function loadInbox() {
  const list = document.getElementById('emailList');
  list.innerHTML = '';

  emailPool.forEach(email => {
    const item = document.createElement('div');
    item.className = 'email-item';
    item.innerHTML = `<strong>${email.sender}</strong><br/><span>${email.subject}</span>`;
    item.addEventListener('click', () => showPreview(email));
    list.appendChild(item);
  });

  const preview = document.getElementById('emailPreview');
  preview.innerHTML = `<p>Select an email to view its content.</p>`;
}

// Show full email
function showPreview(email) {
  const preview = document.getElementById('emailPreview');
  preview.innerHTML = `
    <h4>From: ${email.sender}</h4>
    <h5>Subject: ${email.subject}</h5>
    <div class="email-body">${email.message}</div>
    <div class="preview-actions">
      <button onclick="handleReport(${email.phishing})">Report as Phishing</button>
      <button onclick="handleInteraction(${email.phishing})">Interact with Email</button>
    </div>
  `;
}

// "Report as Phishing" logic
function handleReport(isPhishing) {
  const preview = document.getElementById('emailPreview');
  if (isPhishing) {
    scoreState.correctReports++;
    preview.innerHTML += `
      <div class="result success">
        ✅ Correct! This was a phishing attempt. You reported it.
        <br/><br/><button onclick="navigateTo('quiz')">Continue to Quiz</button>
      </div>
    `;
  } else {
    scoreState.incorrectReports++;
    preview.innerHTML += `
      <div class="result error">
        ⚠️ This was a legitimate email. Be careful not to misreport emails.
        <br/><br/><button onclick="navigateTo('quiz')">Continue to Quiz</button>
      </div>
    `;
  }
}

// "Interact with Email" logic
function handleInteraction(isPhishing) {
  const preview = document.getElementById('emailPreview');
  if (isPhishing) {
    scoreState.phishingClicks++;
    preview.innerHTML += `
      <div class="result error">
        🚨 You interacted with a phishing email! Credentials could have been stolen.
        <br/><br/><strong>Red Flags:</strong>
        <ul>
          <li>Unusual sender domain (e.g. ualr-helpdesk.com or ualr-hrmail.com)</li>
          <li>Urgent tone requesting immediate action</li>
          <li>Fake button or misleading link</li>
        </ul>
        <br/><button onclick="navigateTo('quiz')">Review & Take Quiz</button>
      </div>
    `;
  } else {
    scoreState.legitClicks++;
    preview.innerHTML += `
      <div class="result success">
        ✅ This was a legitimate email. No phishing detected.
        <br/><br/><button onclick="navigateTo('quiz')">Continue to Quiz</button>
      </div>
    `;
  }
}

// Quiz grading + summary display
document.getElementById('quizForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const answers = {
    q1: 'b',
    q2: 'b',
    q3: 'b',
    q4: 'b',
    q5: 'a',
    q6: 'b',
    q7: 'b',
    q8: 'c',
    q9: 'b',
    q10: 'b'
  };


  let score = 0;
  let total = Object.keys(answers).length;

  Object.keys(answers).forEach(q => {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    if (selected && selected.value === answers[q]) {
      score++;
    }
  });

  const result = document.getElementById('quizResult');
  result.classList.remove('hidden');

  result.innerHTML = `
    <strong>You scored ${score} out of ${total} on the quiz.</strong><br/><br/>
    <h4>Phishing Detection Summary:</h4>
    <ul>
      <li> Correctly Reported: ${scoreState.correctReports}</li>
      <li>Incorrectly Reported Legit Emails: ${scoreState.incorrectReports}</li>
      <li>Clicked on Phishing Emails: ${scoreState.phishingClicks}</li>
      <li>Clicked on Legitimate Emails: ${scoreState.legitClicks}</li>
    </ul>
    <br/><button onclick="resetSimulation()">Start Over</button>
  `;
});

// Reset function
function resetSimulation() {
  scoreState.correctReports = 0;
  scoreState.incorrectReports = 0;
  scoreState.phishingClicks = 0;
  scoreState.legitClicks = 0;
  navigateTo('inbox');
}
