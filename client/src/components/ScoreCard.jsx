const ScoreCard = ({ title, score }) => {
  const value = Math.round(score);

  let grade = "red";
  let description = "Critical";
  
  if (value >= 90) {
    grade = "green";
    description = "Optimal";
  } else if (value >= 50) {
    grade = "orange";
    description = "Average";
  }

  return (
    <div className={`score-card ${grade}`}>
      <div className="score-circle">
        <span className="score">{value}</span>
      </div>
      <h3>{title}</h3>
      <p className="score-text">{description}</p>
    </div>
  );
};

export default ScoreCard;
