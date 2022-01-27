export type Score = {
  score: number;
  datetime: string;
};

const storage = window.localStorage;
const SCORES_KEY = "scores";

export function listScores(): Score[] {
  const rawScores = storage.getItem(SCORES_KEY);
  return rawScores ? JSON.parse(rawScores) : [];
}

export function storeScore(score: number) {
  const scores = listScores();
  const newScore: Score = { score, datetime: Date() };
  const updatedScores = [...scores, newScore];
  storage.setItem(SCORES_KEY, JSON.stringify(updatedScores));
}

export function sortScores(score1: Score, score2: Score): number {
  if (score1.score > score2.score) {
    return -1;
  } else {
    return 1;
  }
}

export function resetScores() {
  storage.removeItem(SCORES_KEY);
}
