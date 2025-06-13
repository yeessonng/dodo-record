// 1) 로컬스토리지에서 tempRecords 불러오기
const data = JSON.parse(localStorage.getItem("tempRecords")) || [];

const container = document.getElementById("record-container");

if (data.length === 0) {
  // 임시 기록이 없으면 안내 메시지 표시
  const emptyMsg = document.createElement("div");
  emptyMsg.className = "no-record";
  emptyMsg.textContent = "";
  container.appendChild(emptyMsg);
}

data.forEach((record, index) => {
  const card = document.createElement("div");
  card.className = "record-card";
  card.dataset.index = index;

  // 2) 태그: 첫 번째는 record.region(검정색), 뒤에 record.tags
  const tagHTML = `
    <span class="tag black">${record.region}</span>
    ${record.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
  `;

  // 3) 이미지 src를 record.photos 배열로 가져오기
  //    만약 photos 자체가 없으면 빈 문자열로 처리
  const imageSrc = Array.isArray(record.photos) && record.photos.length > 0
    ? record.photos[0]
    : "";

  card.innerHTML = `
    <img src="${imageSrc}" class="record-image" alt="기록 이미지" />
    <div class="record-info">
      <span class="emoji">${record.emoji}</span>
      <span class="record-title">${record.title}</span>
    </div>
    <div class="tag-list">${tagHTML}</div>
    <div class="card-menu-toggle" onclick="toggleMenu(this)">⋯</div>
    <div class="card-menu">
      <button class="menu-item edit" onclick="editCard(${index})">
        <img src="/static/travelPostTemp/images/iconoir_map-pin.svg" alt="편집 아이콘" />
        <span>편집하기</span>
      </button>
      <hr />
      <button class="menu-item delete" onclick="confirmDelete(this)">
        <img src="/static/travelPostTemp/images/iconoir_trash.svg" alt="삭제 아이콘" />
        <span>삭제하기</span>
      </button>
    </div>
  `;

  container.appendChild(card);
});

let cardToDelete = null;

function toggleMenu(el) {
  const menu = el.nextElementSibling;
  document.querySelectorAll(".card-menu").forEach(m => m.style.display = "none");
  menu.style.display = "block";
}

function confirmDelete(buttonEl) {
  cardToDelete = buttonEl.closest('.record-card');
  document.getElementById("delete-modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("delete-modal").style.display = "none";
  cardToDelete = null;
}

function deleteCard() {
  if (!cardToDelete) return;
  const index = Number(cardToDelete.dataset.index);
  data.splice(index, 1);
  localStorage.setItem("tempRecords", JSON.stringify(data));
  cardToDelete.remove();
  closeModal();
}

function editCard(index) {
  // 편집할 때는 record 전체를 editRecord에 저장
  localStorage.setItem("editRecord", JSON.stringify(data[index]));
  // add.html로 이동하면서 ?edit=<인덱스> 파라미터 전달
  location.href = `../travelPost.html?edit=${index}`;
}

window.addEventListener("click", function(e) {
  if (!e.target.closest('.card-menu') && !e.target.closest('.card-menu-toggle')) {
    document.querySelectorAll(".card-menu").forEach(m => m.style.display = "none");
  }
  if (e.target.id === "delete-modal") {
    closeModal();
  }
});