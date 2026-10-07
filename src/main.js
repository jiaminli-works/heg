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
const QUALITY_LEVELS = [
  { label: '低', quality: 0.65 },
  { label: '默认', quality: 0.92 },
  { label: '高', quality: 0.98 },
];
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
      image.onerror = () => reject(new Error('此浏览器无法直接解码该 HEIC 照片'));
      image.src = sourceUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    if (!context || !canvas.width || !canvas.height) {
      throw new Error('无法读取照片像素');
    }
    context.drawImage(image, 0, 0);
    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('浏览器无法生成 JPEG 图片')), 'image/jpeg', quality);
    });
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

async function convertHeicToJpeg(file, quality) {
  try {
    return await convertWithBrowserDecoder(file, quality);
  } catch (nativeError) {
    try {
      const { heicTo } = await import('heic-to');
      return await heicTo({ blob: file, type: 'image/jpeg', quality });
    } catch (decoderError) {
      const detail = decoderError instanceof Error ? decoderError.message : String(decoderError);
      const nativeDetail = nativeError instanceof Error ? nativeError.message : String(nativeError);
      throw new Error(`${detail}（浏览器解码：${nativeDetail}）`);
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
    buttonLabel.textContent = `正在转换 ${currentFileIndex} / ${selectedFiles.length}…`;
  } else if (pendingCount > 0 && selectedFiles.length > 0) {
    buttonLabel.textContent = pendingCount === selectedFiles.length
      ? `转换 ${selectedFiles.length} 张照片`
      : `转换剩余 ${pendingCount} 张`;
  } else if (selectedFiles.length === 0) {
    buttonLabel.textContent = '选择照片';
  } else if (completedCount > 0 && isDownloading) {
    buttonLabel.textContent = '正在准备下载…';
  } else if (completedCount > 0) {
    buttonLabel.textContent = '下载 JPEG';
  } else {
    buttonLabel.textContent = '转换为 JPEG';
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
    status.textContent = item.status === 'processing' ? '正在转换…'
      : item.status === 'done' ? '转换完成'
        : item.status === 'error' ? '转换失败，可重试' : '等待转换';
    info.append(name, status);

    row.append(info);
    if (item.status === 'done') {
      const download = document.createElement('a');
      download.className = 'file-download';
      download.href = item.outputUrl;
      download.download = item.outputName;
      download.textContent = '下载 JPEG';
      row.append(download);
    } else {
      const remove = document.createElement('button');
      remove.className = 'remove-button';
      remove.type = 'button';
      remove.dataset.fileId = item.id;
      remove.disabled = isConverting;
      remove.setAttribute('aria-label', `移除 ${item.file.name}`);
      remove.title = '移除照片';
      remove.textContent = '×';
      row.append(remove);
    }
    fileList.append(row);
  }
  updateControls();
}

function addFiles(files) {
  if (isConverting) {
    showMessage('转换完成后才能继续添加照片。', 'error');
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
    if (addedCount) notes.push(`已添加 ${addedCount} 张`);
    if (invalidCount) notes.push(`忽略 ${invalidCount} 个不支持的文件`);
    if (duplicateCount) notes.push(`忽略 ${duplicateCount} 个重复文件`);
    if (limitCount) notes.push(`最多选择 ${MAX_FILES} 张，超出部分未添加`);
    showMessage(notes.join('；') + '。', limitCount || invalidCount ? 'error' : 'info');
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
  showMessage(`已发起 ${completedFiles.length} 个 JPEG 下载，请按浏览器提示保存。`, 'success');
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
  const quality = QUALITY_LEVELS[selectedQuality].quality;

  for (let index = 0; index < pendingFiles.length; index += 1) {
    const item = pendingFiles[index];
    currentFileIndex = completedCount + failedCount + 1;
    item.status = 'processing';
    renderFiles();
    try {
      const jpgBlob = await convertHeicToJpeg(item.file, quality);
      item.outputUrl = URL.createObjectURL(jpgBlob);
      item.outputName = `${item.file.name.replace(/\.(heic|heif|jpe?g)$/i, '') || 'photo'}.jpeg`;
      item.status = 'done';
      completedCount += 1;
    } catch (error) {
      console.error(`HEIC conversion failed for ${item.file.name}:`, error);
      item.status = 'error';
      failedCount += 1;
    }
  }

  isConverting = false;
  convertButton.classList.remove('is-loading');
  renderFiles();
  if (failedCount) {
    showMessage(`已完成 ${completedCount} 张，${failedCount} 张失败；可以重试失败的照片。`, 'error');
  } else {
    showMessage(`已完成 ${completedCount} 张，点击下方按钮下载 JPEG。`, 'success');
  }
});

renderFiles();
