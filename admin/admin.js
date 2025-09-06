document.addEventListener("DOMContentLoaded", () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Nếu chưa đăng nhập, chuyển về trang login
    if (!isLoggedIn || isLoggedIn !== "true") {
        alert("Bạn cần đăng nhập để truy cập trang này!");
        window.location.href = "login.html";
    }
});






function navigateTo(sectionId) {
    // Ẩn tất cả các phần nội dung
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Hiển thị phần nội dung tương ứng
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    // Cập nhật trạng thái của sidebar
    const menuItems = document.querySelectorAll('.trangtongquan');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    // Đánh dấu mục đang hoạt động trong sidebar
    const activeItem = document.querySelector(`.trangtongquan[onclick*="${sectionId}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }

    // Ghi lại điều hướng
    console.log(`Navigated to: ${sectionId}`);
}

// Mặc định hiển thị trang tổng quan khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    navigateTo('dashboard');
});




const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('sidebar');


// Hàm mở/đóng sidebar khi nhấn vào menu icon
menuIcon.addEventListener('click', function(event) {
    event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    toggleSidebar();
});

// Hàm để mở/đóng sidebar và xoay icon
function toggleSidebar() {
    sidebar.classList.toggle('open'); // Mở/đóng sidebar
    menuIcon.classList.toggle('rotate'); // Xoay icon
}

// Đóng sidebar nếu nhấn ra ngoài sidebar
document.addEventListener('click', function(event) {
    if (!sidebar.contains(event.target) && !menuIcon.contains(event.target)) {
        closeSidebar();
    }
});

// Hàm đóng sidebar và reset icon
function closeSidebar() {
    sidebar.classList.remove('open');
    menuIcon.classList.remove('rotate');
}



// Xử lý đăng xuất
document.getElementById("logoutadmin").addEventListener("click", function() {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("user");

    // Chuyển hướng về trang login
    window.location.href = "login.html"; // Thay đổi với đường dẫn của trang đăng nhập
});


// Xử lý đăng xuất
document.getElementById("logoutAdmin").addEventListener("click", function() {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("user");

    // Chuyển hướng về trang login
    window.location.href = "login.html"; // Thay đổi với đường dẫn của trang đăng nhập
});

function showToast(message, type) {
    const toast = document.getElementById("toast");
    
    // Cập nhật nội dung và kiểu thông báo
    toast.innerHTML = `
        <i class="${type === 'success' ? 'fa-solid fa-check' : 'fa-regular fa-circle-xmark'}"></i> ${message}
    `;
    toast.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da'; // Nền xanh nhạt cho đúng, đỏ nhạt cho sai
    toast.style.color = type === 'success' ? '#155724' : '#721c24'; // Chữ xanh hoặc đỏ
    toast.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`; // Viền tương ứng

    // Hiển thị thông báo
    toast.style.display = "block";

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// Đảm bảo modal được ẩn khi tải lại trang
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('info-admin-header');
    var logo = document.getElementById('logo-icon');

    modal.style.display = 'none';  // Đảm bảo modal luôn ẩn khi trang tải lại
    modal.style.visibility = 'hidden';  // Đảm bảo modal không thể nhìn thấy
    modal.style.opacity = '0';  // Đảm bảo modal không nhìn thấy gì

    logo.style.display = 'block';  // Hiển thị logo mặc định
});

// Hàm hiển thị modal
function showModal() {
    var modal = document.getElementById('info-admin-header');
    var logo = document.getElementById('logo-icon');

    // Ẩn logo và hiển thị modal tại vị trí của logo
    logo.style.display = 'none';  // Ẩn logo
    modal.style.display = 'flex';     // Hiển thị modal
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';        // Hiển thị modal mượt mà
}

// Hàm đóng modal
function closeModal() {
    var modal = document.getElementById('info-admin-header');
    var logo = document.getElementById('logo-icon');

    // Ẩn modal và hiển thị lại logo
    modal.style.display = 'none';  // Ẩn modal
    modal.style.visibility = 'hidden';
    modal.style.opacity = '0';     // Ẩn modal mượt mà
    logo.style.display = 'block';  // Hiển thị lại logo
}
