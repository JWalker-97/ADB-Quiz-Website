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
    const totalQuestions = 50;
    let timeLeft = 30;
    let countdown;

    // Example Questions - Replace these with 50 actual questions
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
        // Add more questions here to fill up to 50
    ];

    // Initialize progress squares
    for (let i = 0; i < totalQuestions; i++) {
        const square = document.createElement('div');
        square.classList.add('progress-square');
        progressSquares.appendChild(square);
    }

    // Start button click event
    startButton.addEventListener('click', () => {
        startQuiz();  // Ensure this function is correctly triggered
    });

    function startQuiz() {
        startButton.classList.add('hide');  // Hide the start button after clicking
        quizSection.classList.remove('hide');  // Show the quiz section
        currentQuestionIndex = 0;
        score = 0;
        incorrect = 0;
        updateProgress();
        showQuestion();  // Start showing the first question
    }

    function showQuestion() {
        resetState();  // Reset the UI for the next question
        timeLeft = 30;
        timerElement.innerText = timeLeft;
        countdown = setInterval(updateTimer, 1000);  // Start the timer for the question
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
            selectAnswer(null, false);  // Automatically mark the answer as incorrect if time runs out
        }
    }

    function resetState() {
        nextButton.classList.add('hide');  // Hide the Next button initially
        resultContainer.innerText = '';
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);  // Clear the previous answer buttons
        }
        clearInterval(countdown);  // Stop any previous countdown timers
    }

    function selectAnswer(button, correct) {
        Array.from(answerButtons.children).forEach(btn => {
            btn.disabled = true;  // Disable all answer buttons after a choice is made
        });
        if (button) {
            button.classList.add(correct ? 'correct' : 'wrong');  // Highlight the selected button
        }

        const square = document.getElementsByClassName('progress-square')[currentQuestionIndex];
        square.classList.add(correct ? 'correct-square' : 'wrong-square');  // Update progress squares

        resultContainer.innerText = correct ? 'Correct!' : 'Incorrect!';
        if (correct) {
            score++;
        } else {
            incorrect++;
        }

        nextButton.classList.remove('hide');  // Show the Next button to proceed
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();  // Show the next question
        } else {
            showRecap();  // Show recap when all questions are answered
        }
        updateProgress();
    });

    function updateProgress() {
        timerElement.innerText = timeLeft;  // Update the displayed time
    }

    function showRecap() {
        quizSection.classList.add('hide');  // Hide the quiz section
        recapSection.classList.remove('hide');  // Show the recap section

        recapText.innerText = `You got ${score} out of ${totalQuestions} correct. Areas to improve: [summary of weak topics]`;  // Example recap
    }

    certificateButton.addEventListener('click', () => {
        generateCertificate();  // Generate the certificate on button click
    });

    function generateCertificate() {
        const doc = new jsPDF();
        doc.text(`Certificate of Completion`, 20, 20);
        doc.text(`Congratulations, you scored ${score} out of ${totalQuestions} on the AD B quiz.`, 20, 40);
        doc.save('certificate.pdf');  // Save the certificate as a downloadable PDF
    }

    // Shuffle answers for randomness
    function shuffleAnswers(answers) {
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
    }
});