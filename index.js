let reportData = ``;
document.addEventListener("DOMContentLoaded", function () {
  var codeTextarea = document.querySelector("textarea");
  codeTextarea.addEventListener("input", function () {
    Prism.highlightElement(codeTextarea);
  });
});

const countHtmlElements = (htmlCode) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlCode, "text/html");
  const numHtmlElements = htmlDoc.getElementsByTagName("*").length;
  return numHtmlElements;
};

const processCss = (cssCode) => {
  const numCssRules = cssCode.split("}").length - 1;
  const numCssDeclarations = cssCode.split(";").length - 1;
  const selectorRegex = /[^,{]+(?=,|\s*{)/g;
  const numCssSelectors = (cssCode.match(selectorRegex) || []).length;

  const cssMetrics = {
    numCssRules,
    numCssDeclarations,
    numCssSelectors,
  };
  return cssMetrics;
};

function generateReportContent(numHtmlElements, cssMetrics) {
  const reportContent = `
    <h1>Website Analysis Report</h1>
    <h2>HTML Analysis</h2>
    <p>Number of HTML elements: ${numHtmlElements}</p>
    
    <h2>CSS Analysis</h2>
    <p>Number of CSS rules: ${cssMetrics.numCssRules}</p>
    <p>Number of CSS declarations: ${cssMetrics.numCssDeclarations}</p>
    <p>Number of CSS selectors: ${cssMetrics.numCssSelectors}</p>
    <br> <br>
    
    <h2 style="text-align:center;">Fitts' Law Analysis Report</h2>
  `;
  return reportContent;
}

function analyzeHtmlCss(htmlCode, cssCode) {
  const numHtmlElements = countHtmlElements(htmlCode);

  const cssMetrics = processCss(cssCode);

  const reportContent = generateReportContent(numHtmlElements, cssMetrics);

  console.log(reportContent);

  reportData += reportContent;
}

const renderHtml = function (event) {
  const htmlTextArea = document.querySelector(".html-content");
  const cssTextArea = document.querySelector(".css-content");
  document.querySelector(".output-container").classList.remove("d-none");
  let renderedHtml = document.querySelector(".rendered-html");

  function renderAndAnalyze() {
    const html = htmlTextArea.value;
    const css = cssTextArea.value;

    renderedHtml.innerHTML = `<html><body>${html}</body></html>`;
    renderedHtml.innerHTML += `<style>${css}</style>`;
    analyzeHtmlCss(html, css);
    setTimeout(() => {
      performFittsAnalysis(html);
    }, 2000);
  }

  renderAndAnalyze();
};

const getInteractiveElements = (htmlCode) => {
  temp =
    '<html><body><button>Click me</button><a href="#">Link</a></body></html>';
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlCode, "text/html");
  const interactiveElements = doc.querySelectorAll(
    'button, a, input[type="text"], select, textarea'
  );

  return Array.from(interactiveElements);
};

const calculateMetrics = (elements) => {
  return elements.map((element) => {
    const computedStyles = window.getComputedStyle(element);
    const height = parseInt(computedStyles.height);
    const width = parseInt(computedStyles.width);

    const targetSize = Math.max(width, height) || 40;

    const nearestInteractiveElementDistance =
      calculateDistanceToNearestInteractive(element, elements);
    const nearestSubmitButtonDistance = calculateDistanceToNearestSubmitButton(
      element,
      elements
    );
    const referencePointDistance = calculateDistanceToReferencePoint(
      element,
      document.querySelector("#reference-point")
    );
    const scrollableAreaDistance = calculateDistanceToScrollableArea(element);
    const importantContentDistance =
      calculateDistanceToImportantContent(element);
    return {
      element,
      width,
      height,
      targetSize,
      nearestInteractiveElementDistance,
      nearestSubmitButtonDistance,
      referencePointDistance,
      scrollableAreaDistance,
      importantContentDistance,
    };
  });
};

function calculateDistanceToElement(element, targetElement) {
  if (!element || !targetElement) return 0;

  const elementRect = element.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  console.log("element", element);
  console.log("targetElement", targetElement);
  console.log("elementRect", elementRect);
  console.log("targetRect", targetRect);

  const elementCenterX = elementRect.left + elementRect.width / 2;
  const elementCenterY = elementRect.top + elementRect.height / 2;

  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;

  const distanceX = Math.abs(targetCenterX - elementCenterX);
  const distanceY = Math.abs(targetCenterY - elementCenterY);

  // Calculate the Euclidean distance
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

  console.log("distance", distance);

  return distance;
}

function isSubmitButton(element) {
  // Check if the element is a submit button
  return element.tagName === "BUTTON" && element.type === "submit";
}

// Calculate distance to nearest interactive element
function calculateDistanceToNearestInteractive(curr, elements) {
  const distances = elements.map((element) => {
    if (element === curr) return Infinity;
    return calculateDistanceToElement(curr, element);
  });
  console.log("distances", distances);
  return Math.min(...distances);
}

// Calculate distance to nearest submit or action button
function calculateDistanceToNearestSubmitButton(element, allElements) {
  const submitButtons = Array.from(allElements).filter((el) =>
    isSubmitButton(el)
  );
  const distances = submitButtons.map((submitButton) =>
    calculateDistanceToElement(element, submitButton)
  );
  const nearestDistance = Math.min(...distances);
  return nearestDistance;
}

function calculateDistanceToReferencePoint(element, referencePoint) {
  const distance = calculateDistanceToElement(element, referencePoint);
  return distance;
}

function calculateDistanceToScrollableArea(element) {
  const scrollableAreas = getScrollableAreas();
  const distances = scrollableAreas.map((scrollableArea) =>
    calculateDistanceToElement(element, scrollableArea)
  );
  const nearestDistance = Math.min(...distances);
  return nearestDistance;
}

function calculateDistanceToImportantContent(element) {
  const importantContent = getImportantContent();
  const distances = importantContent.map((content) =>
    calculateDistanceToElement(element, content)
  );
  const nearestDistance = Math.min(...distances);
  return nearestDistance;
}

function getScrollableAreas() {
  // Retrieve scrollable areas on the page
  const scrollableAreas = document.querySelectorAll("[data-scrollable]");
  return Array.from(scrollableAreas);
}

function getImportantContent() {
  // Retrieve important content elements on the page
  const importantElements = document.querySelectorAll(".important-content");
  return Array.from(importantElements);
}

function performFittsAnalysis(htmlCode) {
  const interactiveElements = getInteractiveElements(htmlCode);
  console.log("Interactive Elements", interactiveElements);
  const metrics = calculateMetrics(interactiveElements);

  metrics.forEach((metric) => {
    const {
      element,
      targetSize,
      width,
      nearestInteractiveElementDistance,
      nearestSubmitButtonDistance,
      referencePointDistance,
      scrollableAreaDistance,
      importantContentDistance,
    } = metric;

    if (!element) return;
    console.log("Element", element, "width", width, "targetSize", targetSize);

    // Calculate Fitts' law parameters
    let distance = Math.max(
      nearestInteractiveElementDistance,
      nearestSubmitButtonDistance,
      referencePointDistance,
      scrollableAreaDistance,
      importantContentDistance
    );
    if (distance === NaN || distance === Infinity) distance = 10000;
    console.log("Distance", distance);
    const indexDifficulty = Math.log2(distance / targetSize + 1);

    // Generate analysis report
    const report = `
    <p><strong>Element:</strong> ${element.tagName}</p>
    <p><strong>Width:</strong> ${width}px</p>
    <p><strong>Target Size:</strong> ${targetSize}px</p>
    <p><strong>Distance to Nearest Interactive Element:</strong> ${nearestInteractiveElementDistance}px</p>
    <p><strong>Distance to Nearest Submit Button:</strong> ${nearestSubmitButtonDistance}px</p>
    <p><strong>Distance to Reference Point:</strong> ${referencePointDistance}px</p>
    <p><strong>Distance to Scrollable Area:</strong> ${scrollableAreaDistance}px</p>
    <p><strong>Distance to Important Content:</strong> ${importantContentDistance}px</p>
    <p><strong>Index of Difficulty:</strong> ${indexDifficulty.toFixed(2)}</p>
    <p><strong>Analysis:</strong> ${
      indexDifficulty < 1
        ? "The design meets Fitts' law requirements. No significant improvements are needed."
        : "The design violates Fitts' law constraints. Consider the following improvements:"
    }</p>
    <ul>
      <li>Increase the target size to improve accuracy and reduce errors.</li>
      <li>Reduce the distance to interactive elements for faster interaction.</li>
      <li>Place important content closer to the reference point for easier access.</li>
      <li>Ensure scrollable areas are easily reachable and distinguishable.</li>
    </ul>
  `;

    reportData += report;
  });
}

const downloadReport = function () {
  const html = `<body>${reportData}</body>`;
  console.log("Download report", reportData);
  var val = htmlToPdfmake(html);
  var dd = {
    content: val,
    styles: {
      body: {
        background: "#add8e6",
        fontSize: 12,
        lineHeight: 1.5,
      },
    },
  };
  pdfMake.createPdf(dd).download();
};

document
  .querySelector("#download-btn")
  .addEventListener("click", downloadReport);

document.querySelector(".render-btn").addEventListener("click", renderHtml);
