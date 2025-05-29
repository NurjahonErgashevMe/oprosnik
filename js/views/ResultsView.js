export class ResultsView {
  constructor(app) {
    this.app = app;
  }

  render() {
    const { userData, answers, questions } = this.app.state;
    const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length;

    // Получаем рейтинг участников
    const ranking = this.getRanking();

    return `
            <div class="results-view">
                <header class="header">
                    <h1 class="header__title">Результаты опроса</h1>
                    <p class="header__subtitle">${userData.name}, ${
      userData.skillLevel === "beginner"
        ? "начинающий уровень"
        : "мастер уровень"
    }</p>
                </header>
                
                <div class="card">
                    <div class="results-summary">
                        <div class="results-score">
                            <span class="score-number">${totalPoints}</span>
                            <span class="score-text">из ${maxPoints} баллов</span>
                        </div>
                        
                        <div class="progress-container" style="margin: 1.5rem 0;">
                            <div class="progress-bar" style="width: ${Math.round(
                              (totalPoints / maxPoints) * 100
                            )}%; background-color: ${this.getScoreColor(
      (totalPoints / maxPoints) * 100
    )};"></div>
                        </div>
                        
                        <p class="results-percentage">${correctAnswers} из ${totalQuestions} правильных ответов</p>
                    </div>
                    
                    <h3 class="results-subtitle">Рейтинг участников</h3>
                    <div class="ranking-container">
                        <table class="ranking-table">
                            <thead>
                                <tr>
                                    <th>Место</th>
                                    <th>Участник</th>
                                    <th>Баллы</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${ranking
                                  .map(
                                    (participant, index) => `
                                    <tr class="${
                                      participant.isCurrent
                                        ? "current-user"
                                        : ""
                                    }">
                                        <td>${index + 1}</td>
                                        <td>${participant.name}</td>
                                        <td>${participant.score}</td>
                                    </tr>
                                `
                                  )
                                  .join("")}
                            </tbody>
                        </table>
                    </div>
                    
                    <button id="restartBtn" class="btn btn--primary" style="margin-top: 2rem;">
                        Пройти тест еще раз
                    </button>
                </div>
            </div>
        `;
  }

  getRanking() {
    // В реальном приложении эти данные приходили бы с сервера
    const sampleData = [
      { id: "1", name: "Иван Иванов", score: 95 },
      { id: "2", name: "Петр Петров", score: 87 },
      { id: "3", name: "Сергей Сергеев", score: 82 },
      { id: "4", name: "Анна Аннова", score: 78 },
      { id: "5", name: "Мария Маринова", score: 75 },
      { id: "6", name: "Алексей Алексеев", score: 72 },
      { id: "7", name: "Дмитрий Дмитриев", score: 68 },
      { id: "8", name: "Елена Еленова", score: 65 },
      { id: "9", name: "Ольга Ольгова", score: 60 },
      { id: "10", name: "Николай Николаев", score: 58 },
    ];

    // Добавляем текущего пользователя
    const { userData, answers, questions } = this.app.state;
    const totalPoints = answers.reduce((sum, a) => sum + a.points, 0);

    const currentUser = {
      id: "current",
      name: userData.name,
      score: totalPoints,
      isCurrent: true,
    };

    // Объединяем и сортируем
    const allParticipants = [...sampleData, currentUser].sort(
      (a, b) => b.score - a.score
    );

    // Помечаем текущего пользователя
    return allParticipants.map((p) => ({
      ...p,
      isCurrent: p.id === "current",
    }));
  }

  getScoreColor(percentage) {
    if (percentage >= 80) return "#48bb78";
    if (percentage >= 50) return "#ed8936";
    return "#f56565";
  }

  afterRender() {
    document.getElementById("restartBtn").addEventListener("click", () => {
      this.app.resetTest();
      this.app.navigateTo("registration");
    });
  }

  renderIncorrectAnswers(incorrectAnswers, questions) {
    return `
            <ul class="incorrect-answers">
                ${incorrectAnswers
                  .map((answer) => {
                    const question = questions.find(
                      (q) => q.id === answer.questionId
                    );
                    return `
                        <li class="incorrect-answer">
                            <p class="question-text">${question.text}</p>
                            <div class="answer-comparison">
                                <span class="your-answer">Ваш ответ: ${
                                  question.options[answer.answer] || "—"
                                }</span>
                                <span class="correct-answer">Правильный ответ: ${
                                  question.options[question.correctAnswer]
                                }</span>
                            </div>
                            <div class="points-lost">-${
                              question.points
                            } балла</div>
                        </li>
                    `;
                  })
                  .join("")}
            </ul>
        `;
  }


  // afterRender() {
  //   document.getElementById("restartBtn")?.addEventListener("click", () => {
  //     this.app.resetAnswers();
  //     this.app.navigateTo("registration");
  //   });

  //   // In a real app, send email here
  //   console.log(`Results email sent to ${this.app.state.userData.email}`);
  // }
}
