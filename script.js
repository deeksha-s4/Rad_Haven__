// Add your JavaScript code here
const URL = "https://teachablemachine.withgoogle.com/models/PwRFbVCZ6/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");

    // Remove existing buttons
    labelContainer.innerHTML = '';

    // Create buttons for each class
    for (let i = 0; i < maxPredictions; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.style.background = `linear-gradient(90deg, red, yellow, green)`;
        button.innerText = model.getClassLabels()[i];
        button.onclick = () => onClassButtonClick(i);
        labelContainer.appendChild(button);
    }
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        await updateButton(i, prediction[i].probability.toFixed(2));
    }
}

async function updateButton(index, classPrediction) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1000 milliseconds (1 second) delay

    // Update button text with class probability and apply gradient color
    labelContainer.childNodes[index].style.background = `linear-gradient(90deg, #FFA07A, #FFD700, #7FFF00)`;
    labelContainer.childNodes[index].innerText = model.getClassLabels()[index] + ": " + classPrediction;
}

// Handle button click for each class
function onClassButtonClick(index) {
    // Perform actions or display information based on the selected class
    console.log("Button clicked for class:", model.getClassLabels()[index]);
}
