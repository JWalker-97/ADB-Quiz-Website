document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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

    // Array of questions
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
        // Additional placeholder questions to make a total of 50 questions
        ...Array.from({ length: 48 }, (_, i) => ({
            question: `Placeholder question ${i + 3}`,
            answers: [
                { text: "Option 1", correct: i % 2 === 0 },
                { text: "Option 2", correct: i % 2 !== 0 },
                { text: "Option 3", correct: false },
                { text: "Option 4", correct: false }
            ]
        }))
    ];

    // Start the quiz
    startQuiz();

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        incorrect = 0;
        nextButton.classList.add('hide');
        updateProgress();
        showQuestion();
    }

    // Display the current question
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

    // Reset the state for the next question
    function resetState() {
        nextButton.classList.add('hide');
        resultContainer.innerText = '';
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }

    // Handle the answer selection
    function selectAnswer(button, correct) {
        Array.from(answerButtons.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.add(correct ? 'correct' : 'wrong');
        });

        if (correct) {
            score++;
            resultContainer.innerText = 'Correct!';
        } else {
            incorrect++;
            resultContainer.innerText = 'Incorrect. Try again.';
        }

        nextButton.classList.remove('hide');
    }

    // Move to the next question when "Next" is clicked
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

        progressCorrect.style.width = `${correctPercentage}%`;
        progressWrong.style.width = `${wrongPercentage}%`;
    }

    // Display the final result after all questions are answered
    function showFinalResult() {
        resultContainer.innerText = `Quiz complete! You got ${score} correct out of ${totalQuestions}.`;
        nextButton.classList.add('hide');
    }
});