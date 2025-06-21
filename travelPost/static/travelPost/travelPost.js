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
  // 유진추가

  //광역시 chip 추가
  const tempRegion = localStorage.getItem("tempRegion");
  if (tempRegion) {
    const mainChip = document.createElement("div");
    mainChip.className = "region-chip main";
    mainChip.textContent = tempRegion;
    regionGroupEl.insertBefore(mainChip, addRegionBtn);
  }


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

// CSRF 토큰 꺼내기 (이 함수 먼저 정의해두세요)
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}


// 저장
saveBtn.onclick = async () => {

  if (!titleInput.value.trim()) return alert("제목을 입력해주세요.");
  if (!existingPhotos.length) return alert("사진을 추가해주세요.");
  if (!currentEmoji) return alert("이모지를 선택해주세요.");
  if (!selectedDistricts.length) return alert("세부 지역을 선택해주세요.");

  try {
    const response = await fetch("/travelPost/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: new URLSearchParams({
        title: titleInput.value.trim(),
        body: memoInput.value.trim(),
        icon: currentEmoji,
        status: "true"
      })
    });

    if (response.redirected) {
      location.href = response.url;
    } else {
      const result = await response.text(); // or response.json()
      console.log("서버 응답:", result);
    }
  } catch (err) {
    console.error("저장 중 오류 발생:", err);
    alert("저장 중 오류가 발생했습니다.");
  }

};

// 임시 저장
tempSaveBtn.onclick = async () => {

  const tempData = {
    region: regionParam,
    title: titleInput.value.trim(),
    tags: [...selectedDistricts],
    photos: [...existingPhotos],
    emoji: currentEmoji,
    memo: memoInput.value.trim(),
    status: "false"  // 임시 저장 표시
  };

  await fetch("/travelPost/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: new URLSearchParams(tempData)
  });

  location.href = '/travelPost/Temp/';
};


// 임시 목록 버튼
tempListBtn.onclick = () => location.href = '/travelPost/Temp';

// 초기 이모지 안내 숨김
if (currentEmoji) emojiGuide.style.display = 'none';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById("record-container");
    fetch('/travelPost/tempList/')
    .then(res => res.json())
    .then(data => {
      console.log('받은 데이터:', data);
      container.innerHTML = "";  // 초기화
      data.posts.forEach(post => {
        const card = document.createElement("div");
        card.textContent = post.title;
        container.appendChild(card);
      });
    })
    .catch(err => console.error(err));
});
