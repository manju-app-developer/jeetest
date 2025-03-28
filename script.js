let questions = [];
let currentQuestionIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    fetch("questions.json")
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        })
        .catch(error => console.error("Error loading questions:", error));

    document.getElementById("next-btn").addEventListener("click", nextQuestion);
});

function loadQuestion() {
    const questionContainer = document.getElementById("question-container");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const integerInput = document.getElementById("integer-answer");
    const questionImage = document.getElementById("question-image");

    optionsContainer.innerHTML = "";
    integerInput.style.display = "none";

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
            button.addEventListener("click", () => selectOption(option));
            optionsContainer.appendChild(button);
        });
    } else if (currentQuestion.type === "Integer") {
        integerInput.style.display = "block";
    }
}

function selectOption(option) {
    console.log("Selected:", option);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        alert("Quiz Completed!");
    }
}
