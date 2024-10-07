document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const quizSection = document.getElementById('quiz-section');
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');
    const resultElement = document.getElementById('result');
    const progressSquares = document.getElementById('progress-squares');
    const quizTitle = document.getElementById('quiz-title');
    const introText = document.getElementById('intro-text');
    const summarySection = document.getElementById('summary-section');
    const summaryText = document.getElementById('summary-text');
    const reviewList = document.getElementById('review-list');
    const restartButton = document.getElementById('restart-btn');

    let shuffledQuestions, currentQuestionIndex;
    let score = 0;
    const totalQuestions = 50;
    let incorrectQuestions = [];

    // Initialize progress squares
    for (let i = 0; i < totalQuestions; i++) {
        const square = document.createElement('div');
        square.classList.add('progress-square');
        progressSquares.appendChild(square);
    }

    startButton.addEventListener('click', startQuiz);
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        setNextQuestion();
    });
    restartButton.addEventListener('click', restartQuiz);

    function startQuiz() {
        startButton.classList.add('hide');
        quizTitle.classList.add('hide');
        introText.classList.add('hide');
        quizSection.classList.remove('hide');
        score = 0;
        incorrectQuestions = [];
        shuffledQuestions = questions;
        currentQuestionIndex = 0;
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (currentQuestionIndex < totalQuestions) {
            showQuestion(shuffledQuestions[currentQuestionIndex]);
        } else {
            showSummary();
        }
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers = shuffleArray(question.answers);
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.addEventListener('click', () => selectAnswer(button, answer.correct, question));
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        nextButton.classList.add('hide');
        resultElement.innerText = '';
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(selectedButton, correct, question) {
        Array.from(answerButtonsElement.children).forEach(button => {
            button.disabled = true;
            if (button === selectedButton) {
                button.classList.add(correct ? 'correct' : 'wrong');
            }
        });

        const progressSquare = progressSquares.children[currentQuestionIndex];
        progressSquare.classList.add(correct ? 'correct-square' : 'wrong-square');

        if (correct) {
            score++;
            resultElement.innerText = 'Correct!';
        } else {
            resultElement.innerText = 'Incorrect!';
            incorrectQuestions.push(question);
        }

        nextButton.classList.remove('hide');
    }

    function showSummary() {
        quizSection.classList.add('hide');
        summarySection.classList.remove('hide');
        summaryText.innerText = `You scored ${score} out of ${totalQuestions}.`;
        if (incorrectQuestions.length > 0) {
            reviewList.innerHTML = '';
            incorrectQuestions.forEach(question => {
                const listItem = document.createElement('li');
                listItem.innerText = question.topic;
                reviewList.appendChild(listItem);
            });
        } else {
            reviewList.innerHTML = '<li>Great job! You answered all questions correctly.</li>';
        }
    }

    function restartQuiz() {
        summarySection.classList.add('hide');
        quizTitle.classList.remove('hide');
        introText.classList.remove('hide');
        startButton.classList.remove('hide');
        // Reset progress squares
        Array.from(progressSquares.children).forEach(square => {
            square.classList.remove('correct-square', 'wrong-square');
        });
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    // 50 Questions from Approved Document B Volume 2
    const questions = [
        // **Section B1: Means of warning and escape** (10 questions)
        {
            topic: "B1: Escape Routes",
            question: "In a residential building, what is the minimum width for an escape route?",
            answers: [
                { text: "750 mm", correct: true },
                { text: "900 mm", correct: false },
                { text: "1000 mm", correct: false },
                { text: "1100 mm", correct: false }
            ]
        },
        {
            topic: "B1: Fire Detection",
            question: "Which grade of fire detection system is typically required in a single-family dwelling?",
            answers: [
                { text: "Grade D1", correct: true },
                { text: "Grade A", correct: false },
                { text: "Grade C", correct: false },
                { text: "Grade B", correct: false }
            ]
        },
        {
            topic: "B1: Travel Distance",
            question: "What is the maximum travel distance for a single escape route in an office building?",
            answers: [
                { text: "18 meters", correct: true },
                { text: "25 meters", correct: false },
                { text: "45 meters", correct: false },
                { text: "60 meters", correct: false }
            ]
        },
        {
            topic: "B1: Final Exits",
            question: "Final exit doors should open in which direction?",
            answers: [
                { text: "Outwards, in the direction of escape", correct: true },
                { text: "Inwards", correct: false },
                { text: "Either direction", correct: false },
                { text: "Sliding horizontally", correct: false }
            ]
        },
        {
            topic: "B1: Protected Stairways",
            question: "A protected stairway should be enclosed with which type of construction?",
            answers: [
                { text: "Fire-resisting construction", correct: true },
                { text: "Non-combustible materials", correct: false },
                { text: "Timber framing", correct: false },
                { text: "Glass partitions", correct: false }
            ]
        },
        {
            topic: "B1: Assembly Buildings",
            question: "In assembly buildings, escape routes should be provided based on which factor?",
            answers: [
                { text: "Maximum occupancy capacity", correct: true },
                { text: "Building height", correct: false },
                { text: "Number of floors", correct: false },
                { text: "Building area", correct: false }
            ]
        },
        {
            topic: "B1: Emergency Lighting",
            question: "Emergency lighting is required when escape routes are used during which conditions?",
            answers: [
                { text: "Darkness or power failure", correct: true },
                { text: "Daylight hours", correct: false },
                { text: "Only in underground facilities", correct: false },
                { text: "In buildings over 10 stories", correct: false }
            ]
        },
        {
            topic: "B1: Fire Safety Signs",
            question: "Fire safety signs should comply with which standard?",
            answers: [
                { text: "BS ISO 3864-1", correct: true },
                { text: "BS EN 13501-1", correct: false },
                { text: "BS 476-22", correct: false },
                { text: "BS 9999", correct: false }
            ]
        },
        {
            topic: "B1: Refuge Areas",
            question: "What is a refuge area in the context of fire safety?",
            answers: [
                { text: "A safe place for disabled persons to wait for assistance", correct: true },
                { text: "An area for firefighting equipment", correct: false },
                { text: "A storage area for hazardous materials", correct: false },
                { text: "An external assembly point", correct: false }
            ]
        },
        {
            topic: "B1: Inner Rooms",
            question: "An inner room must have what feature to be acceptable?",
            answers: [
                { text: "A vision panel to the access room", correct: true },
                { text: "An alternative escape route", correct: false },
                { text: "Sprinkler protection", correct: false },
                { text: "A maximum area of 20 m²", correct: false }
            ]
        },

        // **Section B2: Internal fire spread (linings)** (10 questions)
        {
            topic: "B2: Wall Linings",
            question: "What is the primary concern regarding internal wall and ceiling linings?",
            answers: [
                { text: "Their surface spread of flame", correct: true },
                { text: "Their acoustic properties", correct: false },
                { text: "Their thermal insulation", correct: false },
                { text: "Their structural strength", correct: false }
            ]
        },
        {
            topic: "B2: Classification",
            question: "Which European class indicates the highest performance for wall linings?",
            answers: [
                { text: "Class A1", correct: true },
                { text: "Class B", correct: false },
                { text: "Class C", correct: false },
                { text: "Class D", correct: false }
            ]
        },
        {
            topic: "B2: Thermoplastic Materials",
            question: "Use of thermoplastic materials in ceilings is restricted because they can:",
            answers: [
                { text: "Drip and cause fire spread", correct: true },
                { text: "Emit toxic fumes", correct: false },
                { text: "Corrode metal structures", correct: false },
                { text: "Reduce natural light", correct: false }
            ]
        },
        {
            topic: "B2: Ceiling Finishes",
            question: "Which class should ceiling linings achieve in residential buildings?",
            answers: [
                { text: "Class C-s3, d2", correct: true },
                { text: "Class B-s1, d0", correct: false },
                { text: "Class D-s3, d2", correct: false },
                { text: "Class A2-s1, d0", correct: false }
            ]
        },
        {
            topic: "B2: Paint Applications",
            question: "Applying paint to walls can affect fire performance by:",
            answers: [
                { text: "Increasing surface spread of flame", correct: true },
                { text: "Enhancing structural integrity", correct: false },
                { text: "Improving thermal insulation", correct: false },
                { text: "Providing moisture resistance", correct: false }
            ]
        },
        {
            topic: "B2: Upholstered Walls",
            question: "Upholstered wall coverings should meet which fire performance criteria?",
            answers: [
                { text: "Limited combustibility", correct: true },
                { text: "Non-combustible", correct: false },
                { text: "Highly flammable", correct: false },
                { text: "No requirements", correct: false }
            ]
        },
        {
            topic: "B2: High-Risk Areas",
            question: "In protected escape routes, wall linings should be of at least:",
            answers: [
                { text: "Class B-s3, d2", correct: true },
                { text: "Class D-s3, d2", correct: false },
                { text: "Class C-s3, d2", correct: false },
                { text: "Class E-s2, d0", correct: false }
            ]
        },
        {
            topic: "B2: Insulation Materials",
            question: "Combustible insulation materials should be protected by:",
            answers: [
                { text: "Non-combustible linings", correct: true },
                { text: "A vapour barrier", correct: false },
                { text: "Aluminium foil", correct: false },
                { text: "Nothing; they are acceptable as is", correct: false }
            ]
        },
        {
            topic: "B2: Junctions and Seals",
            question: "Gaps in linings should be sealed to prevent:",
            answers: [
                { text: "Passage of smoke and flames", correct: true },
                { text: "Loss of heat", correct: false },
                { text: "Sound transmission", correct: false },
                { text: "Water ingress", correct: false }
            ]
        },
        {
            topic: "B2: Multi-Layered Materials",
            question: "When using multi-layered materials, the overall classification is determined by:",
            answers: [
                { text: "The worst-performing layer", correct: true },
                { text: "The best-performing layer", correct: false },
                { text: "An average of all layers", correct: false },
                { text: "Only the surface layer", correct: false }
            ]
        },

        // **Section B3: Internal fire spread (structure)** (10 questions)
        {
            topic: "B3: Compartmentation",
            question: "What is the purpose of compartmentation in buildings?",
            answers: [
                { text: "To limit the spread of fire and smoke", correct: true },
                { text: "To provide acoustic separation", correct: false },
                { text: "To enhance thermal efficiency", correct: false },
                { text: "To support structural loads", correct: false }
            ]
        },
        {
            topic: "B3: Fire Resistance",
            question: "The fire resistance of structural elements is expressed in terms of:",
            answers: [
                { text: "Minutes of integrity and insulation", correct: true },
                { text: "Thermal conductivity", correct: false },
                { text: "Load-bearing capacity", correct: false },
                { text: "Combustion temperature", correct: false }
            ]
        },
        {
            topic: "B3: Cavity Barriers",
            question: "Cavity barriers are required to prevent:",
            answers: [
                { text: "Hidden fire and smoke spread within cavities", correct: true },
                { text: "Heat loss through walls", correct: false },
                { text: "Moisture accumulation", correct: false },
                { text: "Pest infestation", correct: false }
            ]
        },
        {
            topic: "B3: Compartment Floors",
            question: "In a multi-story building, compartment floors are required every:",
            answers: [
                { text: "Every floor level", correct: true },
                { text: "Every third floor", correct: false },
                { text: "Only at ground level", correct: false },
                { text: "Only between different occupancies", correct: false }
            ]
        },
        {
            topic: "B3: Fire-Stopping",
            question: "Fire-stopping materials should be able to withstand fire exposure equivalent to:",
            answers: [
                { text: "The surrounding structure", correct: true },
                { text: "30 minutes regardless of location", correct: false },
                { text: "Only the integrity criterion", correct: false },
                { text: "No specific requirement", correct: false }
            ]
        },
        {
            topic: "B3: Openings in Compartment Walls",
            question: "Doors in compartment walls should have a fire resistance of:",
            answers: [
                { text: "Not less than half of the wall", correct: true },
                { text: "Equal to the wall", correct: false },
                { text: "No requirement", correct: false },
                { text: "Double the wall's fire resistance", correct: false }
            ]
        },
        {
            topic: "B3: Protected Shafts",
            question: "Protected shafts are designed to:",
            answers: [
                { text: "Allow safe passage of services without fire spread", correct: true },
                { text: "Ventilate the building", correct: false },
                { text: "Provide structural support", correct: false },
                { text: "House elevators only", correct: false }
            ]
        },
        {
            topic: "B3: Structural Frame",
            question: "The structural frame of a building must maintain stability for:",
            answers: [
                { text: "The full duration of the required fire resistance", correct: true },
                { text: "At least 15 minutes", correct: false },
                { text: "Only until evacuation is complete", correct: false },
                { text: "No requirement", correct: false }
            ]
        },
        {
            topic: "B3: Timber Floors",
            question: "In certain buildings, timber floors may require additional protection to achieve fire resistance by:",
            answers: [
                { text: "Adding fire-resistant board beneath", correct: true },
                { text: "Applying fire-retardant paint", correct: false },
                { text: "Using thicker floorboards", correct: false },
                { text: "No additional protection needed", correct: false }
            ]
        },
        {
            topic: "B3: Fire Doors",
            question: "Fire doors should be fitted with what to ensure they close automatically?",
            answers: [
                { text: "Self-closing devices", correct: true },
                { text: "Kick plates", correct: false },
                { text: "Vision panels", correct: false },
                { text: "Hold-open magnets", correct: false }
            ]
        },

        // **Section B4: External fire spread** (10 questions)
        {
            topic: "B4: External Walls",
            question: "External walls should inhibit fire spread between buildings by:",
            answers: [
                { text: "Providing fire resistance and limiting combustibility", correct: true },
                { text: "Being non-load-bearing", correct: false },
                { text: "Having large openings", correct: false },
                { text: "Using reflective materials", correct: false }
            ]
        },
        {
            topic: "B4: Boundary Distance",
            question: "The boundary distance is measured from the building to:",
            answers: [
                { text: "The nearest point of the property line", correct: true },
                { text: "The center of the road", correct: false },
                { text: "The furthest point of adjacent buildings", correct: false },
                { text: "Any public space", correct: false }
            ]
        },
        {
            topic: "B4: Unprotected Areas",
            question: "Unprotected areas in external walls include:",
            answers: [
                { text: "Windows and doors", correct: true },
                { text: "Fire-resisting walls", correct: false },
                { text: "Solid masonry", correct: false },
                { text: "Cavity barriers", correct: false }
            ]
        },
        {
            topic: "B4: Roof Coverings",
            question: "Roof coverings are classified for external fire performance under which system?",
            answers: [
                { text: "BROOF(t4)", correct: true },
                { text: "Class 0", correct: false },
                { text: "Class B-s3, d2", correct: false },
                { text: "Euroclass F", correct: false }
            ]
        },
        {
            topic: "B4: Space Separation",
            question: "Space separation aims to:",
            answers: [
                { text: "Prevent fire spread to adjacent buildings", correct: true },
                { text: "Enhance natural ventilation", correct: false },
                { text: "Increase building aesthetics", correct: false },
                { text: "Provide additional parking", correct: false }
            ]
        },
        {
            topic: "B4: External Surfaces",
            question: "In buildings over 18 meters, external surfaces should be of:",
            answers: [
                { text: "Limited combustibility", correct: true },
                { text: "Any material", correct: false },
                { text: "Timber cladding", correct: false },
                { text: "Plastic composites", correct: false }
            ]
        },
        {
            topic: "B4: Balconies",
            question: "Balconies should comply with which fire safety requirement?",
            answers: [
                { text: "Constructed with non-combustible materials", correct: true },
                { text: "No specific requirements", correct: false },
                { text: "Allowed to use timber decking", correct: false },
                { text: "Must be enclosed with glass", correct: false }
            ]
        },
        {
            topic: "B4: Cavities in External Walls",
            question: "Cavities in external walls should be closed at edges with:",
            answers: [
                { text: "Cavity barriers", correct: true },
                { text: "Ventilation grilles", correct: false },
                { text: "Insulation batts", correct: false },
                { text: "Plastic sheeting", correct: false }
            ]
        },
        {
            topic: "B4: Proximity to Boundaries",
            question: "A wall is considered to be fire-resisting if it is within how many meters of the boundary?",
            answers: [
                { text: "Less than 1 meter", correct: true },
                { text: "3 meters", correct: false },
                { text: "5 meters", correct: false },
                { text: "10 meters", correct: false }
            ]
        },
        {
            topic: "B4: Solar Panels",
            question: "Solar panels on roofs should be installed considering:",
            answers: [
                { text: "They do not reduce the roof's fire performance", correct: true },
                { text: "Only their energy output", correct: false },
                { text: "Their weight on the structure", correct: false },
                { text: "Their aesthetic integration", correct: false }
            ]
        },

        // **Section B5: Access and facilities for the fire service** (10 questions)
        {
            topic: "B5: Fire Appliance Access",
            question: "Fire service vehicles should be able to get within what distance of at least one entry point?",
            answers: [
                { text: "45 meters", correct: true },
                { text: "18 meters", correct: false },
                { text: "75 meters", correct: false },
                { text: "100 meters", correct: false }
            ]
        },
        {
            topic: "B5: Fire Mains",
            question: "Buildings over how many meters in height should be provided with dry rising mains?",
            answers: [
                { text: "18 meters", correct: true },
                { text: "11 meters", correct: false },
                { text: "30 meters", correct: false },
                { text: "7.5 meters", correct: false }
            ]
        },
        {
            topic: "B5: Hydrant Provision",
            question: "A fire hydrant should be located within how many meters of the building entrance?",
            answers: [
                { text: "90 meters", correct: true },
                { text: "150 meters", correct: false },
                { text: "45 meters", correct: false },
                { text: "30 meters", correct: false }
            ]
        },
        {
            topic: "B5: Firefighting Shafts",
            question: "In buildings over 18 meters, firefighting shafts are required when the floor area exceeds:",
            answers: [
                { text: "900 m²", correct: true },
                { text: "500 m²", correct: false },
                { text: "1500 m²", correct: false },
                { text: "2000 m²", correct: false }
            ]
        },
        {
            topic: "B5: Turning Facilities",
            question: "Turning facilities for fire appliances are required if dead-end routes exceed:",
            answers: [
                { text: "20 meters", correct: true },
                { text: "15 meters", correct: false },
                { text: "45 meters", correct: false },
                { text: "75 meters", correct: false }
            ]
        },
        {
            topic: "B5: Road Access Width",
            question: "Minimum road width between kerbs for fire service access should be:",
            answers: [
                { text: "3.7 meters", correct: true },
                { text: "2.5 meters", correct: false },
                { text: "4.5 meters", correct: false },
                { text: "5.5 meters", correct: false }
            ]
        },
        {
            topic: "B5: Bridge Loading",
            question: "Bridges on access routes should support a minimum carrying capacity of:",
            answers: [
                { text: "17 tonnes", correct: true },
                { text: "12 tonnes", correct: false },
                { text: "7.5 tonnes", correct: false },
                { text: "5 tonnes", correct: false }
            ]
        },
        {
            topic: "B5: Firefighting Lifts",
            question: "Firefighting lifts are required in buildings with a floor higher than:",
            answers: [
                { text: "18 meters above fire service access level", correct: true },
                { text: "11 meters", correct: false },
                { text: "30 meters", correct: false },
                { text: "7.5 meters", correct: false }
            ]
        },
        {
            topic: "B5: Access Panels",
            question: "Access panels for firefighting should be a minimum size of:",
            answers: [
                { text: "850mm x 1000mm", correct: true },
                { text: "600mm x 600mm", correct: false },
                { text: "1000mm x 2000mm", correct: false },
                { text: "1200mm x 1200mm", correct: false }
            ]
        },
        {
            topic: "B5: Water Supplies",
            question: "The minimum water supply for firefighting in residential areas is:",
            answers: [
                { text: "8 liters per second", correct: true },
                { text: "5 liters per second", correct: false },
                { text: "10 liters per second", correct: false },
                { text: "15 liters per second", correct: false }
            ]
        }
    ];
});