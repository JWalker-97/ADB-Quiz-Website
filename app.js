const questionContainer = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const resultContainer = document.getElementById('result');

let currentQuestionIndex = 0;
let score = 0;

// Sample questions related to Approved Document B (Volume 2)
const questions = [
    {
        question: "What is the minimum width of escape routes in a public building?",
        answers: [
            { text: "1.0 meter", correct: true },
            { text: "0.8 meters", correct: false },
            { text: "1.5 meters", correct: false },
            { text: "2.0 meters", correct: false }
        ]
    },
    {
        question: "What is the maximum travel distance in an escape route in a building?",
        answers: [
            { text: "18 meters", correct: false },
            { text: "15 meters", correct: true },
            { text: "20 meters", correct: false },
            { text: "12 meters", correct: false }
        ]
    },
    // Add more questions as needed
];

// Start quiz
startQuiz();

function startQuiz() {
    currentQuestionIndex = 0;
    nextButton.classList.add('hide');
    showQuestion();
}

// Display the next question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.innerText = currentQuestion.question;

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
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Handle answer selection
function selectAnswer(button, correct) {
    if (correct) {
        button.classList.add('correct');
        score++;
        resultContainer.innerText = `Correct! Your current score is: ${score}`;
    } else {
        button.classList.add('wrong');
        resultContainer.innerText = `Incorrect. Try again.`;
    }
    Array.from(answerButtons.children).forEach(button => {
        button.disabled = true;
    });
    nextButton.classList.remove('hide');
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

function showFinalResult() {
    resultContainer.innerText = `Quiz complete! Your final score is: ${score}`;
    nextButton.classList.add('hide');
}