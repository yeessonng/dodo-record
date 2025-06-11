const params = new URLSearchParams(window.location.search);
    const region = params.get("region") || "지역";
    document.getElementById("region-title").textContent = region;

    const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    const records = allPosts.filter(p => p.region === region);

    const container = document.getElementById("record-container");

    if (records.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "no-record";
      emptyMsg.textContent = "";
      container.appendChild(emptyMsg);
    }

    records.forEach((record) => {
      const card = document.createElement("div");
      card.className = "record-card";
      card.dataset.postId = record.id;


      card.addEventListener("click", () => {
        location.href = `record-detail.html?region=${encodeURIComponent(region)}&postId=${encodeURIComponent(record.id)}`;
      });


      const imageSrc = (record.photos && record.photos.length > 0)
        ? record.photos[0]
        : "../images/default.png";


      const tagHTML = `
        <span class="tag black">${region}</span>
        ${record.districts.map(tag => `<span class="tag">${tag}</span>`).join('')}
      `;

      card.innerHTML = `
        <img src="${imageSrc}" class="record-image" alt="기록 이미지" />
        <div class="record-info">
          <span class="emoji">${record.emoji}</span>
          <span class="record-title">${record.title}</span>
        </div>
        <div class="tag-list">${tagHTML}</div>
        <div class="card-menu-toggle" onclick="toggleMenu(event)">⋯</div>
        <div class="card-menu" style="display: none;">
          <button class="menu-item edit" onclick="editCard(event, '${record.id}')">
            <img src="../images/iconoir_map-pin.svg" alt="편집 아이콘" />
            <span>편집하기</span>
          </button>
          <hr />
          <button class="menu-item delete" onclick="confirmDelete(event)">
            <img src="../images/iconoir_trash.svg" alt="삭제 아이콘" />
            <span>삭제하기</span>
          </button>
        </div>
      `;

      container.appendChild(card);
    });


    document.getElementById("add-button").addEventListener("click", () => {
      location.href = `../Add/add.html?region=${encodeURIComponent(region)}`;
    });

    function toggleMenu(e) {
      e.stopPropagation();
      const menu = e.currentTarget.nextElementSibling;
      document.querySelectorAll(".card-menu").forEach(m => m.style.display = "none");
      menu.style.display = "block";
    }

    let cardToDelete = null;
    function confirmDelete(e) {
      e.stopPropagation();
      const buttonEl = e.currentTarget;
      const card = buttonEl.closest('.record-card');
      cardToDelete = card;
      document.getElementById("delete-modal").style.display = "flex";
    }

    function closeModal() {
      document.getElementById("delete-modal").style.display = "none";
      cardToDelete = null;
    }

    function deleteCard() {
  if (!cardToDelete) return;
  const postId = cardToDelete.dataset.postId;
  let posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const updatedPosts = posts.filter(p => p.id !== postId);
  localStorage.setItem("posts", JSON.stringify(updatedPosts));
  cardToDelete.remove();
  closeModal();
}
    function editCard(e, postId) {
      e.stopPropagation();
      location.href = `../Add/add.html?region=${encodeURIComponent(region)}&postId=${encodeURIComponent(postId)}`;
    }

    window.addEventListener("click", function(e) {
      if (!e.target.closest('.card-menu') && !e.target.closest('.card-menu-toggle')) {
        document.querySelectorAll(".card-menu").forEach(m => m.style.display = "none");
      }
      if (e.target.id === 'delete-modal') {
        closeModal();
      }
    });