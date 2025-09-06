// Định dạng giá VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

document.addEventListener("DOMContentLoaded", () => {
    // Chọn tất cả các khu chi tiết
    const productContainers = document.querySelectorAll('.KhuChiTiet .product_preview');

    productContainers.forEach(product => {
        // Khởi tạo cho mỗi sản phẩm
        initializeProductPreview(product);
    });

    // Xử lý model nếu có
    const modelButtons = document.querySelectorAll(".model_option_chitietsanpham");
    const modelName = document.getElementById("model_name");

    if (modelButtons.length && modelName) {
        initializeModelSelection(modelButtons, modelName);
    }
});

function initializeProductPreview(product) {
    const ftImg = product.querySelectorAll(".feature_images img");
    const mainImg = product.querySelector(".main_image img");

    if (!ftImg.length || !mainImg) {
        console.error("Không tìm thấy ảnh feature hoặc ảnh chính!");
        return;
    }

    // Gắn sự kiện click cho ảnh feature
    ftImg.forEach((img, index) => {
        img.addEventListener("click", () => {
            console.log(`Click vào ảnh thứ ${index + 1}:`, img.src);
            mainImg.src = img.src; // Cập nhật ảnh chính

            // Loại bỏ lớp 'selected' khỏi tất cả ảnh feature
            ftImg.forEach(img => img.classList.remove('selected'));

            // Thêm lớp 'selected' cho ảnh được nhấp
            img.classList.add('selected');
        });
    });

    // Mặc định click vào ảnh đầu tiên
    const firstFeatureImage = product.querySelector(".feature_images img");
    if (firstFeatureImage) {
        firstFeatureImage.click();
    }
}

function initializeModelSelection(modelButtons, modelName) {
    // Gắn sự kiện click cho các nút model
    modelButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Bỏ class 'selected' khỏi tất cả các nút
            modelButtons.forEach(btn => btn.classList.remove('selected'));

            // Thêm class 'selected' vào nút được nhấp
            button.classList.add('selected');

            // Cập nhật tên model được chọn
            modelName.innerText = button.innerText;
        });
    });
}










