// app.js

let allQuestions = [];
let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const startPage = document.getElementById('start-page');
const startButton = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const progressText = document.getElementById('progress-text');
const resultPage = document.getElementById('result-page');
const scorePercentage = document.getElementById('score-percentage');
const retryButton = document.getElementById('retry-btn');

// Event Listeners
startButton.addEventListener('click', startQuiz);
retryButton.addEventListener('click', retryQuiz);

// Fetch Questions from JSON
async function loadQuestions() {
  try {
    const response = await fetch('questions.json');
    const data = await response.json();
    // Extract 10 random questions from each section
    const sections = ['B1', 'B2', 'B3', 'B4', 'B5'];
    sections.forEach((section) => {
      const sectionQuestions = data[section];
      const shuffledSectionQuestions = shuffleArray(sectionQuestions);
      const selectedQuestions = shuffledSectionQuestions.slice(0, 10);
      allQuestions = allQuestions.concat(selectedQuestions);
    });
    // Shuffle all selected questions
    shuffledQuestions = shuffleArray(allQuestions);
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}

// Start Quiz
async function startQuiz() {
  await loadQuestions();
  startPage.classList.add('hide');
  quizContainer.classList.remove('hide');
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

// Show Question
function showQuestion() {
  resetState();
  showProgress();
  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  questionElement.innerText = currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn', 'answer-btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// Reset State
function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Show Progress
function showProgress() {
  progressText.innerText = `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`;
}

// Select Answer
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  if (correct) {
    score++;
  }
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === 'true');
    button.disabled = true;
  });
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

// Set Status Class
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add('correct');
  } else {
    element.classList.add('wrong');
  }
}

// Clear Status Class
function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

// Show Result
function showResult() {
  quizContainer.classList.add('hide');
  resultPage.classList.remove('hide');
  const percentageScore = Math.round((score / shuffledQuestions.length) * 100);
  scorePercentage.innerText = `${percentageScore}%`;
}

// Retry Quiz
function retryQuiz() {
  resultPage.classList.add('hide');
  startPage.classList.remove('hide');
  // Reset quiz state
  allQuestions = [];
  shuffledQuestions = [];
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}