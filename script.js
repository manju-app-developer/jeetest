let questions = [];
let currentQuestionIndex = 0;
let selectedAnswer = null;

document.addEventListener("DOMContentLoaded", async () => {
    await loadQuestions();
    document.getElementById("next-btn").addEventListener("click", nextQuestion);
});

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}

function loadQuestion() {
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const integerInput = document.getElementById("integer-answer");
    const questionImage = document.getElementById("question-image");
    const nextButton = document.getElementById("next-btn");

    optionsContainer.innerHTML = "";
    integerInput.value = "";
    integerInput.style.display = "none";
    selectedAnswer = null;
    nextButton.disabled = true;

    const currentQuestion = questions[currentQuestionIndex];

    questionText.textContent = currentQuestion.question;

    if (currentQuestion.image) {
        questionImage.src = currentQuestion.image;
        questionImage.style.display = "block";
    } else {
        questionImage.style.display = "none";
    }

    if (currentQuestion.type === "MCQ") {
        currentQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.classList.add("option-btn");
            button.textContent = option;
            button.addEventListener("click", () => selectOption(option, button));
            optionsContainer.appendChild(button);
        });
    } else if (currentQuestion.type === "Integer") {
        integerInput.style.display = "block";
        integerInput.addEventListener("input", () => {
            selectedAnswer = integerInput.value;
            nextButton.disabled = selectedAnswer === "";
        });
    }
}

function selectOption(option, button) {
    const nextButton = document.getElementById("next-btn");
    selectedAnswer = option;

    document.querySelectorAll(".option-btn").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
    nextButton.disabled = false;
}

function nextQuestion() {
    if (!selectedAnswer) return;

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        alert("Quiz Completed!");
    }
}
