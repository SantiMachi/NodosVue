export function convertToPixels(relativeSize) {
    var baseSize = parseFloat(getComputedStyle(document.body).fontSize);
    return baseSize * parseFloat(relativeSize);
 }

 export function extractFontSize(fontProperty) {
    // Create a temporary element
    var tempElement = document.createElement("div");
    tempElement.style.font = fontProperty;

    // Append the element to the document body (but make it not visible)
    tempElement.style.display = "none";
    document.body.appendChild(tempElement);

    // Get the computed font size in pixels
    var fontSize = parseFloat(window.getComputedStyle(tempElement).fontSize);

    // Remove the temporary element from the document
    document.body.removeChild(tempElement);

    return isNaN(fontSize) ? null : fontSize;
  }