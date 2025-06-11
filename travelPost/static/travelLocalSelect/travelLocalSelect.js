// 1) 광역시/도 순서대로
const regions = [
    "서울", "경기", "인천", "강원", "충북", "충남", "세종",
    "대전", "경북", "경남", "대구", "울산", "부산", "전북", "전남", "광주", "제주"
  ];

  const regionData = {
    "서울":   ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
    "경기":   ["가평군","고양시","과천시","광명시","광주시","구리시","군포시","김포시","남양주시","동두천시","부천시","성남시","수원시","시흥시","안산시","안성시","안양시","양주시","오산시","용인시","의왕시","의정부시","이천시","파주시","평택시","포천시","하남시","화성시"],
    "인천":   ["강화군","계양구","남동구","동구","부평구","서구","연수구","옹진군","중구","미추홀구"],
    "강원":   ["강릉시","고성군","동해시","삼척시","속초시","양구군","양양군","영월군","원주시","인제군","정선군","철원군","춘천시","태백시","평창군","홍천군","화천군","횡성군"],
    "충북":   ["괴산군","단양군","보은군","영동군","옥천군","음성군","제천시","진천군","청주시","충주시","증평군"],
    "충남":   ["계룡시","공주시","논산시","당진시","보령시","부여군","서산시","서천군","아산시","예산군","천안시","청양군","태안군","홍성군"],
    "세종":   ["세종시"],
    "대전":   ["대덕구","동구","서구","유성구","중구"],
    "경북":   ["경산시","경주시","고령군","구미시","군위군","김천시","문경시","봉화군","상주시","성주군","안동시","영덕군","영양군","영주시","영천시","예천군","울릉군","울진군","의성군","청도군","청송군","칠곡군","포항시"],
    "경남":   ["거제시","거창군","고성군","김해시","남해군","밀양시","사천시","산청군","양산시","의령군","진주시","창녕군","창원시","통영시","하동군","함안군","함양군","합천군"],
    "대구":   ["남구","달서구","동구","북구","서구","수성구","중구","달성군"],
    "울산":   ["남구","동구","북구","중구","울주군"],
    "부산":   ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
    "전북":   ["고창군","군산시","김제시","남원시","무주군","부안군","순창군","완주군","익산시","임실군","장수군","전주시","정읍시","진안군"],
    "전남":   ["강진군","고흥군","곡성군","광양시","구례군","나주시","담양군","목포시","무안군","보성군","순천시","신안군","여수시","영광군","영암군","완도군","장성군","장흥군","진도군","함평군","해남군","화순군"],
    "광주":   ["광산구","남구","동구","북구","서구"],
    "제주":   ["서귀포시","제주시"]
  };



  // UI state
  let currentRegion = null;      // null이면 1단계(광역시/도), 값 있으면 2단계(그 지역의 시/군/구)
  let selected = [];             // 2단계에서 고른 시/군/구들

  const regionListEl   = document.getElementById("region-list");
  const searchInput    = document.getElementById("search");
  const selectedTagsEl = document.getElementById("selected-tags");
  const listHeaderEl   = document.getElementById("list-header");
  const titleEl        = document.getElementById("region-title");

  // 목록 렌더링
  function renderList(filter = "") {
    regionListEl.innerHTML = "";
    const list = currentRegion
      ? (regionData[currentRegion] || [])
      : regions;
    list
      .filter(item => item.includes(filter))
      .forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        if (currentRegion && selected.includes(item)) li.classList.add("selected");
        li.onclick = () => {
          if (!currentRegion) {
            // 1단계 선택 → 2단계로 전환
            currentRegion = item;
            titleEl.textContent = `${item} 선택`;
            listHeaderEl.textContent = "시/군/구";
            searchInput.value = "";
            renderTags();
          } else {
            // 2단계 토글
            if (selected.includes(item)) {
              selected = selected.filter(d => d !== item);
            } else if (selected.length < 4) {
              selected.push(item);
            } else {
              alert("최대 4개까지 선택할 수 있습니다.");
            }
          }
          renderList(searchInput.value);
          renderTags();
        };
        regionListEl.appendChild(li);
      });
  }

  // 선택된 태그 렌더링 (2단계에서만 보여줌)
  function renderTags() {
    selectedTagsEl.innerHTML = "";
    if (!currentRegion) return;
    selectedTagsEl.style.display = "flex";
    selected.forEach(d => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = d;
      selectedTagsEl.appendChild(tag);
    });
  }

  function resetSelection() {
    if (!currentRegion) return;
    selected = [];
    renderList(searchInput.value);
    renderTags();
  }

  function applySelection() {
    if (!currentRegion) {
      // 1단계에서 ‘확인’ 클릭 시엔 첫 단계 다시 유지
      return;
    }
    // localStorage에 저장하고 add.html로 복귀
    localStorage.setItem("selectedDistricts", JSON.stringify(selected));
    location.href = 'post.html';
  }

  searchInput.addEventListener("input", () => renderList(searchInput.value));

  // 초기
  selectedTagsEl.style.display = "none";
  listHeaderEl.textContent = "광역시/도";
  renderList();