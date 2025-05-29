export class QuestionManager {
  static beginnerQuestions = [
    {
      id: 1,
      text: "Сколько будет 2 + 2?",
      difficulty: "easy",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      points: 1,
      media: null,
    },
    {
      id: 2,
      text: "Что изображено на картинке?",
      difficulty: "hard",
      options: ["Кошка", "Собака", "Птица", "Рыба"],
      correctAnswer: 0,
      points: 2,
      media: {
        type: "image",
        src: "assets/image.jpg",
        mustLoad: true,
      },
    },
  ];

  static masterQuestions = [
    {
      id: 1,
      text: "Решите уравнение: 2x² - 5x + 3 = 0",
      difficulty: "hard",
      options: [
        "x = 1, x = 1.5",
        "x = -1, x = 1.5",
        "x = 1, x = -1.5",
        "Нет решения",
      ],
      correctAnswer: 0,
      points: 3,
      media: {
        type: "image",
        src: "assets/image.jpg",
        mustLoad: true,
      },
    },
    {
      id: 2,
      text: "Решите уравнение: 2x² - 5x + 30 = 0",
      difficulty: "hard",
      options: [
        "x = 1, x = 1.5",
        "x = -1, x = 1.5",
        "x = 1, x = -1.5",
        "Нет решения",
      ],
      correctAnswer: 0,
      points: 3,
      media: null,
    },
    {
      id: 3,
      text: "Посмотрите видео и ответьте на вопрос",
      difficulty: "hard",
      options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      correctAnswer: 2,
      points: 4,
      media: {
        type: "video",
        src: "assets/rickroll.mp4",
        mustLoad: true,
      },
    },
    {
      id: 4,
      text: "Посмотрите видео и ответьте на вопрос 2",
      difficulty: "hard",
      options: ["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"],
      correctAnswer: 2,
      points: 4,
      media: {
        type: "video",
        src: "assets/rickroll.mp4",
        mustLoad: true,
      },
    },
  ];

  static getQuestions(level) {
    return level === "beginner" ? this.beginnerQuestions : this.masterQuestions;
  }

  static getMaxPossiblePoints(level) {
    return this.getQuestions(level).reduce((sum, q) => sum + q.points, 0);
  }
}
