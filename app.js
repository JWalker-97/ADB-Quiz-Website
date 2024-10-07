document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const quizSection = document.getElementById('quiz-section');
    const questionContainer = document.getElementById('question');
    const answerButtons = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result');
    const progressSquares = document.getElementById('progress-squares');

    let currentQuestionIndex = 0;
    let score = 0;
    let totalQuestions = 50;

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
            question: "What is the maximum travel distance for a single direction escape?",
            answers: [
                { text: "9 meters", correct: true },
                { text: "18 meters", correct: false },
                { text: "15 meters", correct: false },
                { text: "25 meters", correct: false }
            ]
        },
        // Add more questions here
    ];

    // Initialize 50 progress squares
    for (let i = 0; i < totalQuestions; i++) {
        const square = document.createElement('div');
        square.classList.add('progress-square');
        progressSquares.appendChild(square);
    }

    startButton.addEventListener('click', startQuiz);

    function startQuiz() {
        startButton.classList.add('hide');
        quizSection.classList.remove('hide');
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
    }

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

    function resetState() {
        nextButton.classList.add('hide');
        resultContainer.innerText = '';
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild); // Clear answer buttons
        }
    }

    function selectAnswer(button, correct) {
        Array.from(answerButtons.children).forEach(btn => {
            btn.disabled = true;
        });
        if (button) {
            button.classList.add(correct ? 'correct' : 'wrong');
        }

        const square = document.getElementsByClassName('progress-square')[currentQuestionIndex];
        square.classList.add(correct ? 'correct-square' : 'wrong-square');

        resultContainer.innerText = correct ? 'Correct!' : 'Incorrect!';
        if (correct) {
            score++;
        }

        nextButton.classList.remove('hide');
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    function showResult() {
        questionContainer.innerText = `Quiz complete! You scored ${score} out of ${totalQuestions}.`;
        nextButton.classList.add('hide');
        resultContainer.innerText = ''; // Clear result text
    }
});