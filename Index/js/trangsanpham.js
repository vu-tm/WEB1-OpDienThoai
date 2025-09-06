
function showAddProductForm(){
    document.getElementById("productListSection").classList.add("hidden");
    document.getElementById("addProductSection").classList.remove("hidden");
}
function showProductList () {
    document.getElementById("addProductSection").classList.add("hidden");
    document.getElementById("productListSection").classList.remove("hidden");
    clearInputFields();

}
function clearInputFields() {
    // Lấy tất cả các trường nhập liệu trong phần thêm sản phẩm
    document.getElementById("productName").value = "";
    document.getElementById("case").value = "";
    document.getElementById("productBrand").value = "";
    document.getElementById("productModel").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productQuantity").value = "";
    document.getElementById("productDescription").value = "";

    // Xóa tệp hình ảnh đã chọn
    const fileInput = document.getElementById("productImage");
    fileInput.value = "";

    // Ẩn ảnh xem trước (nếu có)
    const imagePreview = document.getElementById("imagePreview");
    if (imagePreview) {
        imagePreview.src = "";
        imagePreview.style.display = "none";
    }
}
window.onload = function() {
// Hiển thị lại sản phẩm từ localStorage khi trang được tải lại
displayProducts();
};
function displayProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productTable = document.querySelector("table");

    // Xóa các hàng sản phẩm cũ để làm mới bảng
    productTable.querySelectorAll("tr.product-row").forEach(row => row.remove());

    products.forEach(product => {
        const row = document.createElement("tr");
        row.classList.add("product-row");
        let imageContent = "";
        if (product.img) {
            // Nếu có ảnh, hiển thị ảnh
            imageContent = `<img src="${product.img}" alt="${product.name}" style="width: 120px; height: 80;">`;
        } else {
            // Nếu không có ảnh, hiển thị thông báo "Chưa cập nhật"
            imageContent = `<span style="color: red;">Chưa cập nhật ảnh</span>`;
        }
        // Tạo nội dung cho mỗi ô trong hàng
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.category}</td>
            <td>${product.name}</td>
            <td>${product.model}</td>
            <td>${imageContent}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.quantity}</td>
            <td>
                <div class="icon-button">
                    <i class="fa-solid fa-trash-can icon trash-icon" onclick="showDeleteConfirm('${product.id}')"></i>
                </div>
                <div class="icon-button">
                    <i class="fa-solid fa-pen-to-square icon edit-icon"  onclick="showEditProductForm('${product.id}')"></i>
                </div>
            </td>
        `;

        productTable.appendChild(row);
    });
}
function displayFilename(){
    const fileInput = document.getElementById("productImage");
    const fileName = fileInput.files[0] ? fileInput.files[0].name : "Chua chon file";
    document.getElementById("fileNameDisplay").textContent = fileName;
}
document.getElementById("productImage").addEventListener('change', displayFilename);

function formatCurrency(price) {
    // Loại bỏ dấu phân cách hàng nghìn nếu có, rồi chuyển thành số
    let numericPrice = parseFloat(String(price).replace(/,/g, ""));

    // Kiểm tra nếu giá là một số hợp lệ
    if (isNaN(numericPrice) || numericPrice < 0) {
        return "0₫";
    }

    // Định dạng giá theo dạng VND (thêm dấu phân cách hàng nghìn)
    let formattedPrice = numericPrice.toLocaleString('vi-VN');

    // Thêm đơn vị VND vào cuối
    return formattedPrice + '₫';
}
function saveProducts(){
    const productCase = document.getElementById("case").value;
    const productName = document.getElementById("productName").value;
    const productBrand = document.getElementById("productBrand").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productDescription = document.getElementById("productDescription").value;
    const productModel = document.getElementById("productModel").value;
    const fileInput = document.getElementById("productImage");

    if (!productCase) {
        alert("Dòng ốp lưng không được để trống!");
        document.getElementById("case").focus();
        return;
    }

    if (!productName) {
        alert("Tên ốp lưng không được để trống!");
        document.getElementById("productName").focus();
        return;
    }

    if (!productBrand) {
        alert("Thương hiệu không được để trống!");
        document.getElementById("productBrand").focus();
        return;
    }

    if (!productModel) {
        alert("Mẫu điện thoại không được để trống!");
        document.getElementById("productModel").focus();
        return;
    }

    if (!productPrice || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
        alert("Giá bán phải là số lớn hơn 0!");
        document.getElementById("productPrice").focus();
        return;
    }
    
    if (!productQuantity || isNaN(productQuantity) || parseInt(productQuantity) <= 0) {
        alert("Số lượng phải là số nguyên lớn hơn 0!");
        document.getElementById("productQuantity").focus();
        return;
    }

    if (!productDescription) {
        alert("Mô tả sản phẩm không được để trống!");
        document.getElementById("productDescription").focus();
        return;
    }

    if (!fileInput.files[0]) {
        alert("Vui lòng chọn ảnh sản phẩm!");
        document.getElementById("productImage").focus();
        return;
    }

    let maxID = parseInt(localStorage.getItem("maxID")) || 0;
    maxID += 1; // Tăng ID
    localStorage.setItem("maxID", maxID); // Lưu giá trị mới

    const productImagePath = `img/product/Case/${fileInput.files[0].name}`;
    const productID = maxID.toString(); // ID là chuỗi số

    storeProductData(
        productCase,
        productName,
        productBrand,
        productModel,
        productPrice,
        productQuantity,
        productDescription,
        productImagePath,
        productID
    );
}

function storeProductData(productCase, productName,productBrand, productModel, productPrice, productQuantity, productDescription, productImagePath, productID) {

    const newProduct = {
        id: parseFloat(productID),
        name:productName,
        category: productCase, // Tên dòng ốp lưng
        brand: productBrand,   // Thương hiệu
        model: productModel,   // Dòng điện thoại
        img: productImagePath, // Đường dẫn ảnh
        price: parseFloat(productPrice), // Giá sản phẩm (chuyển về số)
        quantity: parseInt(productQuantity), // Số lượng trong kho (chuyển về số)
        sold: 0, // Số lượng đã bán ban đầu
        totalRevenue: 0, // Doanh thu tổng cộng ban đầu
        desc:productDescription,
    };

    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    // Reset form
    document.getElementById("case").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("productBrand").value = "";
    document.getElementById("productModel").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productQuantity").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("fileNameDisplay").textContent = "";

    alert("Thêm sản phẩm thành công!");
    displayProducts();
    showProductList();
}

let productToDelete = null;
let productToEdit = null;

function showDeleteConfirm(productID) {
productToDelete = productID;
document.getElementById("deleteConfirmBox").style.display = "block";
}

function closeDeleteConfirm() {
document.getElementById("deleteConfirmBox").style.display = "none";
}

function confirmDelete() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products = products.filter(product => product.id !== productToDelete);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();  // Cập nhật lại danh sách sản phẩm
    closeDeleteConfirm(); // Đóng hộp xác nhận
}
function showEditProductForm(productID) {
    productToEdit = productID;

    // Đảm bảo productID là một số
    productID = parseInt(productID); // Chuyển productID sang số

    const products = JSON.parse(localStorage.getItem("products")) || [];
    // Tìm sản phẩm theo productID (sau khi đã chuyển sang số)
    const product = products.find(product => product.id === productID);

    if (product) {
        // Điền thông tin sản phẩm vào form chỉnh sửa
        document.getElementById("editProductName").value = product.name;
        document.getElementById("editProductCase").value = product.category;
        document.getElementById("editProductBrand").value = product.brand;
        document.getElementById("editProductModel").value = product.model;
        document.getElementById("editProductPrice").value = product.price;
        document.getElementById("editProductQuantity").value = product.quantity;
        document.getElementById("editProductDescription").value = product.desc;

        // Hiển thị ảnh sản phẩm hiện tại nếu có
        if (product.img) {
            document.getElementById("editImagePreview").src = product.img;
            document.getElementById("editImagePreview").style.display = "block";
            document.getElementById("deleteEditImageButton").style.display = "inline-block";
        } else {
            document.getElementById("editImagePreview").style.display = "none";
        }
    }

    // Hiển thị hộp thoại chỉnh sửa
    document.getElementById("editProductBox").style.display = "block";
}

function saveEditedProduct() {
    const productCase = document.getElementById("editProductCase").value;
    const productName = document.getElementById("editProductName").value;
    const productBrand = document.getElementById("editProductBrand").value;
    const productModel = document.getElementById("editProductModel").value;
    const productPrice = document.getElementById("editProductPrice").value;
    const productQuantity = document.getElementById("editProductQuantity").value;
    const productDescription = document.getElementById("editProductDescription").value;
    const editProductImage = document.getElementById("editProductImage");

    if (!productCase || !productBrand || !productModel || !productPrice || !productQuantity || !productDescription) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
        return;
    }
    
    let products = JSON.parse(localStorage.getItem("products")) || [];
    const productToEditInt = parseInt(productToEdit, 10); // Chuyển productToEdit thành số
    const index = products.findIndex(product => product.id === productToEditInt);

    if (index !== -1) {
        const updatedProduct = {
            ...products[index],
            category: productCase,
            name: productName,
            brand: productBrand,
            model: productModel,
            price: parseFloat(productPrice),
            quantity: parseInt(productQuantity),
            desc: productDescription
        };

        if (editProductImage.files[0]) {
            updatedProduct.img = `img/product/Case/${editProductImage.files[0].name}`;
        } else if (document.getElementById("editImagePreview").style.display === "none") {
            updatedProduct.img = ""; // Xóa ảnh nếu không có ảnh mới và ảnh cũ không được hiển thị
        }

        products[index] = updatedProduct;
        localStorage.setItem("products", JSON.stringify(products));

        // Cập nhật lại danh sách sản phẩm và đóng form
        displayProducts();
        closeEditProduct();
    } else {
        alert("Sản phẩm không tìm thấy.");
    }
}

    function previewEditImage() {
    const editProductImage = document.getElementById("editProductImage").files[0];
    const editImagePreview = document.getElementById("editImagePreview");

    if (editProductImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editImagePreview.src = e.target.result;
            editImagePreview.style.display = "block";
            document.getElementById("deleteEditImageButton").style.display = "inline-block";
        };
        reader.readAsDataURL(editProductImage);
    }
}
function deleteEditImage() {
document.getElementById("editImagePreview").src = "";
document.getElementById("editImagePreview").style.display = "none";
document.getElementById("editProductImage").value = ""; // Xóa ảnh đã chọn
document.getElementById("deleteEditImageButton").style.display = "none";
}
function closeEditProduct() {
document.getElementById("editProductBox").style.display = "none";
}
