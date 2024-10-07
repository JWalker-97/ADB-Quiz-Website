document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const quizSection = document.getElementById('quiz-section');
    const questionContainer = document.getElementById('question');
    const answerButtons = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const resultContainer = document.getElementById('result');
    const timerElement = document.getElementById('time-left');
    const progressSquares = document.getElementById('progress-squares');
    const recapSection = document.getElementById('recap-section');
    const recapText = document.getElementById('recap-text');
    const certificateButton = document.getElementById('certificate-btn');
    
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrect = 0;
    let totalQuestions = 50;
    let timeLeft = 30;
    let countdown;
    
    const questions = [ /* 50 questions here */ ];
    
    // Initialize progress squares
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
        incorrect = 0;
        updateProgress();
        showQuestion();
    }

    function showQuestion() {
        resetState();
        timeLeft = 30;
        timerElement.innerText = timeLeft;
        countdown = setInterval(updateTimer, 1000);
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerText = currentQuestion.question;
        const shuffledAnswers = shuffleAnswers(currentQuestion.answers);
        shuffledAnswers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(button, answer.correct));
            answerButtons.appendChild(button);
        });
    }

    function updateTimer() {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            selectAnswer(null, false);
        }
    }

    function resetState() {
        nextButton.classList.add('hide');
        resultContainer.innerText = '';
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
        clearInterval(countdown);
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
        resultContainer.innerText = correct ? 'Correct!' : 'Incorrect';
        if (correct) {
            score++;
        } else {
            incorrect++;
        }
        nextButton.classList.remove('hide');
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showRecap();
        }
        updateProgress();
    });

    function updateProgress() {
        timerElement.innerText = timeLeft;
    }

    function showRecap() {
        quizSection