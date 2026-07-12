// Нормалізація рядка: переведення в нижній регістр, видалення спецсимволів, артиклів та зайвих пробілів
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"]/g, "") // видаляємо пунктуацію
    .replace(/\s+/g, " ") // подвійні пробіли
    .replace(/^(the|a|an|y|і|й)\s+/g, ""); // видаляємо артиклі / сполучники на початку
};

// Обчислення відстані Левенштейна (кількість правок для перетворення одного рядка в інший)
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // заміна
          Math.min(
            matrix[i][j - 1] + 1, // вставка
            matrix[i - 1][j] + 1, // видалення
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

// Перевірка відповіді: повертає true, якщо збіг більше ніж 80%
export const checkAnswer = (
  userInput: string,
  correctAnswer: string,
  originalTitle?: string,
): boolean => {
  const cleanInput = normalizeString(userInput);
  const cleanCorrect = normalizeString(correctAnswer);
  const cleanOriginal = originalTitle ? normalizeString(originalTitle) : "";

  if (
    cleanInput === cleanCorrect ||
    (cleanOriginal && cleanInput === cleanOriginal)
  ) {
    return true;
  }

  // Розрахунок схожості на основі довжини та відстані Левенштейна
  const calculateSimilarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    return (longer.length - getLevenshteinDistance(s1, s2)) / longer.length;
  };

  const similarityUkr = calculateSimilarity(cleanInput, cleanCorrect);
  const similarityOrig = cleanOriginal
    ? calculateSimilarity(cleanInput, cleanOriginal)
    : 0;

  // Якщо схожість становить 82% або вище, зараховуємо відповідь
  return similarityUkr >= 0.82 || similarityOrig >= 0.82;
};