let reportData = ``;

const renderHtml = function (event) {
  document.querySelector(".output-container").classList.remove("d-none");
  performAnalysis(event);
  const html = document.querySelector(".html-content").value;
  const css = document.querySelector(".css-content").value;
  const renderedHtml = document.querySelector(".rendered-html");

  renderedHtml.innerHTML = html;
  document.querySelector(".rendered-html").innerHTML += `<style>${css}</style>`;

  // Attach event listeners to target elements
  for (let i = 0; i < inputTargetElements.length; i++) {
    inputTargetElements[i].addEventListener("mouseenter", handleInteraction);
  }
};

const downloadReport = function () {
  var val = htmlToPdfmake(reportData);
  var dd = { content: val };
  console.log(reportData);
  pdfMake.createPdf(dd).download();
};

document
  .querySelector("#download-btn")
  .addEventListener("click", downloadReport);

document.querySelector(".render-btn").addEventListener("click", renderHtml);

const inputTargetElements = document.getElementsByTagName("input");

const performAnalysis = function (event) {
  console.log(inputTargetElements);
};

const getTargetDimensions = (target) => {
  const { width, height } = target.getBoundingClientRect();
  return { width, height };
};

const handleInteraction = (event) => {
  const target = event.target;
  const startTime = performance.now();

  // Step 4: Measure the user's movement time
  const handleInteractionEnd = () => {
    const endTime = performance.now();
    const movementTime = endTime - startTime;

    // Step 5: Calculate Fitts' Law parameters
    const { width, height } = getTargetDimensions(target);
    const distance = calculateDistanceToTarget(target);
    const index = Math.log2(distance / width + 1);

    // Step 6: Analyze the data (you can perform calculations or store data as needed)

    // Step 7: Generate the report (you can log the results or display them in a report format)
    reportData += `<h3>Target Width: ${width}</h3>
    <h3>Target Distance: ${distance}</h3>
    <h3>Movement Time: ${movementTime.toFixed(2)} milliseconds</h3>
    <h3>Index of Difficulty: ${index}</h3>
    <hr>
    `;
    console.log("Target Width:", width);
    console.log("Target Distance:", distance);
    console.log("Movement Time:", movementTime.toFixed(2), "milliseconds");
    console.log("Index of Difficulty:", index);
  };

  target.addEventListener("mouseleave", handleInteractionEnd);
  target.addEventListener("mouseup", handleInteractionEnd);
};

// Helper function to calculate the distance from the cursor to the target
const calculateDistanceToTarget = (target) => {
  const targetRect = target.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const cursorX = event.clientX;
  const cursorY = event.clientY;
  return Math.sqrt((targetX - cursorX) ** 2 + (targetY - cursorY) ** 2);
};
