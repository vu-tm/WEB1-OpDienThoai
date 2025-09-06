document.getElementById('home-link').addEventListener('click', function(event) {
    event.preventDefault(); // Ngăn không cho trang tải lại ngay lập tức
    // Lưu lại trạng thái đăng nhập hiện tại
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    location.reload(); 
    // Sau khi trang được tải lại, gọi lại hàm kiểm tra đăng nhập và render dữ liệu
    window.onload = function() {
        // Kiểm tra trạng thái đăng nhập
        if (currentUser) {
            checkLoginStatus();
        }
    };
});

// Tìm kiếm
// Lấy các phần tử cần thiết
const searchIcon = document.getElementById('searchright');
const searchOverlay = document.getElementById('search');
const closeSearch = document.querySelector('.closeSearch');
const searchInput = document.querySelector('.search_input');
const wrapSearch = document.querySelector('.wrap_search');
const clearSearchButton = document.getElementById('clearsearch');
const historyList = document.querySelector('.history_list');
const historySearch = document.querySelector('.history_search');
const searchInputElement = document.getElementById('search-input');

// Thêm phần tử thông báo không tìm thấy sản phẩm
const noResultsMessage = document.createElement('div');
noResultsMessage.classList.add('no-results-message');
noResultsMessage.textContent = "Không tìm thấy sản phẩm";

// Hàm hiển thị lịch sử tìm kiếm
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    history.reverse().forEach(query => {
        const historyItem = document.createElement('li');
        historyItem.classList.add('history_item');
        
        const historyLink = document.createElement('a');
        historyLink.href = "#";
        historyLink.textContent = query;
        historyLink.onclick = () => { // user nhấp vào lịch sử cũ 
            searchInput.value = query;
            performSearch(query);
        };

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete_history');
        deleteButton.textContent = 'X';
        deleteButton.onclick = () => removeHistoryItem(query, event);
        
        historyItem.append(historyLink, deleteButton);
        historyList.appendChild(historyItem);
    });
}

// Hàm lưu lịch sử tìm kiếm
function saveSearchHistory(query) {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(query)) {
        history.push(query);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    updateHistoryDisplay();
}

// Hàm xóa lịch sử tìm kiếm
function removeHistoryItem(query, event) {
    event.stopPropagation();
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const updatedHistory = history.filter(item => item !== query);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    updateHistoryDisplay();
}

// Hàm thực hiện tìm kiếm
function performSearch(query = '') {
    query = query.trim().toLowerCase();
    
    // Lọc sản phẩm theo từ khóa tìm kiếm trong filteredProducts (sản phẩm đã được lọc)
    const searchedProducts = filteredProducts.filter(product => {
        const productName = product.name.trim().toLowerCase();
        const productModel = product.model ? product.model.trim().toLowerCase() : ''; // Kiểm tra nếu có model
        return productName.includes(query) || productModel.includes(query); // Tìm kiếm trong cả name và model
    });

    // Kiểm tra nếu không có sản phẩm tìm thấy
    if (searchedProducts.length === 0) {
        showToast("Không tìm thấy sản phẩm!" ,"error");
        searchInput.value = '';
        return;
    }

    // Lưu lịch sử tìm kiếm
    if (query) {
        saveSearchHistory(query);
    }

    // Cập nhật giao diện tìm kiếm
    searchOverlay.classList.remove('show');
    searchInput.value = '';
    
    // Phân trang cho các sản phẩm đã tìm
    currentPage = 1; // Reset lại trang
    displayList1(searchedProducts, perPage, currentPage); // Hiển thị lại các sản phẩm đã tìm
    setupPagination1(searchedProducts); // Tạo phân trang cho các sản phẩm đã tìm
}

function displayList1(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = start + perPage;
    let productShow = productAll.slice(start, end); // Chỉ lấy sản phẩm trong phạm vi trang hiện tại

    const productSection = document.querySelector(".product_detail");
    const offset = 228; 
    const topPosition = productSection.getBoundingClientRect().top + window.scrollY - offset;

    // Cuộn mượt đến vị trí đã tính toán
    window.scrollTo({
        top: topPosition,
        behavior: "smooth",
    });

    // Gọi hàm renderProducts từ main.js để hiển thị sản phẩm
    renderProducts(productShow); // Hiển thị các sản phẩm đã lọc và phân trang
}
function setupPagination1(productAll) {
    const pageNavList = document.querySelector('.page-nav-list');
    pageNavList.innerHTML = '';
    let pageCount = Math.ceil(productAll.length / perPage);

    // "Prev"
    let prev = document.createElement('li');
    prev.classList.add('page-nav-item');
    prev.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-arrow-left"></i></a>`;
    prev.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayList1(productAll, perPage, currentPage);
            setupPagination1(productAll);
        }
    });
    pageNavList.appendChild(prev);

    // Xác định các trang hiển thị
    let startPage = Math.max(currentPage - 1, 1); 
    let endPage = Math.min(currentPage + 1, pageCount);

    if (startPage > 1) {
        let firstPage = document.createElement('li');
        firstPage.classList.add('page-nav-item');
        firstPage.innerHTML = `<a href="javascript:;">1</a>`;
        firstPage.addEventListener('click', function () {
            currentPage = 1;
            displayList1(productAll, perPage, currentPage);
            setupPagination1(productAll);
        });
        pageNavList.appendChild(firstPage);

        let dots = document.createElement('li');
        dots.classList.add('page-nav-item', 'dots');
        dots.innerHTML = '...';
        pageNavList.appendChild(dots);
    }

    // Hiển thị các trang từ startPage -> endPage
    for (let i = startPage; i <= endPage; i++) {
        let li = document.createElement('li');
        li.classList.add('page-nav-item');
        li.innerHTML = `<a href="javascript:;">${i}</a>`;
        if (currentPage == i) li.classList.add('active');
        li.addEventListener('click', function () {
            currentPage = i;
            displayList1(productAll, perPage, currentPage);
            setupPagination1(productAll);
        });
        pageNavList.appendChild(li);
    }

    // dấu "..." trong page_nav
    if (endPage < pageCount) {
        let dots = document.createElement('li');
        dots.classList.add('page-nav-item', 'dots');
        dots.innerHTML = '...';
        pageNavList.appendChild(dots);

        let lastPage = document.createElement('li');
        lastPage.classList.add('page-nav-item');
        lastPage.innerHTML = `<a href="javascript:;">${pageCount}</a>`;
        lastPage.addEventListener('click', function () {
            currentPage = pageCount;
            displayList1(productAll, perPage, currentPage);
            setupPagination1(productAll);
        });
        pageNavList.appendChild(lastPage);
    }

    // "Next"
    let next = document.createElement('li');
    next.classList.add('page-nav-item');
    next.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-arrow-right"></i></a>`;
    next.addEventListener('click', function () {
        if (currentPage < pageCount) {
            currentPage++;
            displayList1(productAll, perPage, currentPage);
            setupPagination1(productAll);
        }
    });
    pageNavList.appendChild(next);
}

// Event listeners
searchIcon.addEventListener('click', () => searchOverlay.classList.add('show'));
closeSearch.addEventListener('click', () => {
    searchOverlay.classList.remove('show');
    searchInput.value = '';
});
// Xóa input
clearSearchButton.addEventListener('click', () => searchInput.value = '');
// Đóng bảng tìm kiếm
document.addEventListener('click', (event) => {
    if (!wrapSearch.contains(event.target) && !searchIcon.contains(event.target)) {
        searchOverlay.classList.remove('show');
        searchInput.value = '';
    }
});

searchInputElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') performSearch(searchInput.value);
});

document.addEventListener('DOMContentLoaded', () => {
    updateHistoryDisplay();

    searchInput.addEventListener('focus', () => historySearch.style.display = 'block');
    document.addEventListener('click', (event) => {
        if (!historySearch.contains(event.target) && !searchInput.contains(event.target)) {
            historySearch.style.display = 'none';
        }
    });
});
