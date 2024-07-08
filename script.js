function previewImage(event) {
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.style.display = 'block';
    uploadedImage.src = URL.createObjectURL(event.target.files[0]);
}

async function classifyImage() {
    const imageUpload = document.getElementById('imageUpload');
    const resultDiv = document.getElementById('result');

    if (imageUpload.files.length > 0) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = async function(event) {
            img.src = event.target.result;
            img.onload = async function() {
                const tensor = tf.browser.fromPixels(img)
                    .resizeNearestNeighbor([136, 102])
                    .expandDims()
                    .toFloat()
                    .div(255);

                const model = await tf.loadLayersModel('tfjs_model/model.json');
                const predictions = model.predict(tensor);
                const prediction = predictions.dataSync();

                const maxIndex = prediction.indexOf(Math.max(...prediction));

                let className;
                switch (maxIndex) {
                    case 0:
                        className = 'This is a picture of Boots';
                        break;
                    case 1:
                        className = 'this is the picture of the sandals';
                        break;
                    case 2:
                        className = 'this is the picture of the shoes';
                        break;
                    default:
                        className = 'Unknown';
                        break;
                }

                resultDiv.innerHTML = `Prediction: ${className}`;
            }
        }
        reader.readAsDataURL(imageUpload.files[0]);
    } else {
        resultDiv.innerHTML = 'Please upload an image.';
    }
}
