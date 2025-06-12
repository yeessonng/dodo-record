// 0) URL 파라미터에서 region & postId 가져오기
const params = new URLSearchParams(window.location.search);
const regionParam = params.get("region") || "지역";
const postIdParam = params.get("postId");

// 1) localStorage에서 “posts”를 읽어 해당 record 찾기
const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
const record = allPosts.find(p => p.id === postIdParam);

if (!record) {
  // postId가 잘못된 경우 안내 메시지
  const container = document.querySelector(".form");
  container.innerHTML = "";
  const errorMsg = document.createElement("div");
  errorMsg.style.textAlign = "center";
  errorMsg.style.marginTop = "40px";
  errorMsg.style.color = "#FF3B30";
  errorMsg.textContent = "존재하지 않는 기록이거나 삭제된 기록입니다.";
  container.appendChild(errorMsg);
} else {
  // 2) 상단 바 “page-title”에 record.title 설정 (글자 크기 등 CSS는 add.css 그대로 적용됩니다)
  document.getElementById("page-title").textContent = record.title;

  // 3) 폼 상단 input#title-input에도 record.title을 채워줍니다
  const titleInput = document.getElementById("title-input");
  titleInput.value = record.title;

  // 4) 상위 지역(카테고리) 칩 설정
  const baseChipEl = document.getElementById("base-chip");
  baseChipEl.textContent = regionParam;

  // 5) 세부 지역(칩) 렌더링
  const regionGroupEl = document.querySelector(".region-group");
  record.districts.forEach(district => {
    const tag = document.createElement("div");
    tag.className = "region-chip sub";
    tag.textContent = district;
    regionGroupEl.appendChild(tag);
  });

  // 6) 사진 슬라이더 렌더링
  const photoSlider = document.getElementById("photo-slider");
  if (record.photos && record.photos.length > 0) {
    photoSlider.style.display = "flex";
    record.photos.forEach((dataUrl, idx) => {
      const card = document.createElement("div");
      card.className = "photo-card";

      const img = document.createElement("img");
      img.src = dataUrl;
      card.appendChild(img);

      const pageIndicator = document.createElement("div");
      pageIndicator.className = "page-indicator";
      pageIndicator.textContent = `${idx + 1}/${record.photos.length}`;
      card.appendChild(pageIndicator);

      photoSlider.appendChild(card);
    });
  }

  // 7) 이모지 표시
  const emojiDisplay = document.getElementById("emoji-display");
  emojiDisplay.textContent = record.emoji || "";

  // 8) 메모 채우기
  const memoInput = document.getElementById("memo-input");
  memoInput.value = record.memo || "";
}