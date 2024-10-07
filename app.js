const questionContainer = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const progressCorrect = document.getElementById('progress-correct');
const progressWrong = document.getElementById('progress-wrong');

let currentQuestionIndex = 0;
let score = 0;
let incorrect = 0;
const totalQuestions = 50; // Total number of questions in the quiz

// Array of 50 questions related to Approved Document B (Volume 2)
const questions = [
    {
        question: "What is the minimum width of an escape route in a public building?",
        answers: [
            { text: "1.0 meter", correct: true },
            { text: "0.8 meters", correct: false },
            { text: "1.5 meters", correct: false },
            { text: "2.0 meters", correct: false }
        ]
    },
    {
        question: "What is the maximum travel distance to a protected stairway in a single direction?",
        answers: [
            { text: "9 meters", correct: true },
            { text: "18 meters", correct: false },
            { text: "25 meters", correct: false },
            { text: "15 meters", correct: false }
        ]
    },
    // Add more questions here following this format
];

// Add additional questions here to reach 50 questions
for (let i = 2; i < 50; i++) {
    questions.push({
        question: `Question ${i + 1}: What is the requirement related to fire safety for section ${i}?`,
        answers: [
            { text: `Answer ${i}.1`, correct: true },
            { text: `Answer ${i}.2`, correct: false },
            { text: `Answer ${i}.3`, correct: false },
            { text: `Answer ${i}.4`, correct: false }
        ]
    });
}

// Start quiz
startQuiz();

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    incorrect = 0;
    nextButton.classList.add('hide');
    updateProgress();
    showQuestion();
}

// Display the next question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    
    // Display the question
    questionContainer.innerText = currentQuestion.question;

    // Generate buttons for each answer
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(button, answer.correct));
        answerButtons.appendChild(button);
    });
}

// Reset the quiz state (remove old buttons, etc.)
function resetState() {
    nextButton.classList.add('hide');
    resultContainer.innerText = '';
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);  // Clear any existing answer buttons
    }
}

// Handle answer selection
function selectAnswer(button, correct) {
    Array.from(answerButtons.children).forEach(btn => {
        btn.disabled = true;  // Disable all buttons after answering
        if (correct && btn === button) {
            btn.classList.add('correct');  // Highlight the correct answer
            score++;
            resultContainer.innerText = `Correct!`;
        } else if (!correct && btn === button) {
            btn.classList.add('wrong');  // Highlight the wrong answer
            resultContainer.innerText = `Incorrect. Try again.`;
            incorrect++;
        }
    });
    
    nextButton.classList.remove('hide');  // Show next button after selection
}

// Move to the next question
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showFinalResult();
    }
    updateProgress();
});

// Update the progress bar
function updateProgress() {
    const correctPercentage = (score / totalQuestions) * 100;
    const wrongPercentage = (incorrect / totalQuestions) * 100;

    progressCorrect.style.width = correctPercentage + "%";
    progressWrong.style.width = wrongPercentage + "%";
}

// Show final result after the quiz
function showFinalResult() {
    resultContainer.innerText = `Quiz complete! You got ${score} correct out of ${totalQuestions}.`;
    nextButton.classList.add('hide');
}