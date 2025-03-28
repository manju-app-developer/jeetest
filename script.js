let questions = [];
let currentQuestionIndex = 0;
let score = 0;

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        startQuiz();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    resetState();
    let question = questions[currentQuestionIndex];
    document.getElementById("question-text").innerText = question.question;

    let imageElement = document.getElementById("question-image");
    if (question.image) {
        imageElement.src = question.image;
        imageElement.style.display = "block";
    } else {
        imageElement.style.display = "none";
    }

    question.options.forEach(option => {
        let button = document.createElement("button");
        button.innerText = option;
        button.classList.add("btn");
        button.addEventListener("click", () => selectAnswer(button, question.answer));
        document.getElementById("answer-buttons").appendChild(button);
    });

    document.getElementById("next-btn").style.display = "none";
}

function resetState() {
    document.getElementById("answer-buttons").innerHTML = "";
}

function selectAnswer(selectedButton, correctAnswer) {
    let isCorrect = selectedButton.innerText === correctAnswer;
    if (isCorrect) {
        selectedButton.style.backgroundColor = "green";
        score++;
    } else {
        selectedButton.style.backgroundColor = "red";
    }

    document.getElementById("next-btn").style.display = "block";
}

document.getElementById("next-btn").addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById("question-text").innerText = `Quiz Completed! Your score: ${score} / ${questions.length}`;
        document.getElementById("answer-buttons").innerHTML = "";
        document.getElementById("next-btn").style.display = "none";
    }
});

loadQuestions();
