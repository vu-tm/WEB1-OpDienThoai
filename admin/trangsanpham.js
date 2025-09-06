 
function showAddProductForm(){
    document.getElementById("productListSection").classList.add("hidden");
    document.getElementById("addProductSection").classList.remove("hidden");
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClickForAddProduct);
    }, 0);
}
function showProductList () {
    document.getElementById("addProductSection").classList.add("hidden");
    document.getElementById("productListSection").classList.remove("hidden");
    clearInputFields();
    document.removeEventListener("click", handleOutsideClickForAddProduct);
}
function handleOutsideClickForAddProduct(event) {
    const addProductSection = document.getElementById("addProductSection");

    // Kiểm tra nếu click bên ngoài hộp thêm sản phẩm
    if (!addProductSection.contains(event.target)) {
        showProductList();
    }
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
    document.getElementById("fileNameDisplay").textContent = "";

}
function displayProducts() {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productTable = document.querySelector("table");

    // Xóa các hàng sản phẩm cũ để làm mới bảng
    productTable.querySelectorAll("tr.product-row").forEach(row => row.remove());

    // Hiển thị sản phẩm từ localStorage
    products.forEach(product => {
        const row = document.createElement("tr");
        row.classList.add("product-row");

        let imageContent = "";
        if (product.img) {
            imageContent = `<img src="${product.img}" alt="${product.name}" style="width: 70px; height: auto;">`;
        } else {
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
                    <i class="fa-solid fa-pen-to-square icon edit-icon" onclick="showEditProductForm('${product.id}')"></i>
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
    // Kiểm tra nếu giá là một số hợp lệ
    if (isNaN(price) || price < 0) {
        return "0 VND";
    }
    // Định dạng giá theo dạng VND (thêm dấu phân cách hàng nghìn)
    let formattedPrice = parseFloat(price).toLocaleString('vi-VN');

    // Thêm đơn vị VND vào cuối
    return formattedPrice + '₫';
}
function saveProducts() {
    const productCase = document.getElementById("case").value;
    const productName = document.getElementById("productName").value;
    const productBrand = document.getElementById("productBrand").value;
    const productPrice = document.getElementById("productPrice").value;
    const productQuantity = document.getElementById("productQuantity").value;
    const productDescription = document.getElementById("productDescription").value;
    const productModel = document.getElementById("productModel").value;
    const fileInput = document.getElementById("productImage");

    if (!productCase) {
        showToast("Dòng ốp lưng không được để trống!", "error");
        document.getElementById("case").focus();
        return;
    }

    if (!productName) {
        showToast("Tên ốp lưng không được để trống!", "error");
        document.getElementById("productName").focus();
        return;
    }

    if (!productBrand) {
        showToast("Thương hiệu không được để trống!", "error");
        document.getElementById("productBrand").focus();
        return;
    }

    if (!productModel) {
        showToast("Mẫu điện thoại không được để trống!" ,"error");
        document.getElementById("productModel").focus();
        return;
    }

    if (!productPrice || isNaN(productPrice) || parseFloat(productPrice) <= 0) {
        showToast("Giá bán phải là số lớn hơn 0!", "error");
        document.getElementById("productPrice").focus();
        return;
    }
    
    if (!productQuantity || isNaN(productQuantity) || parseInt(productQuantity) <= 0) {
        showToast("Số lượng phải là số nguyên lớn hơn 0!" ,"error");
        document.getElementById("productQuantity").focus();
        return;
    }

    if (!fileInput || fileInput.files.length === 0) {
        showToast("Ảnh sản phẩm không được để trống!","error");
        document.getElementById("productImage").focus();
        return;
    }

    if (!productDescription) {
        showToast("Mô tả sản phẩm không được để trống!","error");
        document.getElementById("productDescription").focus();
        return;
    }
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const maxID = products.reduce((max, product) => Math.max(max, product.id), 0); // Tìm ID lớn nhất hiện tại
    const productID = maxID + 1; // Tạo ID mới bằng cách cộng 1 vào max ID

    const productImagePath = `img/product/Case/${fileInput.files[0].name}`;

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


function storeProductData(productCase, productName, productBrand, productModel, productPrice, productQuantity, productDescription, productImagePath, productID) {
    const newProduct = {
        id: productID,
        name: productName,
        category: productCase,
        brand: productBrand,
        model: productModel,
        img: productImagePath,
        price: parseFloat(productPrice), // Giá sản phẩm (chuyển về số)
        quantity: parseInt(productQuantity),
        sold: 0,
        totalRevenue: 0,
        desc: productDescription,
    };

    const products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);  // Thêm sản phẩm mới vào danh sách
    localStorage.setItem("products", JSON.stringify(products));  // Lưu lại vào localStorage

    // Reset form
    clearInputFields();
    showToast("Thêm sản phẩm thành công!","success");
    displayProducts();  // Hiển thị lại danh sách sản phẩm
    showProductList();  // Quay lại danh sách sản phẩm
}


let productToDelete = null;
let productToEdit = null;

function showDeleteConfirm(productID) {
productToDelete = productID;
document.getElementById("deleteConfirmBox").style.display = "block";
setTimeout(() => {
    document.addEventListener("click", handleOutsideClickForDeleteConfirm);
}, 0);
}

function closeDeleteConfirm() {
document.getElementById("deleteConfirmBox").style.display = "none";
document.removeEventListener("click", handleOutsideClickForDeleteConfirm);

}

function confirmDelete() {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products = products.filter(product => product.id !== parseFloat(productToDelete)); // Chuyển `productToDelete` sang số
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();  // Cập nhật lại danh sách sản phẩm
    closeDeleteConfirm(); // Đóng hộp xác nhận
}
function handleOutsideClickForDeleteConfirm(event) {
    const deleteConfirmBox = document.getElementById("deleteConfirmBox");

    // Kiểm tra nếu click bên ngoài hộp thoại
    if (!deleteConfirmBox.contains(event.target)) {
        closeDeleteConfirm();
    }
}
function handleOutsideClickForEdit(event) {
    const editProductBox = document.getElementById("editProductBox");

    // Kiểm tra nếu click bên ngoài hộp thoại
    if (!editProductBox.contains(event.target)) {
        closeEditProduct();
    }
}

function showEditProductForm(productID) {
productToEdit = productID;
const products = JSON.parse(localStorage.getItem("products")) || [];
const product = products.find(product => product.id.toString() === productID.toString());

if (product) {
    // Điền thông tin sản phẩm vào form chỉnh sửa
    document.getElementById("editProductName").value = product.name;
    document.getElementById("editProductCase").value = product.category;
    document.getElementById("editProductBrand").value = product.brand;
    document.getElementById("editProductModel").value = product.model;
    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductQuantity").value = product.quantity;
    document.getElementById("editProductDescription").value = product.desc;

    // Hiển thị ảnh sản phẩm hiện tại
    if (product.img) {
        document.getElementById("editImagePreview").src = product.img;
        document.getElementById("editImagePreview").style.display = "block";
        document.getElementById("deleteEditImageButton").style.display = "inline-block";
    }
    setTimeout(() => {
        document.addEventListener("click", handleOutsideClickForEdit);
    }, 0);
}

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
        showToast("Vui lòng điền đầy đủ thông tin sản phẩm!","error");
        return;
    }
    if (isNaN(productPrice) || parseFloat(productPrice) <= 0) {
        showToast("Giá sản phẩm phải là một số lớn hơn 0!", "error");
        return;
    }

    // Kiểm tra số lượng phải là số lớn hơn 0
    if (isNaN(productQuantity) || parseInt(productQuantity) <= 0) {
        showToast("Số lượng sản phẩm phải là một số lớn hơn 0!", "error");
        return;
    }

    let products = JSON.parse(localStorage.getItem("products")) || [];
    const index = products.findIndex(product => product.id.toString() === productToEdit.toString());

    if (index !== -1) {
        const updatedProduct = {
            ...products[index],
            category: productCase,
            name: productName,
            brand: productBrand,
            model: productModel,
            price: parseFloat(productPrice), // Chuyển thành số
            quantity: parseInt(productQuantity), //
            desc: productDescription
        };

        // Keep the same ID (sequential number)
        updatedProduct.id = products[index].id; // No need to modify ID

        // Update image if new file is selected or image is deleted
        if (editProductImage.files[0]) {
            updatedProduct.img= `img/product/Case/${editProductImage.files[0].name}`;
        } else if (document.getElementById("editImagePreview").style.display === "none") {
            updatedProduct.img = "";
        }

        products[index] = updatedProduct;
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        closeEditProduct();
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
document.removeEventListener("click", handleOutsideClickForEdit);

}
window.addEventListener("load", function() {
    displayProducts();
});
