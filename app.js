// app.js

// DOM Elements
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const startPage = document.getElementById('start-page');
const questionContainerElement = document.getElementById('question-container');
const topicHeadingElement = document.getElementById('topic-heading');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const progressBarFill = document.getElementById('progress-bar-fill');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');

// Variables
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Event Listeners
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

    // Sections B1 to B5
    const sections = ['B1', 'B2', 'B3', 'B4', 'B5'];
    sections.forEach((section) => {
      let sectionQuestions = data[section];
      sectionQuestions = shuffleArray(sectionQuestions).slice(0, 10);
      questions = questions.concat(sectionQuestions);
    });

    // No need to shuffle the entire questions array since we want to maintain the order
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
  questionContainerElement.classList.remove('hide');
  resultContainer.classList.add('hide');
  showQuestion();
  updateProgressBar();
}

// Show Question
function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];

  // Update topic heading based on current question index
  const topic = getTopicForQuestion(currentQuestionIndex);
  topicHeadingElement.innerText = `Topic: ${topic} - ${currentQuestion.topic}`;

  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
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
  if (correct) {
    score++;
  }
  setStatusClass(selectedButton, correct);
  Array.from(answerButtonsElement.children).forEach((button) => {
    button.disabled = true;
    setStatusClass(button, button.dataset.correct === 'true');
  });
  nextButton.classList.remove('hide');
}

// Show Result
function showResult() {
  questionContainerElement.classList.add('hide');
  resultContainer.classList.remove('hide');
  scoreElement.innerText = `You scored ${score} out of ${questions.length}!`;
}

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

// Update Progress Bar
function updateProgressBar() {
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;
}

// Get Topic for Current Question Index
function getTopicForQuestion(index) {
  if (index < 10) {
    return 'B1';
  } else if (index < 20) {
    return 'B2';
  } else if (index < 30) {
    return 'B3';
  } else if (index < 40) {
    return 'B4';
  } else {
    return 'B5';
  }
}