    const QUESTIONS = [
      {
        id: 1,
        q: "Where is the capital of Bangladesh??",
        choices: ["Dhaka","Khulna","Barisal","Rajshahi"],
        answer: 1 // index (0-based)
      },
      {
        id: 2,
        q: "What does Html mean?",
        choices: ["Hyper Text Markup Language","Home Tool Markup Language","Hyperlinks Text Markup Level","HighText Markup Language"],
        answer: 0
      },
      {
        id: 3,
        q: "Who runs JavaScript in the browser?",
        choices: ["Interpreter","Compiler","Both","None"],
        answer: 0
      },
      {
        id: 4,
        q: "2 + 3 * 4 = ?",
        choices: ["20","14","10","18"],
        answer: 1
      },
      {
        id: 5,
        q: "Which one is a CSS preprocessor?",
        choices: ["Docker","Sass","Python","MySQL"],
        answer: 1
      }
    ];

    // CONFIG
    const TIME_PER_QUESTION = 20; // seconds for each question

    // APP STATE
    let state = {
      questions: [],
      currentIndex: 0,
      score: 0,
      userAnswers: {}, // {questionId: chosenIndex}
      timer: null,
      timeLeft: TIME_PER_QUESTION
    };

    // DOM
    const questionText = document.getElementById('questionText');
    const choicesContainer = document.getElementById('choicesContainer');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const scoreEl = document.getElementById('score');
    const totalEl = document.getElementById('total');
    const resultArea = document.getElementById('resultArea');
    const questionArea = document.getElementById('questionArea');
    const resultTitle = document.getElementById('resultTitle');
    const resultDetails = document.getElementById('resultDetails');
    const progressBar = document.getElementById('progressBar');
    const timeLeftEl = document.getElementById('timeLeft');

    // UTILITIES
    function shuffleArray(arr){
      // Fisher–Yates
      for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // INITIALIZE
    function init(){
      // deep copy questions so original QUESTIONS not mutated
      state.questions = JSON.parse(JSON.stringify(QUESTIONS));
      shuffleArray(state.questions); // shuffle questions
      // optionally shuffle choices for each question while keeping track of correct index
      state.questions.forEach(q => {
        const correct = q.choices[q.answer];
        q.choices = shuffleArray(q.choices);
        q.answer = q.choices.indexOf(correct);
      });

      state.currentIndex = 0;
      state.score = 0;
      state.userAnswers = {};
      totalEl.textContent = state.questions.length;
      scoreEl.textContent = state.score;
      resultArea.classList.add('hidden');
      questionArea.classList.remove('hidden');
      renderQuestion();
      startTimer();
      updateProgress();
    }

    // RENDER
    function renderQuestion(){
      const q = state.questions[state.currentIndex];
      questionText.textContent = `Q${state.currentIndex + 1}. ${q.q}`;
      choicesContainer.innerHTML = '';

      q.choices.forEach((choice, idx) => {
        const btn = document.createElement('div');
        btn.className = 'choice';
        btn.tabIndex = 0;
        btn.setAttribute('data-index', idx);
        btn.textContent = choice;

        // mark selected if user already chose
        const saved = state.userAnswers[q.id];
        if (saved !== undefined && saved === idx){
          btn.classList.add('selected');
        }

        btn.addEventListener('click', () => onSelectChoice(q, idx, btn));
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelectChoice(q, idx, btn);
        });

        choicesContainer.appendChild(btn);
      });

      // prev/next visibility
      prevBtn.disabled = state.currentIndex === 0;
      nextBtn.disabled = state.currentIndex === state.questions.length - 1;
      updateProgress();
      resetTimer();
    }

    function onSelectChoice(question, choiceIdx, btnEl){
      // save answer
      state.userAnswers[question.id] = choiceIdx;

      // update UI selection
      Array.from(choicesContainer.children).forEach(c => c.classList.remove('selected','correct','wrong'));
      btnEl.classList.add('selected');

      // immediate feedback: show correct/wrong styles
      const correctIndex = question.answer;
      Array.from(choicesContainer.children).forEach((c, idx) => {
        const i = Number(c.getAttribute('data-index'));
        if (i === correctIndex) c.classList.add('correct');
        else if (i === choiceIdx) c.classList.add('wrong');
      });

      // update score (so score shown in header is live)
      recalcScore();
      // stop timer for this question and move on a bit? we'll keep timer running but you can auto-move if desired
    }

    function recalcScore(){
      let s = 0;
      for(const q of state.questions){
        const ua = state.userAnswers[q.id];
        if (ua !== undefined && ua === q.answer) s++;
      }
      state.score = s;
      scoreEl.textContent = state.score;
    }

    // NAV
    nextBtn.addEventListener('click', () => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex++;
        renderQuestion();
      }
    });
    prevBtn.addEventListener('click', () => {
      if (state.currentIndex > 0) {
        state.currentIndex--;
        renderQuestion();
      }
    });

    submitBtn.addEventListener('click', submitQuiz);
    resetBtn.addEventListener('click', () => {
      if (confirm(' Start again?')) init();
    });
    tryAgainBtn.addEventListener('click', init);

    function submitQuiz(){
      // finalize score
      recalcScore();
      // show result
      questionArea.classList.add('hidden');
      resultArea.classList.remove('hidden');
      resultTitle.textContent = `score: ${state.score} / ${state.questions.length};
      const pct = Math.round((state.score / state.questions.length) * 100)`;
      resultDetails.innerHTML = `Correct: ${state.score} &nbsp; | &nbsp; Tota: ${state.questions.length} &nbsp; | &nbsp; Percentage: ${pct}%;
      stopTimer()`;
    }

    // PROGRESS
    function updateProgress(){
      const pct = Math.round(((state.currentIndex + 1) / state.questions.length) * 100);
      progressBar.style.width = pct + '%';
    }

    // TIMER
    function startTimer(){
      stopTimer();
      state.timeLeft = TIME_PER_QUESTION;
      timeLeftEl.textContent = state.timeLeft;
      state.timer = setInterval(() => {
        state.timeLeft--;
        timeLeftEl.textContent = state.timeLeft;
        if (state.timeLeft <= 0){
          // auto move to next question or submit if last
          if (state.currentIndex < state.questions.length - 1){
            state.currentIndex++;
            renderQuestion();
          } else {
            submitQuiz();
          }
        }
      }, 1000);
    }

    function resetTimer(){
      // called when rendering a question
      startTimer();
    }

    function stopTimer(){
      if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
      }
    }

    // on load
    window.addEventListener('load', init);

    // save to localStorage before unload (optional)
    window.addEventListener('beforeunload', () => {
      const save = {
        questions: state.questions,
        userAnswers: state.userAnswers,
        currentIndex: state.currentIndex,
        score: state.score
      };
      localStorage.setItem('quiz_save_v1', JSON.stringify(save));
    });

    // optionally restore
    (function tryRestore(){
      try {
        const raw = localStorage.getItem('quiz_save_v1');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (confirm('Previous save found — restore?')) {
          // overwrite QUESTIONS with saved state (simple restore)
          state.questions = parsed.questions || state.questions;
          state.userAnswers = parsed.userAnswers || {};
          state.currentIndex = parsed.currentIndex || 0;
          state.score = parsed.score || 0;

          totalEl.textContent = state.questions.length;
          scoreEl.textContent = state.score;
          renderQuestion();
        }
      } catch (e) {
        console.warn('restore failed', e);
      }
    })();

