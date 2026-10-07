const messages = {
  'zh-CN': {
    lang: 'zh-CN', pageDescription: '在浏览器中快速将 iPhone HEIC 照片转换为 JPEG。', pageTitle: 'HEIC 转 JPEG', brandAria: 'heg 首页',
    eyebrow: '为 iPhone 照片准备', quality: '照片质量', qualityLabel: '转换后照片质量', qualityLow: '低', qualityDefault: '默认', qualityHigh: '高',
    reset: '清空并重新选择', footnote: '转换在你的设备上完成，照片不会上传到服务器。', choosePhotos: '选择照片',
    photosCount: '{count} 张照片', convertCount: '转换 {photos}', convertRemaining: '转换剩余 {photos}', converting: '正在转换 {current} / {total}…',
    preparingDownload: '正在准备下载…', downloadJpeg: '下载 JPEG', waiting: '等待转换', processing: '正在转换…', converted: '转换完成', failed: '转换失败，可重试', removePhoto: '移除照片：{name}',
    cannotAddWhileConverting: '转换完成后才能继续添加照片。', added: '已添加 {photos}', unsupported: '忽略 {count} 个不支持的文件', duplicates: '忽略 {count} 个重复文件',
    maxExceeded: '最多选择 {max} 张，超出部分未添加', noticeSeparator: '；', noticeEnd: '。',
    downloadStarted: '已发起 {count} 个 JPEG 下载，请按浏览器提示保存。', conversionPartial: '已完成 {done} 张，{failed} 张失败；可以重试失败的照片。', conversionSuccess: '已完成 {count} 张，点击下方按钮下载 JPEG。',
    cannotDecode: '此浏览器无法直接解码该 HEIC 照片', cannotReadPixels: '无法读取照片像素', cannotCreateJpeg: '浏览器无法生成 JPEG 图片', decoderError: '{detail}（浏览器解码：{nativeDetail}）',
  },
  'zh-TW': {
    lang: 'zh-Hant', pageDescription: '在瀏覽器中快速將 iPhone HEIC 照片轉換為 JPEG。', pageTitle: 'HEIC 轉 JPEG', brandAria: 'heg 首頁',
    eyebrow: '為 iPhone 照片而設', quality: '照片品質', qualityLabel: '轉換後照片品質', qualityLow: '低', qualityDefault: '標準', qualityHigh: '高',
    reset: '清空並重新選擇', footnote: '照片會在你的裝置上完成轉換，不會上傳至伺服器。', choosePhotos: '選擇照片',
    photosCount: '{count} 張照片', convertCount: '轉換 {photos}', convertRemaining: '轉換剩下 {photos}', converting: '正在轉換 {current} / {total}…',
    preparingDownload: '正在準備下載…', downloadJpeg: '下載 JPEG', waiting: '等待轉換', processing: '正在轉換…', converted: '轉換完成', failed: '轉換失敗，可再試一次', removePhoto: '移除照片：{name}',
    cannotAddWhileConverting: '轉換完成後才能繼續加入照片。', added: '已加入 {photos}', unsupported: '略過 {count} 個不支援的檔案', duplicates: '略過 {count} 個重複檔案',
    maxExceeded: '最多可選 {max} 張，超出的照片未加入', noticeSeparator: '；', noticeEnd: '。',
    downloadStarted: '已開始下載 {count} 個 JPEG，請依照瀏覽器提示儲存。', conversionPartial: '已完成 {done} 張，{failed} 張失敗；可重新轉換失敗的照片。', conversionSuccess: '已完成 {count} 張，點擊下方按鈕下載 JPEG。',
    cannotDecode: '此瀏覽器無法直接解碼這張 HEIC 照片', cannotReadPixels: '無法讀取照片資料', cannotCreateJpeg: '瀏覽器無法產生 JPEG 圖片', decoderError: '{detail}（瀏覽器解碼：{nativeDetail}）',
  },
  ja: {
    lang: 'ja', pageDescription: 'iPhoneのHEIC写真をブラウザ上でJPEGに変換できます。', pageTitle: 'HEICをJPEGに変換', brandAria: 'heg ホーム',
    eyebrow: 'iPhoneの写真をかんたん変換', quality: '画質', qualityLabel: '変換後の画質', qualityLow: '低', qualityDefault: '標準', qualityHigh: '高',
    reset: '写真を選び直す', footnote: '写真は端末内で変換され、サーバーにアップロードされません。', choosePhotos: '写真を選ぶ',
    photosCount: '写真{count}枚', convertCount: '{count}枚を変換', convertRemaining: '残り{count}枚を変換', converting: '変換中 {current} / {total}…',
    preparingDownload: 'ダウンロードを準備中…', downloadJpeg: 'JPEGをダウンロード', waiting: '変換待ち', processing: '変換中…', converted: '変換完了', failed: '変換できませんでした。再試行できます', removePhoto: '写真を削除：{name}',
    cannotAddWhileConverting: '変換が終わるまで写真を追加できません。', added: '{count}枚の写真を追加しました', unsupported: '未対応のファイルを{count}件スキップしました', duplicates: '重複したファイルを{count}件スキップしました',
    maxExceeded: '写真は最大{max}枚まで選択できます。超過分は追加されませんでした', noticeSeparator: '。', noticeEnd: '。',
    downloadStarted: 'JPEG画像{count}件のダウンロードを開始しました。ブラウザの案内に従って保存してください。', conversionPartial: '{done}枚を変換しました。{failed}枚は変換できませんでした。失敗した写真は再試行できます。', conversionSuccess: '{count}枚の変換が完了しました。下のボタンからJPEGを保存できます。',
    cannotDecode: 'このブラウザではHEIC写真を直接読み込めません', cannotReadPixels: '写真データを読み取れません', cannotCreateJpeg: 'ブラウザでJPEG画像を作成できません', decoderError: '{detail}（ブラウザでの読み込み：{nativeDetail}）',
  },
  en: {
    lang: 'en', pageDescription: 'Convert iPhone HEIC photos to JPEG right in your browser.', pageTitle: 'HEIC to JPEG', brandAria: 'heg home',
    eyebrow: 'Made for iPhone photos', quality: 'Image quality', qualityLabel: 'Output image quality', qualityLow: 'Low', qualityDefault: 'Default', qualityHigh: 'High',
    reset: 'Clear and choose again', footnote: 'Photos are converted on your device and are never uploaded to a server.', choosePhotos: 'Choose photos',
    photosCount: '{count} {unit}', convertCount: 'Convert {photos}', convertRemaining: 'Convert remaining {photos}', converting: 'Converting {current} / {total}…',
    preparingDownload: 'Preparing downloads…', downloadJpeg: 'Download JPEG', waiting: 'Ready to convert', processing: 'Converting…', converted: 'Converted', failed: 'Conversion failed. Try again', removePhoto: 'Remove {name}',
    cannotAddWhileConverting: 'Wait for conversion to finish before adding more photos.', added: 'Added {photos}', unsupported: 'Skipped {files}', duplicates: 'Skipped {files}',
    maxExceeded: 'You can choose up to {max} photos. Extra files were not added.', noticeSeparator: ' ', noticeEnd: '',
    downloadStarted: 'Download started for {downloads}. Follow your browser prompts to save them.', conversionPartial: 'Converted {donePhotos}; {failedPhotos} failed. You can retry the failed photos.', conversionSuccess: 'Converted {photos}. Use the button below to download your JPEGs.',
    cannotDecode: 'This browser cannot decode this HEIC photo directly', cannotReadPixels: 'Could not read the photo data', cannotCreateJpeg: 'The browser could not create a JPEG image', decoderError: '{detail} (browser decoding: {nativeDetail})',
  },
  ko: {
    lang: 'ko', pageDescription: 'iPhone HEIC 사진을 브라우저에서 바로 JPEG로 변환하세요.', pageTitle: 'HEIC를 JPEG로 변환', brandAria: 'heg 홈',
    eyebrow: 'iPhone 사진을 간편하게 변환', quality: '사진 화질', qualityLabel: '변환할 사진 화질', qualityLow: '낮음', qualityDefault: '기본', qualityHigh: '높음',
    reset: '사진 비우고 다시 선택', footnote: '사진은 기기에서 변환되며 서버에 업로드되지 않습니다.', choosePhotos: '사진 선택',
    photosCount: '사진 {count}장', convertCount: '사진 {count}장 변환', convertRemaining: '남은 사진 {count}장 변환', converting: '변환 중 {current} / {total}…',
    preparingDownload: '다운로드 준비 중…', downloadJpeg: 'JPEG 다운로드', waiting: '변환 대기 중', processing: '변환 중…', converted: '변환 완료', failed: '변환 실패. 다시 시도할 수 있어요', removePhoto: '{name} 삭제',
    cannotAddWhileConverting: '변환이 끝난 뒤 사진을 추가할 수 있어요.', added: '사진 {count}장 추가됨', unsupported: '지원하지 않는 파일 {count}개 제외됨', duplicates: '중복 파일 {count}개 제외됨',
    maxExceeded: '사진은 최대 {max}장까지 선택할 수 있어요. 초과한 파일은 추가되지 않았어요.', noticeSeparator: ' · ', noticeEnd: '',
    downloadStarted: 'JPEG 파일 {count}개 다운로드를 시작했어요. 브라우저 안내에 따라 저장해 주세요.', conversionPartial: '{done}장 변환 완료, {failed}장은 변환하지 못했어요. 실패한 사진은 다시 시도할 수 있어요.', conversionSuccess: '사진 {count}장 변환 완료. 아래 버튼을 눌러 JPEG 파일을 저장하세요.',
    cannotDecode: '이 브라우저에서 HEIC 사진을 바로 읽을 수 없어요', cannotReadPixels: '사진 데이터를 읽을 수 없어요', cannotCreateJpeg: '브라우저에서 JPEG 이미지를 만들 수 없어요', decoderError: '{detail} (브라우저 디코딩: {nativeDetail})',
  },
};

function localeFor(language) {
  const normalized = language.toLowerCase();
  if (normalized.startsWith('zh')) {
    return /(?:tw|hk|mo|hant)/i.test(language) ? 'zh-TW' : 'zh-CN';
  }
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('en')) return 'en';
  if (normalized.startsWith('ko')) return 'ko';
  return null;
}

const preferredLanguages = navigator.languages?.length ? navigator.languages : [navigator.language || 'zh-CN'];
export const localeKey = preferredLanguages.map(localeFor).find(Boolean) || 'en';
const dictionary = messages[localeKey];

export function t(key, values = {}) {
  const template = dictionary[key] ?? messages['zh-CN'][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => String(values[name] ?? match));
}

export function applyTranslations() {
  document.documentElement.lang = dictionary.lang;
  document.title = `heg · ${dictionary.pageTitle}`;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = t(element.dataset.i18n);
    const attribute = element.dataset.i18nAttr;
    if (attribute) element.setAttribute(attribute, value);
    else element.textContent = value;
  });
}

export function countPhotos(count) {
  const unit = localeKey === 'en' ? (count === 1 ? 'photo' : 'photos') : '';
  return t('photosCount', { count, unit });
}

export function formatFiles(count, kind) {
  if (localeKey === 'en') {
    const label = kind === 'unsupported' ? 'unsupported file' : 'duplicate file';
    return `${count} ${label}${count === 1 ? '' : 's'}`;
  }
  return '';
}

export function formatDownloads(count) {
  if (localeKey === 'en') return `${count} JPEG download${count === 1 ? '' : 's'}`;
  return '';
}
