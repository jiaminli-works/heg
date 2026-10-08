import { applyTranslations, countPhotos, formatDownloads, formatFiles, t } from './i18n.js';

applyTranslations();

const input = document.querySelector('#file-input');
const converter = document.querySelector('.converter');
const fileList = document.querySelector('#file-list');
const convertButton = document.querySelector('#convert-button');
const buttonLabel = document.querySelector('#button-label');
const message = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');
const qualitySlider = document.querySelector('#quality-slider');
const qualityControl = document.querySelector('#quality-control');
const qualityThumb = qualitySlider.querySelector('.quality-thumb');

const MAX_FILES = 5;
let selectedQuality = 1;
const QUALITY_LEVELS = [0.65, 0.92, 0.98];
let selectedFiles = [];
let isConverting = false;
let isDownloading = false;
let currentFileIndex = 0;

function downloadFile(item) {
  const link = document.createElement('a');
  link.href = item.outputUrl;
  link.download = item.outputName;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
}

function isSupportedPhoto(file) {
  return /\.(heic|heif|jpe?g)$/i.test(file.name)
    || /image\/(heic|heif|jpeg)/i.test(file.type);
}

function shortenFileName(fileName, maxLength = 25) {
  const characters = Array.from(fileName);
  if (characters.length <= maxLength) return fileName;

  const extensionMatch = fileName.match(/(\.[^.]+)$/);
  const extension = extensionMatch?.[0] ?? '';
  const stem = extension ? fileName.slice(0, -extension.length) : fileName;
  const visibleStemLength = Math.max(1, maxLength - Array.from(extension).length - 1);
  return `${Array.from(stem).slice(0, visibleStemLength).join('')}…${extension}`;
}

async function convertWithBrowserDecoder(file, quality) {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error(t('cannotDecode')));
      image.src = sourceUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context || !canvas.width || !canvas.height) {
      throw new Error(t('cannotReadPixels'));
    }
    context.drawImage(image, 0, 0);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error(t('cannotCreateJpeg'))), 'image/jpeg', quality);
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function convertHeifToJpeg(file, quality) {
  try {
    return await convertWithBrowserDecoder(file, quality);
  } catch (nativeError) {
    try {
      const { heicTo } = await import('heic-to');
      return await heicTo({ blob: file, type: 'image/jpeg', quality });
    } catch (decoderError) {
      const detail = decoderError instanceof Error ? decoderError.message : String(decoderError);
      const nativeDetail = nativeError instanceof Error ? nativeError.message : String(nativeError);
      throw new Error(t('decoderError', { detail, nativeDetail }));
    }
  }
}

function showMessage(text, kind) {
  message.textContent = text;
  message.className = `message ${kind}`;
  message.hidden = false;
}

function setQuality(index) {
  selectedQuality = Math.max(0, Math.min(QUALITY_LEVELS.length - 1, index));
  const options = [...qualitySlider.querySelectorAll('[data-quality]')];
  options.forEach((option, optionIndex) => {
    const selected = optionIndex === selectedQuality;
    option.setAttribute('aria-checked', String(selected));
    option.tabIndex = selected ? 0 : -1;
    option.classList.toggle('is-selected', selected);
  });
  positionQualityThumb();
}

function positionQualityThumb() {
  if (qualityControl.hidden) return;
  const options = [...qualitySlider.querySelectorAll('[data-quality]')];
  const offset = options[selectedQuality].offsetLeft - options[0].offsetLeft;
  qualityThumb.style.transform = `translateX(${offset}px)`;
}

function updateControls() {
  const pendingCount = selectedFiles.filter((item) => item.status !== 'done').length;
  const completedCount = selectedFiles.filter((item) => item.status === 'done').length;
  converter.classList.toggle('has-files', selectedFiles.length > 0);
  fileList.hidden = selectedFiles.length === 0;
  qualityControl.hidden = selectedFiles.length === 0 || pendingCount === 0;
  if (!qualityControl.hidden) requestAnimationFrame(positionQualityThumb);
  convertButton.hidden = false;
  convertButton.disabled = isConverting || isDownloading;
  resetButton.hidden = selectedFiles.length === 0 || isConverting;

  if (isConverting) {
    buttonLabel.textContent = t('converting', { current: currentFileIndex, total: selectedFiles.length });
  } else if (pendingCount > 0 && selectedFiles.length > 0) {
    buttonLabel.textContent = pendingCount === selectedFiles.length
      ? t('convertCount', { count: selectedFiles.length, photos: countPhotos(selectedFiles.length) })
      : t('convertRemaining', { count: pendingCount, photos: countPhotos(pendingCount) });
  } else if (selectedFiles.length === 0) {
    buttonLabel.textContent = t('choosePhotos');
  } else if (completedCount > 0 && isDownloading) {
    buttonLabel.textContent = t('preparingDownload');
  } else if (completedCount > 0) {
    buttonLabel.textContent = t('downloadJpeg');
  } else {
    buttonLabel.textContent = t('pageTitle');
  }
}

function renderFiles() {
  fileList.replaceChildren();
  for (const item of selectedFiles) {
    const row = document.createElement('div');
    row.className = 'file-row';
    row.setAttribute('role', 'listitem');

    const info = document.createElement('div');
    info.className = 'file-info';
    const name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = shortenFileName(item.file.name);
    name.title = item.file.name;
    const status = document.createElement('span');
    status.className = `file-status ${item.status}`;
    status.textContent = item.status === 'processing' ? t('processing')
      : item.status === 'done' ? t('converted')
        : item.status === 'error' ? t('failed') : t('waiting');
    info.append(name, status);

    row.append(info);
    if (item.status === 'done') {
      const download = document.createElement('a');
      download.className = 'file-download';
      download.href = item.outputUrl;
      download.download = item.outputName;
      download.textContent = t('downloadJpeg');
      row.append(download);
    } else {
      const remove = document.createElement('button');
      remove.className = 'remove-button';
      remove.type = 'button';
      remove.dataset.fileId = item.id;
      remove.disabled = isConverting;
      remove.setAttribute('aria-label', t('removePhoto', { name: item.file.name }));
      remove.title = t('removePhoto', { name: item.file.name });
      remove.textContent = '×';
      row.append(remove);
    }
    fileList.append(row);
  }
  updateControls();
}

function addFiles(files) {
  if (isConverting) {
    showMessage(t('cannotAddWhileConverting'), 'error');
    return;
  }

  const incoming = Array.from(files);
  if (!incoming.length) return;
  let invalidCount = 0;
  let duplicateCount = 0;
  let limitCount = 0;
  let addedCount = 0;

  for (const file of incoming) {
    if (!isSupportedPhoto(file)) {
      invalidCount += 1;
      continue;
    }
    const duplicate = selectedFiles.some((item) => item.file.name === file.name
      && item.file.size === file.size && item.file.lastModified === file.lastModified);
    if (duplicate) {
      duplicateCount += 1;
      continue;
    }
    if (selectedFiles.length >= MAX_FILES) {
      limitCount += 1;
      continue;
    }
    const outputName = `${file.name.replace(/\.(heic|heif|jpe?g)$/i, '') || 'photo'}.jpeg`;
    selectedFiles.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      status: 'ready',
      outputUrl: null,
      outputName: null,
    });
    addedCount += 1;
  }

  input.value = '';
  renderFiles();
  if (invalidCount || duplicateCount || limitCount) {
    const notes = [];
    if (addedCount) notes.push(t('added', { count: addedCount, photos: countPhotos(addedCount) }));
    if (invalidCount) notes.push(t('unsupported', { count: invalidCount, files: formatFiles(invalidCount, 'unsupported') }));
    if (duplicateCount) notes.push(t('duplicates', { count: duplicateCount, files: formatFiles(duplicateCount, 'duplicate') }));
    if (limitCount) notes.push(t('maxExceeded', { max: MAX_FILES }));
    showMessage(notes.join(t('noticeSeparator')) + t('noticeEnd'), limitCount || invalidCount ? 'error' : 'info');
  } else if (addedCount) {
    message.hidden = true;
  }
}

function reset() {
  if (isConverting) return;
  for (const item of selectedFiles) {
    if (item.outputUrl) URL.revokeObjectURL(item.outputUrl);
  }
  selectedFiles = [];
  input.value = '';
  message.hidden = true;
  renderFiles();
}

input.addEventListener('change', () => addFiles(input.files ?? []));
fileList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-file-id]');
  if (!button || isConverting) return;
  const index = selectedFiles.findIndex((item) => item.id === button.dataset.fileId);
  if (index < 0) return;
  const [removed] = selectedFiles.splice(index, 1);
  if (removed.outputUrl) URL.revokeObjectURL(removed.outputUrl);
  renderFiles();
});
resetButton.addEventListener('click', reset);
qualitySlider.addEventListener('click', (event) => {
  const option = event.target.closest('[data-quality]');
  if (option) setQuality(Number(option.dataset.quality));
});
window.addEventListener('resize', positionQualityThumb);

async function downloadCompletedFiles() {
  const completedFiles = selectedFiles.filter((item) => item.status === 'done');
  if (!completedFiles.length || isConverting || isDownloading) return;

  isDownloading = true;
  renderFiles();
  for (let index = 0; index < completedFiles.length; index += 1) {
    const item = completedFiles[index];
    downloadFile(item);
    if (index < completedFiles.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 900));
    }
  }
  isDownloading = false;
  renderFiles();
  showMessage(t('downloadStarted', { count: completedFiles.length, downloads: formatDownloads(completedFiles.length) }), 'success');
}

convertButton.addEventListener('click', async () => {
  if (isConverting || isDownloading) return;
  if (selectedFiles.length === 0) {
    input.click();
    return;
  }
  if (!selectedFiles.some((item) => item.status !== 'done')) {
    await downloadCompletedFiles();
    return;
  }
  isConverting = true;
  convertButton.disabled = true;
  convertButton.classList.add('is-loading');
  message.hidden = true;
  const pendingFiles = selectedFiles.filter((item) => item.status !== 'done');
  let completedCount = selectedFiles.filter((item) => item.status === 'done').length;
  let failedCount = 0;
  const quality = QUALITY_LEVELS[selectedQuality];

  for (let index = 0; index < pendingFiles.length; index += 1) {
    const item = pendingFiles[index];
    currentFileIndex = completedCount + failedCount + 1;
    item.status = 'processing';
    renderFiles();
    try {
      const jpgBlob = await convertHeifToJpeg(item.file, quality);
      item.outputUrl = URL.createObjectURL(jpgBlob);
      item.outputName = `${item.file.name.replace(/\.(heic|heif|jpe?g)$/i, '') || 'photo'}.jpeg`;
      item.status = 'done';
      completedCount += 1;
    } catch (error) {
      console.error(`HEIF conversion failed for ${item.file.name}:`, error);
      item.status = 'error';
      failedCount += 1;
    }
  }

  isConverting = false;
  convertButton.classList.remove('is-loading');
  renderFiles();
  if (failedCount) {
    showMessage(t('conversionPartial', { done: completedCount, failed: failedCount, donePhotos: countPhotos(completedCount), failedPhotos: countPhotos(failedCount) }), 'error');
  } else {
    showMessage(t('conversionSuccess', { count: completedCount, photos: countPhotos(completedCount) }), 'success');
  }
});

renderFiles();
