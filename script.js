
const startButton = document.querySelector('.start-button');
const nextButton = document.querySelector('.next-button');
const restartButton = document.querySelector('.restart-button');
const questionBox = document.querySelector('.question-box');
const answerContainer = document.querySelector('.answer-container');
const scoreText = document.querySelector('.score-text');
const finalScore = document.querySelector('.final-score');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;

// Event listeners
startButton.addEventListener('click', startQuiz);
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
    fetch("data.json")
      .then(response => response.json())
      .then(data => {
        const numOfQuestionsSelect = document.getElementById('numOfQuestions');
        const selectedNumOfQuestions = parseInt(numOfQuestionsSelect.value);
        quizData = generateRandomQuestions(data, selectedNumOfQuestions);
  
        // Hide start screen, show quiz
        document.querySelector('.start-screen').classList.add('hide');
        document.querySelector('.app').classList.remove('hide');
  
        // Load the first question
        loadQuestion(currentQuestionIndex);
      })
      .catch(error => {
        console.error("Error fetching quiz data:", error);
      });
}
  

function generateRandomQuestions(data, numOfQuestions) {
    let randomQuestions = [...data];
    randomQuestions = randomQuestions.sort(() => Math.random() - 0.5);
    randomQuestions = randomQuestions.slice(0, numOfQuestions);
    return randomQuestions;
}
  

let hasAnswered = false;

function updateQuestionHeader() {
    const currentQuestionNumber = currentQuestionIndex + 1;
    const selectedNumOfQuestions = parseInt(document.getElementById('numOfQuestions').value);
    const totalQuestions = selectedNumOfQuestions;

    const questionHeader = document.querySelector('.question-header');
    questionHeader.innerHTML = `Question <span class="current">${currentQuestionNumber}</span> <span class="total">/${totalQuestions}</span>`;
}

// Function to load a question
function loadQuestion(index) {
    const currentQuestion = quizData[index];
    const questionText = currentQuestion.question;
    const answers = currentQuestion.answers;
    document.querySelector('.question').textContent = questionText;
    answerContainer.innerHTML = '';

    for (let i = 0; i < answers.length; i++) {
        const answerOption = document.createElement('div');
        answerOption.classList.add('answer');
        answerOption.textContent = answers[i];
        answerOption.addEventListener('click', function () {
            checkAnswer(this, currentQuestion.correctAnswer);
        }, { once: true });
        answerContainer.appendChild(answerOption);
    }
    hasAnswered = false;

    updateQuestionHeader();
}


  
// Function to check the selected answer
function checkAnswer(selectedAnswer, correctAnswer) {
    if (hasAnswered) {
        return;
    }

    if (selectedAnswer.textContent === correctAnswer) {
        selectedAnswer.classList.add('correct');
        score++;
    } else {
        selectedAnswer.classList.add('wrong');
    }
    // Disable further clicks on answer options
    const answerOptions = document.querySelectorAll('.answer');
    answerOptions.forEach(option => option.removeEventListener('click', checkAnswer));
    nextButton.classList.remove('hide');

    // Set the flag to indicate that the user has answered this question
    hasAnswered = true;

    if (currentQuestionIndex === quizData.length - 1) {
        showEndScreen();
    }
}

  
  
  // Function to load the next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion(currentQuestionIndex);
      nextButton.classList.add('hide');
    }
}

// Function to show the end screen
function showEndScreen() {
    const selectedNumOfQuestions = parseInt(document.getElementById('numOfQuestions').value);
    const totalScore = score + "/" + selectedNumOfQuestions;    
    document.querySelector('.app').classList.add('hide');
    document.querySelector('.end-screen').classList.remove('hide');
    finalScore.textContent = score;
    document.querySelector('.total-score').textContent = "/" + selectedNumOfQuestions;
}


// Function to restart the quiz
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;

  document.querySelector('.end-screen').classList.add('hide');
  document.querySelector('.start-screen').classList.remove('hide');
}
