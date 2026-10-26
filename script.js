// Banco de 10 preguntas sobre números enteros (cada una vale 2 puntos)
const questions = [
    { q: "¿Cuánto es -5 + (-3)?", options: ["-2", "2", "-8", "8"], correct: 2 },
    { q: "¿Cuál es el resultado de 8 - (-4)?", options: ["4", "12", "-12", "-4"], correct: 1 },
    { q: "Resuelve: (-6) × 3", options: ["-18", "18", "-3", "-9"], correct: 0 },
    { q: "Resuelve: (-20) ÷ (-4)", options: ["-5", "5", "16", "-16"], correct: 1 },
    { q: "¿Cuál es el valor absoluto de -15?", options: ["-15", "0", "15", "1"], correct: 2 },
    { q: "Si el termómetro marca -2°C y la temperatura baja 5°C más, ¿cuánto marca ahora?", options: ["3°C", "-7°C", "7°C", "-3°C"], correct: 1 },
    { q: "Ordena de menor a mayor: -7, 2, -3, 0", options: ["-7, -3, 0, 2", "0, 2, -3, -7", "-3, -7, 0, 2", "-7, 0, -3, 2"], correct: 0 },
    { q: "¿Qué número entero representa una deuda de 500 dólares?", options: ["500", "+500", "-500", "0"], correct: 2 },
    { q: "Calcula el resultado de: -10 + 15 - 3", options: ["2", "-2", "8", "5"], correct: 0 },
    { q: "¿Cuál es el opuesto del número -9?", options: ["-9", "9", "0", "1/9"], correct: 1 }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = "";
let selectedOption = null;
let timerInterval = null;
let timeLeft = 60; 
let currentFeedbackText = ""; 

function startQuiz() {
    const nameInput = document.getElementById("student-name").value.trim();
    if (!nameInput) {
        alert("Por favor, introduce tu nombre para empezar.");
        return;
    }
    studentName = nameInput;
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("next-btn").innerText = "Siguiente";
    
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timerInterval);
    timeLeft = 60;
    document.getElementById("timer-count").innerText = timeLeft;
    selectedOption = null;

    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById("next-btn").innerText = "Terminar Examen";
    } else {
        document.getElementById("next-btn").innerText = "Siguiente";
    }

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer-count").innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("¡Tiempo agotado en esta pregunta!");
            nextQuestion(); 
        }
    }, 1000);

    const currentQ = questions[currentQuestionIndex];
    document.getElementById("current-q-num").innerText = currentQuestionIndex + 1;
    document.getElementById("question-text").innerText = currentQ.q;

    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = "";

    currentQ.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerText = option;
        btn.onclick = () => selectOption(index, btn);
        optionsBox.appendChild(btn);
    });
}

function selectOption(index, btnElement) {
    selectedOption = index;
    const buttons = document.querySelectorAll(".option-btn");
    buttons.forEach(b => b.classList.remove("selected"));
    btnElement.classList.add("selected");
}

function nextQuestion() {
    if (selectedOption === null && timeLeft > 0) {
        alert("Por favor, selecciona una respuesta antes de continuar.");
        return;
    }

    if (selectedOption === questions[currentQuestionIndex].correct) {
        score += 2;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        clearInterval(timerInterval);
        showResults();
    }
}

function showResults() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("results-screen").classList.remove("hidden");
    
    document.getElementById("res-student-name").innerText = studentName;
    document.getElementById("final-score").innerText = `${score} / 20`;

    const feedbackBox = document.getElementById("feedback-box");

    if (score >= 0 && score <= 10) {
        currentFeedbackText = "Necesitas reforzamiento. Por favor, vuelve a repetir el quiz para mejorar tus habilidades.";
        feedbackBox.className = "feedback-message fb-low";
    } else if (score >= 11 && score <= 15) {
        currentFeedbackText = "¡Lo lograste! Pero aún necesitas reforzamiento en algunos conceptos clave.";
        feedbackBox.className = "feedback-message fb-mid";
    } else if (score >= 16 && score <= 20) {
        currentFeedbackText = "¡Excelente! Lograste un buen puntaje. Demuestras un gran dominio de los números enteros.";
        feedbackBox.className = "feedback-message fb-high";
    }

    feedbackBox.innerText = currentFeedbackText;
}

function triggerEmailSend() {
    sendEmailReport(currentFeedbackText);
}

// CORRECCIÓN INTEGRADORA: Envía los parámetros dinámicos a tu plantilla activa 'template_nl97g1h'
function sendEmailReport(feedbackText) {
    const statusLabel = document.getElementById("mail-status");
    const emailBtn = document.getElementById("send-email-btn");
    
    statusLabel.innerText = "Conectando con el servidor de correo...";
    statusLabel.style.color = "#166088";
    emailBtn.innerText = "✉️ Enviando...";

    const templateParams = {
        student_name: studentName,
        final_score: `${score} / 20`,
        feedback: feedbackText
    };

    // Envío directo de parámetros usando tu Service ID y Template ID reales
    emailjs.send('service_how9fma', 'template_nl97g1h', templateParams)
    .then(() => {
        statusLabel.innerText = "¡Nota enviada exitosamente a vcaballeromerino@gmail.com!";
        statusLabel.style.color = "green";
        emailBtn.innerText = "✉️ Enviar resultados a vcaballeromerino@gmail.com";
        alert("¡Enviado! Los resultados han sido procesados y despachados a tu correo.");
    })
    .catch((err) => {
        console.error("Error en EmailJS:", err);
        statusLabel.innerText = "Error al intentar despachar el correo.";
        statusLabel.style.color = "red";
        emailBtn.innerText = "✉️ Enviar resultados a vcaballeromerino@gmail.com";
        alert("Hubo un problema: " + JSON.stringify(err));
    });
}
