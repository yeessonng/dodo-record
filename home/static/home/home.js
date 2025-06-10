// 1) 로컬스토리지에서 저장된 포스트 배열 불러오기
const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");

// 2) 지역별 포스트 개수 계산
const countByRegion = {};
allPosts.forEach(post => {
  const region = post.region;
  if (!countByRegion[region]) {
    countByRegion[region] = 0;
  }
  countByRegion[region]++;
});

// 3) 각 마커에 해당 지역 포스트 개수 표시
document.querySelectorAll('.marker').forEach(marker => {
  const region = marker.getAttribute('data-region');
  const circle = marker.querySelector('.count-circle');
  const count = countByRegion[region] || 0;
  circle.textContent = count;
});

// 4) 마커 클릭 시 해당 지역 상세 페이지로 이동
document.querySelectorAll('.marker').forEach(marker => {
  marker.addEventListener('click', function () {
    const region = this.getAttribute('data-region');
    window.location.href = `../Detail/detail.html?region=${encodeURIComponent(region)}`;
  });
});

// 5) ‘기록 추가하기’ 버튼 클릭 시 추가 페이지로 이동
document.querySelector('.add-button').addEventListener('click', () => {
  window.location.href = '../Add/add.html';
});