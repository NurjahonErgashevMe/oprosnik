export class ResultsCalculator {
  calculateScore(answers, questions) {
    return answers.reduce((sum, answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      return sum + (answer.isCorrect ? question.points : 0);
    }, 0);
  }

  getIncorrectAnswers(answers, questions) {
    return answers
      .filter((answer) => !answer.isCorrect)
      .map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        return {
          question: question.text,
          yourAnswer: question.options[answer.answer] || "Нет ответа",
          correctAnswer: question.options[question.correctAnswer],
          pointsLost: question.points,
        };
      });
  }
}
