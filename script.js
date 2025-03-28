document.addEventListener("DOMContentLoaded", () => {
    const questionBox = document.getElementById("question-box");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.getElementById("next-btn");
    const integerInput = document.getElementById("integer-answer");
    const questionImage = document.getElementById("question-image");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let totalMarks = 300;
    let totalQuestions = 0;

    // Fetch questions from questions.json
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            totalQuestions = questions.length;
            loadQuestion();
        })
        .catch(error => console.error("Error fetching questions:", error));

    // Load a question
    function loadQuestion() {
        resetUI();
        let currentQuestion = questions[currentQuestionIndex];
        questionBox.innerHTML = `<h2>${currentQuestion.question}</h2>`;

        // Display image if available
        if (currentQuestion.image) {
            questionImage.src = currentQuestion.image;
            questionImage.style.display = "block";
        } else {
            questionImage.style.display = "none";
        }

        // Check if it's a multiple-choice or integer-based question
        if (currentQuestion.type === "multiple-choice") {
            integerInput.style.display = "none"; // Hide integer input
            optionsContainer.style.display = "flex"; // Show options

            currentQuestion.options.forEach((option, index) => {
                let btn = document.createElement("button");
                btn.classList.add("option-btn");
                btn.textContent = option;
                btn.onclick = () => checkAnswer(index, currentQuestion.correctAnswer);
                optionsContainer.appendChild(btn);
            });
        } else if (currentQuestion.type === "integer") {
            optionsContainer.style.display = "none"; // Hide multiple-choice options
            integerInput.style.display = "block"; // Show integer input
            integerInput.value = ""; // Clear previous input
            integerInput.focus();
            integerInput.onkeypress = (event) => {
                if (event.key === "Enter") {
                    checkIntegerAnswer(parseInt(integerInput.value), currentQuestion.correctAnswer);
                }
            };
        }
    }

    // Reset UI for the next question
    function resetUI() {
        optionsContainer.innerHTML = "";
        integerInput.style.display = "none";
        nextBtn.style.display = "none";
    }

    // Check multiple-choice answer
    function checkAnswer(selectedIndex, correctIndex) {
        let buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === correctIndex) {
                btn.classList.add("correct");
            }
            if (index === selectedIndex && index !== correctIndex) {
                btn.classList.add("wrong");
            }
        });

        updateScore(selectedIndex === correctIndex);
        nextBtn.style.display = "block";
    }

    // Check integer-based answer
    function checkIntegerAnswer(userAnswer, correctAnswer) {
        if (isNaN(userAnswer)) {
            alert("Please enter a valid number.");
            return;
        }

        if (userAnswer === correctAnswer) {
            integerInput.classList.add("correct");
        } else {
            integerInput.classList.add("wrong");
        }

        updateScore(userAnswer === correctAnswer);
        nextBtn.style.display = "block";
    }

    // Update score based on correctness
    function updateScore(isCorrect) {
        if (isCorrect) {
            score += 4;
        } else {
            score -= 1;
        }
    }

    // Load the next question
    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            loadQuestion();
        } else {
            showFinalResults();
        }
    });

    // Show Final Score
    function showFinalResults() {
        questionBox.innerHTML = `<h2>Test Completed!</h2>`;
        optionsContainer.innerHTML = `<h3>Your Score: ${score} / ${totalMarks}</h3>`;
        integerInput.style.display = "none";
        nextBtn.style.display = "none";
    }
});
