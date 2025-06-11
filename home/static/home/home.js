//// 마커 클릭 시 해당 지역 상세 페이지로 이동
//document.querySelectorAll('.marker').forEach(marker => {
//  marker.addEventListener('click', function () {
//    const region = this.getAttribute('data-region');
//    window.location.href = `/detail/?region=${encodeURIComponent(region)}`;
//  });
//});
//
//// 기록 추가 버튼 클릭 시 추가 페이지로 이동
//document.querySelector('.add-button').addEventListener('click', () => {
//  window.location.href = '/add/';
//});