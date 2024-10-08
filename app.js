// app.js

// DOM Elements
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const startPage = document.getElementById('start-page');
const questionContainerElement = document.getElementById('question-container');
const questionHeaderElement = document.getElementById('question-header');
const topicHeadingElement = document.getElementById('topic-heading');
const questionNumberElement = document.getElementById('question-number');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const progressBarFill = document.getElementById('progress-bar-fill');
const resultContainer = document.getElementById('result-container');
const percentageScoreElement = document.getElementById('percentage-score');
const feedbackElement = document.getElementById('feedback');

// Tab Elements
const tabScores = {
  B1: document.getElementById('B1-score'),
  B2: document.getElementById('B2-score'),
  B3: document.getElementById('B3-score'),
  B4: document.getElementById('B4-score'),
  B5: document.getElementById('B5-score'),
};
const tabFeedbacks = {
  B1: document.getElementById('B1-feedback'),
  B2: document.getElementById('B2-feedback'),
  B3: document.getElementById('B3-feedback'),
  B4: document.getElementById('B4-feedback'),
  B5: document.getElementById('B5-feedback'),
};

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let sectionScores = {
  B1: 0,
  B2: 0,
  B3: 0,
  B4: 0,
  B5: 0,
};
let sectionColors = {}; // Stores the color for each section based on score

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});
restartButton.addEventListener('click', restartGame);

// Fetch Questions from JSON File
async function fetchQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();

    questions = [];

    // Collect all questions and assign unique IDs
    let allQuestions = [];
    let questionId = 0;

    // Sections B1 to B5
    const sections = ['B1', 'B2', 'B3', 'B4', 'B5'];
    sections.forEach((section) => {
      data[section].forEach((question) => {
        question.section = section;
        question.id = questionId++;
        allQuestions.push(question);
      });
    });

    // Ensure uniqueness by shuffling all questions and selecting unique ones
    const selectedAnswers = new Set();
    allQuestions = shuffleArray(allQuestions);

    // Select 10 unique questions per section without duplicates
    sections.forEach((section) => {
      const sectionQuestions = allQuestions.filter((q) => q.section === section);
      const selectedSectionQuestions = [];

      for (const question of sectionQuestions) {
        // Check if a question with the same answer already exists
        const answerTexts = question.answers.map((a) => a.text);
        const isDuplicateAnswer = answerTexts.some((text) => selectedAnswers.has(text));

        if (!isDuplicateAnswer && selectedSectionQuestions.length < 10) {
          selectedSectionQuestions.push(question);
          answerTexts.forEach((text) => selectedAnswers.add(text));
        }

        if (selectedSectionQuestions.length === 10) break;
      }

      questions = questions.concat(selectedSectionQuestions);
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Start the Game
async function startGame() {
  startPage.classList.add('hide');
  await fetchQuestions();
  currentQuestionIndex = 0;
  score = 0;
  sectionScores = {
    B1: 0,
    B2: 0,
    B3: 0,
    B4: 0,
    B5: 0,
  };
  sectionColors = {}; // Reset section colors
  questionContainerElement.classList.remove('hide');
  resultContainer.classList.add('hide');
  showQuestion();
  updateProgressBar();
}

// Show Question
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];

  // Update topic heading
  const topicName = currentQuestion.topic;
  topicHeadingElement.innerText = topicName;

  // Update question number
  questionNumberElement.innerText = `Q${currentQuestionIndex + 1}`;

  questionElement.innerText = currentQuestion.question;

  // Shuffle answer options
  const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

  shuffledAnswers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    button.setAttribute('role', 'button');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
  updateProgressBar();
}

// Reset State
function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Select Answer
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  const currentQuestion = questions[currentQuestionIndex];

  // Remove 'selected' class from any other buttons
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.classList.remove('selected');
  });

  // Mark selected button
  selectedButton.classList.add('selected');

  if (correct) {
    score++;
    sectionScores[currentQuestion.section]++;
    // Only change the selected button to correct
    setStatusClass(selectedButton, true);
  } else {
    // Mark question as incorrectly answered
    currentQuestion.userAnswerIncorrect = true;

    // Change the selected button to wrong
    setStatusClass(selectedButton, false);
    // Highlight the correct answer
    const correctButton = Array.from(answerButtonsElement.children).find(
      (button) => button.dataset.correct === 'true'
    );
    setStatusClass(correctButton, true);
  }

  // Disable all buttons
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.disabled = true;
  });

  nextButton.classList.remove('hide');
}

// Show Result
function showResult() {
  questionContainerElement.classList.add('hide');
  resultContainer.classList.remove('hide');

  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  percentageScoreElement.innerText = `${percentage}%`;

  // Set total score
  const totalScoreElement = document.getElementById('total-score');
  totalScoreElement.innerText = `Total: ${score} / ${totalQuestions}`;

  // Set feedback based on overall percentage
  let feedback = '';
  let color = '';

  if (percentage >= 80) {
    feedback = 'Excellent work! You have a strong understanding of the material.';
    color = '#28a745'; // Green
  } else if (percentage >= 60) {
    feedback = 'Good effort! Review the material to improve your understanding.';
    color = '#ffc107'; // Amber
  } else {
    feedback = 'You may need to focus more on these areas. Consider revisiting the material.';
    color = '#dc3545'; // Red
  }

  feedbackElement.innerText = feedback;
  percentageScoreElement.style.color = color;

  // Update section scores and tabs
  updateSectionScores();

  // Open the first tab by default
  const firstTab = document.querySelector('.tablinks');
  if (firstTab) {
    firstTab.click();
  }
}

// Update Section Scores and Tabs
function updateSectionScores() {
  const sections = ['B1', 'B2', 'B3', 'B4', 'B5'];
  sections.forEach((section) => {
    const score = sectionScores[section];
    const percentage = Math.round((score / 10) * 100);
    const tabScoreElement = tabScores[section];
    tabScoreElement.innerText = `${score}/10`;

    // Set tab color based on percentage
    const tabButton = tabScoreElement.parentElement;
    let color = '';

    if (percentage >= 80) {
      color = '#28a745'; // Green
    } else if (percentage >= 60) {
      color = '#ffc107'; // Amber
    } else {
      color = '#dc3545'; // Red
    }

    sectionColors[section] = color; // Store color for each section

    tabButton.style.backgroundColor = color;

    // Generate feedback for each section
    const feedbacks = generateFeedbackForSection(section);
    const feedbackElement = tabFeedbacks[section];
    feedbackElement.innerHTML = feedbacks.join('<br>');
  });
}

// Generate Feedback for a Section
function generateFeedbackForSection(section) {
  const weakAreas = new Set(); // Use a Set to avoid duplicates
  const sectionQuestions = questions.filter((q) => q.section === section);
  sectionQuestions.forEach((question) => {
    if (question.userAnswerIncorrect && weakAreas.size < 3) {
      const adbSection = topicToADBSection[question.topic] || question.topic;
      weakAreas.add(`- Review ${adbSection}`);
    }
  });

  if (weakAreas.size === 0) {
    return ['Great job! You did well in this section.'];
  } else {
    return Array.from(weakAreas);
  }
}

// Map topics to ADB sections
const topicToADBSection = {
  // B1 Topics
  'Fire detection and alarm systems': 'Section 1: Fire detection and alarm systems',
  'Design for horizontal escape': 'Section 2: Design for horizontal escape',
  'Design for vertical escape': 'Section 3: Design for vertical escape',
  // B2 Topics
  'Internal fire spread (linings)': 'Section 4: Internal fire spread (linings)',
  // B3 Topics
  'Internal fire spread (structure)': 'Section 5: Internal fire spread (structure)',
  // B4 Topics
  'External fire spread': 'Section 6: External fire spread',
  // B5 Topics
  'Access and facilities for the fire service': 'Section 7: Access and facilities for the fire service',
  // Add other topics as necessary
};

// Restart Game
function restartGame() {
  resultContainer.classList.add('hide');
  startPage.classList.remove('hide');
}

// Utility Functions
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function updateProgressBar() {
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;
}

// Tab Functionality
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName('tabcontent');
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].classList.remove('active');
  }
  const tablinks = document.getElementsByClassName('tablinks');
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove('active');
    // Reset tab background color
    const section = tablinks[i].innerText.split('\n')[0];
    tablinks[i].style.backgroundColor = sectionColors[section];
  }
  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.classList.add('active');

  // Set the box-shadow color of #tabs-and-summary to the section color
  const tabsAndSummary = document.getElementById('tabs-and-summary');
  const color = sectionColors[tabName];
  tabsAndSummary.style.boxShadow = `0 0 10px ${color}`;

  // Set active tab background to match summary box
  evt.currentTarget.style.backgroundColor = '#2e2e2e';
}