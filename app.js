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
const scoreElement = document.getElementById('score');
const feedbackElement = document.getElementById('feedback');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

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
  const topicCode = getTopicForQuestion(currentQuestionIndex);
  const topicName = currentQuestion.topic;
  topicHeadingElement.innerText = `${topicCode}: ${topicName}`;

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

  // Mark selected button
  selectedButton.classList.add('selected');

  if (correct) {
    score++;
  }
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === 'true');
    button.disabled = true;
  });
  nextButton.classList.remove('hide');
}

// Show Result
function showResult() {
  questionContainerElement.classList.add('hide');
  resultContainer.classList.remove('hide');
  scoreElement.innerText = `You scored ${score} out of ${questions.length}!`;

  const percentage = (score / questions.length) * 100;
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
  scoreElement.style.color = color;
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

function updateProgressBar() {
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  progressBarFill.style.width = `${progressPercentage}%`;
}

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