// URL 파라미터 및 전역 변수 설정
const params = new URLSearchParams(window.location.search);
let regionParam = params.get("region") || "지역";
const postIdParam = params.get("postId");
const editIndex = params.get("edit");

// 주요 DOM 요소 선택
const pageTitleEl = document.getElementById("page-title");
const baseChipEl = document.getElementById("base-chip");
const regionGroupEl = document.querySelector(".region-group");
const addRegionBtn = document.getElementById("add-region-btn");

const titleInput = document.getElementById("title-input");
const photoInput = document.getElementById("photo-input");
const photoPlaceholder = document.getElementById("photo-placeholder");
const photoSlider = document.getElementById("photo-slider");
const photoAddBtn = document.getElementById("photo-add-btn");

const emojiToggle = document.getElementById("emoji-toggle");
const emojiPicker = document.getElementById("emoji-picker");
const emojiDisplay = document.getElementById("emoji-display");
const emojiGuide = document.querySelector(".emoji-guide");

const memoInput = document.getElementById("memo-input");
const tempSaveBtn = document.getElementById("temp-save-btn");
const saveBtn = document.getElementById("save-btn");
const tempListBtn = document.getElementById("temp-list-btn");

// 상태 변수 초기화
let selectedDistricts = [];
let existingPhotos = [];
let currentEmoji = "";
let restoredFromStorage = false;

// 1) 상위 지역 표시
if (regionParam && regionParam !== '지역') {
    baseChipEl.textContent = regionParam;
    baseChipEl.classList.add('visible');
}

// 2) 세부 지역 칩 렌더링
function renderDistrictChips() {
  regionGroupEl.querySelectorAll(".region-chip.sub").forEach(el => el.remove());
  selectedDistricts.forEach(district => {
    const tag = document.createElement("div");
    tag.className = "region-chip sub";
    const textSpan = document.createElement("span");
    textSpan.textContent = district;
    const removeIcon = document.createElement("span");
    removeIcon.className = "remove-chip";
    removeIcon.innerHTML = "&times;";
    removeIcon.onclick = (e) => {
      e.stopPropagation();
      selectedDistricts = selectedDistricts.filter(d => d !== district);
      renderDistrictChips();
    };
    tag.appendChild(textSpan);
    tag.appendChild(removeIcon);
    regionGroupEl.insertBefore(tag, addRegionBtn);
  });
  addRegionBtn.style.display = selectedDistricts.length >= 4 ? "none" : "inline-flex";
}

// 3) 로컬스토리지 임시 복원
{
  const saved = JSON.parse(localStorage.getItem("selectedDistricts") || "null");
  if (Array.isArray(saved)) {
    selectedDistricts = saved.slice(0, 4);
    localStorage.removeItem("selectedDistricts");
    renderDistrictChips();
    restoredFromStorage = true;
  }

  const photos = JSON.parse(localStorage.getItem("tempPhotos") || "null");
  if (Array.isArray(photos) && photos.length) {
    existingPhotos = photos;
    renderPhotos(existingPhotos);
    localStorage.removeItem("tempPhotos");
    restoredFromStorage = true;
  }

  const title = localStorage.getItem("tempTitle");
  if (title) { titleInput.value = title; localStorage.removeItem("tempTitle"); restoredFromStorage = true; }

  const emoji = localStorage.getItem("tempEmoji");
  if (emoji) { currentEmoji = emoji; emojiDisplay.textContent = emoji; localStorage.removeItem("tempEmoji"); restoredFromStorage = true; }

  const memo = localStorage.getItem("tempMemo");
  if (memo) { memoInput.value = memo; localStorage.removeItem("tempMemo"); restoredFromStorage = true; }
}

// 4) 수정 모드 처리
if (postIdParam) {
  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  const target = allPosts.find(p => p.id === postIdParam);
  if (target) {
    regionParam = target.region;
    baseChipEl.textContent = regionParam;
    titleInput.value = target.title;
    selectedDistricts = [...target.districts];
    existingPhotos = [...target.photos];
    renderDistrictChips();
    if (existingPhotos.length) renderPhotos(existingPhotos);
    currentEmoji = target.emoji;
    emojiDisplay.textContent = currentEmoji;
    memoInput.value = target.memo;
  }
} else if (editIndex !== null) {
  const tempData = JSON.parse(localStorage.getItem("editRecord") || "null");
  if (tempData) {
    regionParam = tempData.region || regionParam;
    baseChipEl.textContent = regionParam;
    titleInput.value = tempData.title || "";
    selectedDistricts = Array.isArray(tempData.tags) ? [...tempData.tags] : [];
    existingPhotos = Array.isArray(tempData.photos) ? [...tempData.photos] : [];
    renderDistrictChips();
    if (existingPhotos.length) renderPhotos(existingPhotos);
    currentEmoji = tempData.emoji || "";
    emojiDisplay.textContent = currentEmoji;
    memoInput.value = tempData.memo || "";
  }
}

// 5) 지역 선택 버튼 클릭 시
addRegionBtn.onclick = () => {
  localStorage.setItem("tempPhotos", JSON.stringify(existingPhotos));
  localStorage.setItem("tempDistricts", JSON.stringify(selectedDistricts));
  localStorage.setItem("tempTitle", titleInput.value);
  localStorage.setItem("tempEmoji", currentEmoji);
  localStorage.setItem("tempMemo", memoInput.value);

  let url = '/travelPost/selectLocal';
  let params = [];

  if (postIdParam) {
    params.push(`selected=${encodeURIComponent(JSON.stringify(selectedDistricts))}`);
    params.push(`postId=${encodeURIComponent(postIdParam)}`);
  } else if (editIndex !== null) {
    params.push(`selected=${encodeURIComponent(JSON.stringify(selectedDistricts))}`);
    params.push(`edit=${encodeURIComponent(editIndex)}`);
  }

  if (params.length > 0) {
    url += '?' + params.join('&');
  }

  location.href = url;
};

// 사진 업로드 렌더링
function readFileAsDataURL(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

function renderPhotos(dataURLs) {
  photoPlaceholder.style.display = "none";
  photoSlider.style.display = "flex";
  photoSlider.innerHTML = "";
  dataURLs.forEach((url, idx) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    const img = document.createElement("img");
    img.src = url;
    card.appendChild(img);
    const pageIndicator = document.createElement("div");
    pageIndicator.className = "page-indicator";
    pageIndicator.textContent = `${idx + 1}/${dataURLs.length}`;
    card.appendChild(pageIndicator);
    const replaceBtn = document.createElement("div");
    replaceBtn.className = "btn-replace";
    replaceBtn.textContent = "✎";
    replaceBtn.onclick = async () => {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = async e => {
        const f = e.target.files[0];
        if (f) {
          existingPhotos[idx] = await readFileAsDataURL(f);
          renderPhotos(existingPhotos);
        }
      };
      fileInput.click();
    };
    const deleteBtn = document.createElement("div");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = () => {
      existingPhotos.splice(idx, 1);
      if (existingPhotos.length) renderPhotos(existingPhotos);
      else {
        photoSlider.style.display = "none";
        photoPlaceholder.style.display = "flex";
      }
    };
    card.append(replaceBtn, deleteBtn);
    photoSlider.appendChild(card);
  });
}

photoAddBtn.onclick = () => photoInput.click();

photoInput.addEventListener("change", async function () {
  const files = Array.from(this.files);
  const urls = await Promise.all(files.map(file => readFileAsDataURL(file)));
  existingPhotos.push(...urls);
  renderPhotos(existingPhotos);
  this.value = "";
});

// 이모지 토글 & 선택
emojiToggle.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "flex" ? "none" : "flex";
});
document.addEventListener("click", e => {
  if (!emojiPicker.contains(e.target) && !emojiToggle.contains(e.target)) emojiPicker.style.display = "none";
});
document.querySelectorAll(".emoji-option").forEach(option => {
  option.addEventListener("click", () => {
    currentEmoji = option.textContent;
    emojiDisplay.textContent = currentEmoji;
    emojiPicker.style.display = "none";
    emojiGuide.style.display = "none";
  });
});

// 저장
saveBtn.onclick = () => {
  if (!titleInput.value.trim()) return alert("제목을 입력해주세요.");
  if (!existingPhotos.length) return alert("사진을 추가해주세요.");
  if (!currentEmoji) return alert("이모지를 선택해주세요.");
  if (!selectedDistricts.length) return alert("세부 지역을 선택해주세요.");

  const now = new Date().toISOString();
  const postObj = {
    id: postIdParam || Date.now().toString(),
    region: regionParam,
    districts: [...selectedDistricts],
    title: titleInput.value.trim(),
    photos: [...existingPhotos],
    emoji: currentEmoji,
    memo: memoInput.value.trim(),
    createdAt: postIdParam ? JSON.parse(localStorage.getItem("posts")).find(p => p.id === postIdParam).createdAt : now
  };

  const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
  if (postIdParam) {
    const idx = allPosts.findIndex(p => p.id === postIdParam);
    if (idx > -1) allPosts[idx] = postObj;
  } else {
    allPosts.push(postObj);
  }

  localStorage.setItem("posts", JSON.stringify(allPosts));

  if (editIndex !== null) {
    const temp = JSON.parse(localStorage.getItem("tempRecords") || "[]");
    temp.splice(editIndex, 1);
    localStorage.setItem("tempRecords", JSON.stringify(temp));
    localStorage.removeItem("editRecord");
  }

  location.href = `../Detail/detail.html?region=${encodeURIComponent(regionParam)}`;
};

// 임시 저장
tempSaveBtn.onclick = () => {
  const temp = {
    region: regionParam,
    title: titleInput.value.trim(),
    tags: [...selectedDistricts],
    photos: [...existingPhotos],
    emoji: currentEmoji,
    memo: memoInput.value.trim()
  };
  const list = JSON.parse(localStorage.getItem("tempRecords") || "[]");
  if (editIndex !== null) list[editIndex] = temp;
  else list.push(temp);
  localStorage.setItem("tempRecords", JSON.stringify(list));
  localStorage.removeItem("editRecord");
  location.href = '/travelPost/Temp/';
};

// 임시 목록 버튼
tempListBtn.onclick = () => location.href = '/travelPost/Temp/';

// 초기 이모지 안내 숨김
if (currentEmoji) emojiGuide.style.display = 'none';
