


export function getBrightness(rgbColor) {
    // Remove any whitespace and convert the color string to lowercase
    rgbColor = rgbColor.replace(/\s+/g, '').toLowerCase();

    // Check if the color string starts with "rgb(" and ends with ")"
    if (rgbColor.startsWith("#")) {
    rgbColor = rgbColor.substring(1, 7);
    const red = parseInt(rgbColor.substring(0, 2), 16);
    const green = parseInt(rgbColor.substring(2, 4), 16);
    const blue = parseInt(rgbColor.substring(4, 6), 16);

    const brightness = (red + green + blue) / 3;

    return brightness;
    } else {
    // If the input is not a valid RGB color, return null or an error value
    return null;
    }
}