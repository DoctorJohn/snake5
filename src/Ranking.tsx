import React from "react";
import { listScores, resetScores, Score, sortScores } from "./scores";

function Ranking() {
  const [scores, setScores] = React.useState<Score[]>([]);

  const reset = () => {
    resetScores();
    setScores([]);
  };

  React.useEffect(() => {
    const unsortedScores = listScores();
    const sortedScores = unsortedScores.sort(sortScores);
    setScores(sortedScores);
  }, []);

  return (
    <div className="container py-4">
      <h1 className="my-4">Ranking</h1>
      <div className="table-responsive my-4">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Score</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => {
              const rank = index + 1;
              const datetime = new Date(score.datetime);
              const prettyDate = datetime.toLocaleDateString("de-DE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <tr key={score.datetime}>
                  <th scope="row">{rank}</th>
                  <td>{score.score}</td>
                  <td>{prettyDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn btn-outline-danger" onClick={reset}>
        Reset scores
      </button>
    </div>
  );
}

export default Ranking;
