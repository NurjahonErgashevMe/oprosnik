import { Timer } from "../modules/Timer.js";

export class SurveyView {
  constructor(app) {
    this.app = app;
    this.timer = null;
    this.mediaReady = false;
    this.mediaType = null;
    this.videoWasPlayed = false;
    this.selectedAnswer = null;
    this.currentQuestionId = null;
  }

  render() {
    const question = this.app.getCurrentQuestion();
    if (!question) {
      this.app.navigateTo("results");
      return "";
    }

    const progress = this.app.getProgress();
    const totalQuestions = this.app.state.questions.length;

    const progressBarColor = question.media
      ? "#a0aec0"
      : "var(--primary-color)";

    return `
        <div class="survey-view">
            <header class="header">
                <h1 class="header__title">Вопрос ${
                  progress.current
                } из ${totalQuestions}</h1>
                <p class="header__subtitle">${this.app.state.userData.name}</p>
            </header>
            
            <div class="card">
                <div class="progress-container">
                    <div class="progress-bar" id="progressBar" 
                         style="width: 100%; background-color: ${progressBarColor}">
                    </div>
                </div>
                
                <div class="question">
                    <div class="question__meta">
                        <span class="question__difficulty question__difficulty--${
                          question.difficulty
                        }">
                            ${
                              question.difficulty === "easy"
                                ? "Легко"
                                : "Сложно"
                            }
                        </span>
                        <span class="question__points">${
                          question.points
                        } балла</span>
                    </div>
                  
                    
                    ${question.media ? this.renderMedia(question.media) : ""}

                    <p class="question__text">${question.text}</p>
                    
                    <ul class="options">
                        ${question.options
                          .map(
                            (option, i) => `
                            <li class="option">
                                <input type="radio" 
                                       id="option-${i}" 
                                       name="answer" 
                                       value="${i}" 
                                       class="option__input">
                                <label for="option-${i}" class="option__label">
                                    <span class="option__indicator"></span>
                                    <span class="option__text">${option}</span>
                                </label>
                            </li>
                        `
                          )
                          .join("")}
                    </ul>
                </div>
                
                <button id="nextBtn" class="btn btn--primary">
                    ${
                      progress.current === totalQuestions
                        ? "Завершить"
                        : "Далее"
                    }
                </button>
            </div>
        </div>
    `;
  }

  renderMedia(media) {
    if (!media) return "";

    return `
            <div class="media-container" id="mediaContainer">
                ${
                  media.type === "image"
                    ? `
                    <img src="${media.src}" alt="Изображение для вопроса" id="questionMedia">
                `
                    : `
                    <video controls id="questionMedia">
                        <source src="${media.src}" type="video/mp4">
                    </video>
                `
                }
                <div class="media-loader" id="mediaLoader">
                    <div class="loader-spinner"></div>
                    <p>Загрузка медиа...</p>
                </div>
            </div>
        `;
  }

  renderOption(option, index) {
    return `
            <li class="option">
                <input type="radio" 
                       id="option-${index}" 
                       name="answer" 
                       value="${index}" 
                       class="option__input">
                <label for="option-${index}" class="option__label">
                    <span class="option__indicator"></span>
                    <span class="option__text">${option}</span>
                </label>
            </li>
        `;
  }

  afterRender() {
    const question = this.app.getCurrentQuestion();
    this.resetQuestionState(question);
    this.currentQuestionId = question.id;

    this.setupOptionListeners();

    document.getElementById("nextBtn").addEventListener("click", () => {
      this.handleNextButton();
    });

    if (!question.media) {
      this.mediaReady = true;
      this.initTimer();
    } else {
      // Запускаем проверку состояния медиа с небольшой задержкой
      setTimeout(() => this.setupMediaLoader(question.media), 100);
    }

    this.setupProgressTooltip();
  }

  setupOptionListeners() {
    // Обработчики для выбора ответа
    document.querySelectorAll(".option__input").forEach((input) => {
      input.addEventListener("change", (e) => {
        this.selectedAnswer = parseInt(e.target.value);
        console.log("Выбран ответ:", this.selectedAnswer);
      });
    });
  }

  handleNextButton() {
    if (this.selectedAnswer === null) {
      alert("Пожалуйста, выберите ответ!");
      return;
    }
    this.submitQuestion();
  }

  resetQuestionState(question) {
    this.mediaReady = false;
    this.videoWasPlayed = false;
    this.selectedAnswer = null;
    this.mediaType = question.media ? question.media.type : null;

    // Останавливаем предыдущий таймер
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }

    // Сбрасываем UI прогрессбара
    const progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.style.width = "100%";
      progressBar.style.backgroundColor = question.media
        ? "#a0aec0"
        : "var(--primary-color)";
    }
  }

  setupMediaLoader(media) {
    const mediaElement = document.getElementById("questionMedia");
    const loader = document.getElementById("mediaLoader");
    this.mediaType = media.type;

    const onMediaReady = () => {
      if (loader) loader.style.display = "none";
      this.mediaReady = true;

      if (media.type === "video") {
        const handleFirstPlay = () => {
          if (!this.videoWasPlayed) {
            this.videoWasPlayed = true;
            this.initTimer();
          }
        };

        mediaElement.addEventListener("play", handleFirstPlay);
      } else {
        this.initTimer();
      }
    };

    if (mediaElement) {
      if (mediaElement.tagName === "IMG") {
        if (mediaElement.complete) {
          onMediaReady();
        } else {
          mediaElement.onload = onMediaReady;
        }
      } else if (mediaElement.tagName === "VIDEO") {
        if (mediaElement.readyState >= 3) {
          // HAVE_FUTURE_DATA
          onMediaReady();
        } else {
          mediaElement.oncanplaythrough = onMediaReady;
        }
      }

      mediaElement.onerror = () => {
        if (loader) loader.innerHTML = "<p>Ошибка загрузки медиа</p>";
        this.mediaReady = true;
        this.initTimer();
      };
    } else {
      // Если по какой-то причине элемент не найден
      this.mediaReady = true;
      this.initTimer();
    }
  }

  // SurveyView.js - обновленный метод setupMediaLoader
  setupMediaLoader(media) {
    const mediaElement = document.getElementById("questionMedia");
    const loader = document.getElementById("mediaLoader");
    this.mediaType = media.type;

    const onMediaReady = () => {
      if (loader) {
        loader.style.display = "none";
      }
      this.mediaReady = true;

      if (media.type === "video") {
        const handleFirstPlay = () => {
          if (!this.videoWasPlayed) {
            this.videoWasPlayed = true;
            this.initTimer();
          }
        };

        mediaElement.addEventListener("play", handleFirstPlay);
      } else {
        this.initTimer();
      }
    };

    // Проверяем состояние загрузки
    let isMediaReady = false;

    if (mediaElement) {
      if (mediaElement.tagName === "IMG") {
        // Для изображений
        if (mediaElement.complete) {
          isMediaReady = true;
        } else {
          mediaElement.onload = onMediaReady;
          mediaElement.onerror = () => {
            if (loader) loader.innerHTML = "<p>Ошибка загрузки изображения</p>";
            this.mediaReady = true;
            this.initTimer();
          };
        }
      } else if (mediaElement.tagName === "VIDEO") {
        // Для видео
        const checkVideoState = () => {
          if (mediaElement.readyState >= 3) {
            // HAVE_FUTURE_DATA
            isMediaReady = true;
          } else {
            mediaElement.oncanplaythrough = onMediaReady;
          }
        };

        // Проверяем сразу при создании элемента
        setTimeout(checkVideoState, 0);

        mediaElement.onerror = () => {
          if (loader) loader.innerHTML = "<p>Ошибка загрузки видео</p>";
          this.mediaReady = true;
          this.initTimer();
        };
      }
    }

    // Если медиа уже загружено, сразу вызываем onMediaReady
    if (isMediaReady) {
      onMediaReady();
    }
  }

  initTimer() {
    // Проверяем, что мы все еще на том же вопросе
    const question = this.app.getCurrentQuestion();
    if (!question || question.id !== this.currentQuestionId) {
      return;
    }

    // Останавливаем предыдущий таймер
    if (this.timer) {
      this.timer.stop();
    }

    const progressBar = document.getElementById("progressBar");
    const tooltip = document.getElementById("progressTooltip");
    const duration = 20;

    if (progressBar) {
      progressBar.style.backgroundColor = "var(--primary-color)";
    }

    this.timer = new Timer(
      duration,
      (timeLeft) => {
        if (!progressBar) return;

        const percentage = (timeLeft / duration) * 100;
        progressBar.style.width = `${percentage}%`;

        if (tooltip) {
          tooltip.innerHTML = `
                        <div>Осталось: ${timeLeft.toFixed(1)} сек</div>
                        ${
                          this.mediaType
                            ? `
                            <div>Медиа: ${this.getMediaStatus()}</div>
                        `
                            : ""
                        }
                    `;
        }

        if (timeLeft < duration * 0.3 && progressBar) {
          progressBar.style.background = "#f56565";
        }
      },
      () => {
        // Автоматический сабмит при окончании времени
        if (this.selectedAnswer === null) {
          // Выбираем случайный ответ если не выбран
          this.selectedAnswer = Math.floor(
            Math.random() * question.options.length
          );
        }
        this.submitQuestion();
      }
    );

    this.timer.start();
  }

  getMediaStatus() {
    if (this.mediaType === "image") {
      return "загружено";
    } else if (this.mediaType === "video") {
      return this.videoWasPlayed
        ? "воспроизводится"
        : "ожидание воспроизведения";
    }
    return "";
  }

  setupProgressTooltip() {
    const progressContainer = document.querySelector(".progress-container");
    if (!progressContainer) return;

    progressContainer.insertAdjacentHTML(
      "beforeend",
      `
            <div class="progress-tooltip" id="progressTooltip">
                <div>Таймер начнется после загрузки медиа</div>
            </div>
        `
    );

    progressContainer.addEventListener("mouseenter", () => {
      const tooltip = document.getElementById("progressTooltip");
      if (tooltip) {
        tooltip.style.opacity = "1";
        tooltip.style.visibility = "visible";
      }
    });

    progressContainer.addEventListener("mouseleave", () => {
      const tooltip = document.getElementById("progressTooltip");
      if (tooltip && !this.timer?.getStatus()?.isRunning) {
        tooltip.style.opacity = "0";
        tooltip.style.visibility = "hidden";
      }
    });
  }

  submitQuestion() {
    const question = this.app.getCurrentQuestion();

    // Останавливаем таймер
    if (this.timer) {
      this.timer.stop();
      this.timer = null;
    }

    const answerData = {
      questionId: question.id,
      answer: this.selectedAnswer,
      isCorrect: this.selectedAnswer === question.correctAnswer,
      points:
        this.selectedAnswer === question.correctAnswer ? question.points : 0,
      timeSpent: 20 - (this.timer?.getTimeLeft() || 0),
    };

    this.app.addAnswer(answerData);

    // Переходим к следующему вопросу или результатам
    if (
      this.app.state.currentQuestionIndex <
      this.app.state.questions.length - 1
    ) {
      this.app.state.currentQuestionIndex++;
      this.app.render();
    } else {
      this.app.navigateTo("results");
    }
  }
}
