const canvas = document.getElementById('preview-canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('upload-area');
const filmFilter = document.getElementById('film-filter');
const brightnessInput = document.getElementById('brightness');
const contrastInput = document.getElementById('contrast');
const saturationInput = document.getElementById('saturation');
const exportFormat = document.getElementById('export-format');
const exportQuality = document.getElementById('export-quality');
const exportScale = document.getElementById('export-scale');
const downloadBtn = document.getElementById('download-btn');

let img = new Image();
let imgLoaded = false;

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = e => {
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            imgLoaded = true;
            updateCanvas();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

fileInput.addEventListener('change', e => {
    if (e.target.files && e.target.files[0]) {
        loadImage(e.target.files[0]);
    }
});

dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        loadImage(e.dataTransfer.files[0]);
    }
});

function getFilmFilterString() {
    switch (filmFilter.value) {
        case 'vintage':
            return 'sepia(0.4) contrast(1.2) saturate(1.4)';
        case 'cinema':
            return 'contrast(1.3) saturate(1.6)';
        case 'noir':
            return 'grayscale(1) contrast(1.2)';
        default:
            return '';
    }
}

function updateCanvas() {
    if (!imgLoaded) return;
    const filterString =
        `brightness(${brightnessInput.value}) ` +
        `contrast(${contrastInput.value}) ` +
        `saturate(${saturationInput.value}) ` +
        getFilmFilterString();

    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}

[brightnessInput, contrastInput, saturationInput, filmFilter].forEach(el => {
    el.addEventListener('input', updateCanvas);
});

downloadBtn.addEventListener('click', () => {
    if (!imgLoaded) return;
    const scale = parseFloat(exportScale.value) || 1;
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = canvas.width * scale;
    tmpCanvas.height = canvas.height * scale;
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.filter = ctx.filter;
    tmpCtx.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height);
    const dataURL = tmpCanvas.toDataURL(exportFormat.value, parseFloat(exportQuality.value));
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `edited.${exportFormat.value.split('/')[1]}`;
    link.click();
});
