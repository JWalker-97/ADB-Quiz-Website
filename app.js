const questionContainer = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');
const progressCorrect = document.getElementById('progress-correct');
const progressWrong = document.getElementById('progress-wrong');

let currentQuestionIndex = 0;
let score = 0;
let incorrect = 0;
const totalQuestions = 50;

// Sample set of 50 questions (replace with actual questions)
const questions = Array.from({ length: totalQuestions }, (v, i) => ({
    question: `Question ${i + 1}: What is the width of escape routes?`,
    answers: [
        { text: "1.0 meter", correct: i % 2 === 0 },  // Alternate correct answers for example purposes
        { text: "0.8 meters", correct: false },
        { text: "1.5 meters", correct: i % 2 !== 0 },
        { text: "2.0 meters", correct: false }
    ]
}));

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