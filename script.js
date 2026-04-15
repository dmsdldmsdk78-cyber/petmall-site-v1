// ------------------------------
// 1. 자주 사용할 HTML 요소 가져오기
// ------------------------------
const siteHeader = document.getElementById("siteHeader"); // 상단 헤더
const menuBtn = document.getElementById("menuBtn"); // 모바일 햄버거 버튼
const mobileMenu = document.getElementById("mobileMenu"); // 모바일 메뉴 박스

const revealTargets = document.querySelectorAll(".reveal"); // 스크롤 시 등장시킬 요소들

const tabButtons = document.querySelectorAll(".tab-btn"); // 상품 카테고리 탭 버튼들
const productCards = document.querySelectorAll(".product-card"); // 상품 카드들

// 베스트 상품 슬라이드 관련 요소
const bestSlider = document.getElementById("bestSlider"); // 슬라이드 전체 줄
const bestPrev = document.getElementById("bestPrev"); // 이전 버튼
const bestNext = document.getElementById("bestNext"); // 다음 버튼

// ------------------------------
// 2. 스크롤 시 헤더 스타일 변경
// - 맨 위에서는 투명 느낌
// - 조금만 내려오면 is-solid 클래스 추가
// ------------------------------
function handleHeader() {
  if (window.scrollY > 10) {
    siteHeader.classList.add("is-solid");
  } else {
    siteHeader.classList.remove("is-solid");
  }
}

// 페이지 첫 로드 때도 헤더 상태 한 번 체크
handleHeader();

// 스크롤할 때마다 헤더 스타일 업데이트
window.addEventListener("scroll", handleHeader);

// ------------------------------
// 3. 모바일 햄버거 메뉴 열고 닫기
// ------------------------------
menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("is-open");
});

// 모바일 메뉴 안의 링크를 누르면 메뉴 자동 닫기
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
  });
});

// ------------------------------
// 4. 베스트 상품 슬라이드
// - 화면 크기에 따라 한 번에 보이는 카드 수 변경
// - 좌우 버튼으로 이동
// - 자동 슬라이드 포함
// ------------------------------
if (bestSlider && bestPrev && bestNext) {
  let currentIndex = 0; // 현재 슬라이드 시작 위치
  let autoSlide; // 자동 슬라이드 interval 저장용

  // 화면 크기에 따라 보여줄 카드 개수 결정
  function getVisibleCount() {
    if (window.innerWidth <= 768) return 1;   // 모바일
    if (window.innerWidth <= 1024) return 2;  // 태블릿
    return 3;                                 // 데스크탑
  }

  // 현재 index 기준으로 슬라이드 위치 업데이트
  function updateBestSlider() {
    const cards = bestSlider.querySelectorAll(".best-card");
    if (!cards.length) return;

    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);

    // 현재 인덱스가 최대값을 넘지 않게 보정
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const cardWidth = cards[0].offsetWidth; // 카드 한 장 너비
    const gap = 20; // CSS gap 값과 맞춰야 함
    const moveX = (cardWidth + gap) * currentIndex;

    // currentIndex만큼 왼쪽으로 이동
    bestSlider.style.transform = `translateX(-${moveX}px)`;
  }

  // 다음 버튼 클릭
  bestNext.addEventListener("click", () => {
    const cards = bestSlider.querySelectorAll(".best-card");
    const visibleCount = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visibleCount);

    if (currentIndex < maxIndex) {
      currentIndex += 1;
      updateBestSlider();
    }
  });

  // 이전 버튼 클릭
  bestPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateBestSlider();
    }
  });

  // 창 크기 바뀌면 다시 계산
  window.addEventListener("resize", updateBestSlider);

  // 자동 슬라이드 시작
  function startAutoSlide() {
    autoSlide = setInterval(() => {
      const cards = bestSlider.querySelectorAll(".best-card");
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, cards.length - visibleCount);

      if (currentIndex < maxIndex) {
        currentIndex += 1;
      } else {
        currentIndex = 0; // 끝까지 가면 처음으로 돌아감
      }

      updateBestSlider();
    }, 3000); // 3초마다 이동
  }

  // 자동 슬라이드 멈추기
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }

  // 마우스를 올리면 자동 슬라이드 멈춤
  bestSlider.addEventListener("mouseenter", stopAutoSlide);

  // 마우스가 나가면 다시 자동 슬라이드 시작
  bestSlider.addEventListener("mouseleave", startAutoSlide);

  // 페이지 로드 완료 시 슬라이드 초기 세팅 + 자동 슬라이드 시작
  window.addEventListener("load", () => {
    updateBestSlider();
    startAutoSlide();
  });
}

// ------------------------------
// 5. 상품 카테고리 탭 필터
// - 전체 / 사료 / 장난감 / 산책용품 / 리빙
// - 버튼 누르면 해당 카테고리만 보이게
// ------------------------------
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter; // data-filter 값 읽기

    // 모든 탭 버튼 active 제거
    tabButtons.forEach((btn) => btn.classList.remove("is-active"));

    // 현재 누른 버튼만 active 추가
    button.classList.add("is-active");

    // 상품 카드들 카테고리에 맞게 보여주기/숨기기
    productCards.forEach((card) => {
      if (filter === "all" || card.dataset.category === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ------------------------------
// 6. 스크롤 등장 애니메이션
// - 화면에 들어오면 show 클래스 붙이기
// ------------------------------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.16, // 요소가 16% 정도 보이면 등장
  }
);

// reveal 클래스 가진 요소들 전부 관찰 시작
revealTargets.forEach((target) => observer.observe(target));