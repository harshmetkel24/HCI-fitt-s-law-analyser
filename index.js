function calculateFittsLaw(target, startTime) {
  const targetWidth = target.offsetWidth;
  const targetDistance = target.getBoundingClientRect().left;
  const index = Math.log2(targetDistance / targetWidth + 1);
  const endTime = performance.now() - startTime;

  return { targetWidth, targetDistance, endTime, index };
}

// Perform Fitts' Law analysis and generate report
function performAnalysis(event) {
  const target = event.target;
  const startTime = performance.now();
  const analysis = calculateFittsLaw(target, startTime);

  console.log("Target Width:", analysis.targetWidth);
  console.log("Target Distance:", analysis.targetDistance);
  console.log("Time:", analysis.endTime);
  console.log("Index of Difficulty:", analysis.index);

  // Generate report
  const report = `
        Fitts' Law Analysis Report:
        ----------------------------
        Target Width: ${analysis.targetWidth}
        Target Distance: ${analysis.targetDistance}
        Time: ${analysis.endTime.toFixed(2)} milliseconds
        Index of Difficulty: ${analysis.index}
      `;

  console.log(report);
}

// document.getElementById("target").addEventListener("click", performAnalysis);

const renderHtml = function (event) {
  document.querySelector(".output-container").classList.remove("d-none");
  performAnalysis(event);
  const html = document.querySelector(".html-content").value;
  const css = document.querySelector(".css-content").value;
  const renderedHtml = document.querySelector(".rendered-html");

  renderedHtml.innerHTML = html;
  console.log(css);
  document.querySelector(".rendered-html").innerHTML += `<style>${css}</style>`;
};

document.querySelector(".render-btn").addEventListener("click", renderHtml);
