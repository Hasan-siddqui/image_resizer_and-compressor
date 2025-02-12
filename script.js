let originalImg;
        let aspectRatio;
        const dropArea = document.getElementById('dropArea');
        const imageInput = document.getElementById('imageInput');
        const previewImg = document.getElementById('previewImg');
        const widthInput = document.getElementById('widthInput');
        const heightInput = document.getElementById('heightInput');
        const aspectRatioLock = document.getElementById('aspectRatioLock');
        const fileTypeSelect = document.getElementById('fileTypeSelect');
        const qualityInput = document.getElementById('qualityInput');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('errorMessage');

        // Drag and Drop Handling
        dropArea.addEventListener('click', () => imageInput.click());
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.style.background = 'rgba(0, 123, 255, 0.2)';
        });
        dropArea.addEventListener('dragleave', () => {
            dropArea.style.background = 'transparent';
        });
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.style.background = 'transparent';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                loadImage(file);
            } else {
                showError('Please upload a valid image file.');
            }
        });

        // File Input Handling
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                loadImage(file);
            }
        });

        // Load Image Function
        function loadImage(file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                originalImg = new Image();
                originalImg.src = e.target.result;
                originalImg.onload = function () {
                    aspectRatio = originalImg.width / originalImg.height;
                    previewImg.src = originalImg.src;
                    previewImg.style.display = 'block';
                    widthInput.value = originalImg.width;
                    heightInput.value = originalImg.height;
                    clearError();
                }
            }
            reader.readAsDataURL(file);
        }

        // Aspect Ratio Lock
        widthInput.addEventListener('input', () => {
            if (aspectRatioLock.checked) {
                heightInput.value = Math.round(widthInput.value / aspectRatio);
            }
        });

        heightInput.addEventListener('input', () => {
            if (aspectRatioLock.checked) {
                widthInput.value = Math.round(heightInput.value * aspectRatio);
            }
        });

        // Apply Resize and Compression
        function applyResize() {
            const width = parseInt(widthInput.value) || originalImg.width;
            const height = parseInt(heightInput.value) || originalImg.height;
            const quality = parseFloat(qualityInput.value);

            if (quality < 0.1 || quality > 1.0) {
                showError('Quality must be between 0.1 and 1.0.');
                return;
            }

            loadingSpinner.style.display = 'block';
            clearError();

            setTimeout(() => {
                drawImage(width, height, quality);
                loadingSpinner.style.display = 'none';
            }, 100);
        }

        // Draw Image on Canvas
        function drawImage(width, height, quality) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(originalImg, 0, 0, width, height);

            const fileType = fileTypeSelect.value;
            const compressedDataUrl = canvas.toDataURL(fileType, quality);

            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = compressedDataUrl;
            downloadLink.download = `resized_compressed_image.${fileType.split('/')[1]}`;
            downloadLink.style.display = 'block';
        }

        // Error Handling
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }

        function clearError() {
            errorMessage.style.display = 'none';
        }