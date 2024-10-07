document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const questionContainer = document.getElementById('question');
    const answerButtons = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result');
    const progressSquares = document.getElementById('progress-squares');

    let currentQuestionIndex = 0;
    let score = 0;
    let incorrect = 0;
    const totalQuestions = 50;
    const totalQuestionsPerSection = 10;

    // Initialize progress squares
    for (let i = 0; i < totalQuestions; i++) {
        const square = document.createElement('div');
        square.classList.add('progress-square');
        progressSquares.appendChild(square);
    }

    // Array of questions based on AD B
    const questions = [
        // 10 Questions from B1
        {
            question: "B1: What is the minimum width of an escape route in a public building?",
            answers: [
                { text: "1.0 meter", correct: true },
                { text: "0.8 meters", correct: false },
                { text: "1.5 meters", correct: false },
                { text: "2.0 meters", correct: false }
            ]
        },
        {
            question: "B1: In a two-story building, what is the maximum travel distance for escape in one direction?",
            answers: [
                { text: "9 meters", correct: true },
                { text: "18 meters", correct: false },
                { text: "25 meters", correct: false },
                { text: "15 meters", correct: false }
            ]
        },
        // Add additional questions for B1, B2, B3, B4, and B5 sections here
    ];

    // Shuffle answers and randomize the correct one
    function shuffleAnswers(question) {
        const shuffledAnswers = [...question.answers];
        for (let i = shuffledAnswers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
        }
        return shuffledAnswers;
    }

    // Start the quiz
    startQuiz();

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        incorrect = 0;
        nextButton.classList.add('hide'); // Hide next button initially
        updateProgress();
        showQuestion();
    }

    // Display the current question
    function showQuestion() {
        resetState();
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerText = currentQuestion.question;

        const shuffledAnswers = shuffleAnswers(currentQuestion);

        shuffledAnswers.forEach(answer => {
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
            answerButtons.removeChild(answerButtons.firstChild); // Clear answer buttons
        }
    }

    // Handle answer selection
    function selectAnswer(button, correct) {
        Array.from(answerButtons.children).forEach(btn => {
            btn.disabled = true; // Disable all buttons after selecting an answer
            if (btn === button) {
                btn.classList.add(correct ? 'correct' : 'wrong');
            }
        });

        const progressSquare = document.getElementsByClassName('progress-square')[currentQuestionIndex];
        progressSquare.classList.add(correct ? 'correct-square' : 'wrong-square');

        if (correct) {
            score++;
            resultContainer.innerText = 'Correct!';
        } else {
            incorrect++;
            resultContainer.innerText = 'Incorrect!';
        }