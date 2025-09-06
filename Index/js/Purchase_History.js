
//                                                     Chuyển form
// Bấm vào "Đơn hàng"
document.querySelector(".order_form").addEventListener("click", function() {
    document.querySelector(".content_right").style.display = "block";
    document.querySelector(".Location_customer").style.display = "none";
    document.querySelector(".Delivery_wrap").style.display = "none";

    document.querySelector(".order_form").classList.add("active");
    document.querySelector(".address").classList.remove("active");  
    renderOrders(orders);   
});
//  Bấm vào "Địa chỉ nhận hàng" 
document.querySelector(".address").addEventListener("click", function() {
    document.querySelector(".Location_customer").style.display = "block";
    document.querySelector(".content_right").style.display = "none";
    document.querySelector(".Delivery_wrap").style.display = "none";

    document.querySelector(".address").classList.add("active");
    document.querySelector(".order_form").classList.remove("active"); 
});

document.addEventListener('DOMContentLoaded', function () {
    const editLabel = document.getElementById('edit-label');
    const namePhone = document.getElementById('namePhone');
    const addressInfo = document.getElementById('addressInfo'); 
    const editInfo = document.getElementById('editInfo');
    const editNameInput = document.getElementById('editName');
    const editPhoneInput = document.getElementById('editPhone');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const addressInput = document.getElementById('addressInput');
    const selecCity = document.getElementById('selecCity');
    const selecDistric = document.getElementById('selecDistric');
    const selecWard = document.getElementById('selecWard');
    // const defaultAddress = document.getElementById('defaultAddress');
    const cancelBtn = document.getElementById('cancelBtn');

    // Lấy thông tin người dùng và địa chỉ từ localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    // Lấy mảng users từ localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Hiển thị thông tin cá nhân và địa chỉ
    function renderUserInfo() {
        const name = currentUser.name || "Chưa cập nhật";
        const phone = currentUser.numberphone || "Chưa cập nhật";
    
        // Kiểm tra và lấy thông tin địa chỉ
        const city = currentUser.address?.city || "Chưa cập nhật";
        const district = currentUser.address?.district || "Chưa cập nhật";
        const ward = currentUser.address?.ward || "Chưa cập nhật";
        const street = currentUser.address?.street || "Chưa cập nhật";
    
        const address = `${street}, ${ward}, ${district}, ${city}`;
    
        // Hiển thị tên và số điện thoại
        if (namePhone) {
            namePhone.textContent = `${name} - ${phone}`;
        }
    
        // Hiển thị địa chỉ
        if (addressInfo) {
            addressInfo.textContent = `Địa chỉ giao hàng: ${address}`;
        }
    }

    renderUserInfo(); // Gọi hàm hiển thị thông tin khi tải trang

    // Hiển thị form chỉnh sửa
    editLabel.addEventListener('click', function () {
        errorMessage.style.display = 'none';
        
        editNameInput.value = currentUser.name || "";
        editPhoneInput.value = currentUser.numberphone || "";
        addressInput.value = currentUser.address.street || "";
        selecCity.value = currentUser.address?.city || ""; 
        selecDistric.value = currentUser.address?.district || ""; 
        selecWard.value = currentUser.address?.ward || ""; 
        namePhone.style.display = 'none';
        editLabel.style.display = 'none';
        editInfo.style.display = 'block';
    });

    // Kiểm tra và xử lý input cho name
    editNameInput.addEventListener("input", function (event) {
        let input = event.target.value.replace(/[^a-zA-Zàáạảãấầẩẫăắằẳẵâấầẩẫđéèẹẻẽêếềểễíìịỉĩôốồổỗơớờởỡuúùụủũưứừửữáíéôàâầấếửũữ\s]/g, ''); // Cho phép ký tự chữ cái và khoảng trắng
        event.target.value = input;
    });

    // Kiểm tra và xử lý input cho phone
    editPhoneInput.addEventListener("input", function (event) {
        let input = event.target.value.replace(/[^0-9]/g, ''); // Chỉ giữ lại các ký tự số
        if (input.length > 10) {
            input = input.substring(0, 10); 
        }
        event.target.value = input;
    });
    
    // Kiểm tra tên
    function validateName(name) {
        if (!name.trim()) {
            return "Tên không được để trống.";
        }
        return null;
    }

    // Kiểm tra số điện thoại
    function validatePhone(phone) {
        const phonePattern = /^0\d{9}$/; // Đảm bảo số điện thoại bắt đầu bằng 0 và có 10 chữ số
        if (!phone.trim()) {
            return "Số điện thoại không được để trống.";
        }
        if (!phonePattern.test(phone)) {
            return "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số.";
        }
        return null;
    }

    // Kiểm tra địa chỉ
    function validateAddress(city, district, ward, street) {
        if (city === "Chọn Tỉnh/thành" || district === "Chọn Quận/Huyện" || ward === "Chọn Phường/Xã" || !street) {
            return "Hãy nhập đầy đủ thông tin địa chỉ!";
        }
        return null;
    }
    // Lưu thông tin sửa đổi
    submitBtn.addEventListener('click', function () {
        const newName = editNameInput.value.trim();
        const newPhone = editPhoneInput.value.trim();
        const newCity = selecCity.value.trim();
        const newDistrict = selecDistric.value.trim();
        const newWard = selecWard.value.trim();
        const newStreet = addressInput.value.trim();
        // Kiểm tra tất cả các trường
        const nameError = validateName(newName);
        const phoneError = validatePhone(newPhone);
        const addressError = validateAddress(newCity, newDistrict, newWard, newStreet);
    
        if (nameError || phoneError || addressError) {
            // Hiển thị thông báo lỗi
            errorMessage.style.display = 'block';
            errorMessage.textContent = nameError || phoneError || addressError;
        } else {
            // Cập nhật thông tin trong mảng `users`
            let userIndex = users.findIndex(u => u.id === currentUser.id);
    
            if (userIndex !== -1) {
                // Cập nhật thông tin người dùng trong `users`
                users[userIndex].name = newName;
                users[userIndex].numberphone = newPhone;
                users[userIndex].address = {
                    city: newCity,
                    district: newDistrict,
                    ward: newWard,
                    street: newStreet
                };
    
                // Cập nhật `currentUser` với thông tin mới
                currentUser.name = newName;
                currentUser.numberphone = newPhone;
                currentUser.address = {
                    city: newCity,
                    district: newDistrict,
                    ward: newWard,
                    street: newStreet
                };
    
                // Lưu lại mảng `users` và `currentUser` vào `localStorage`
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
                // Hiển thị lại thông tin và ẩn form chỉnh sửa
                renderUserInfo();
                namePhone.style.display = 'inline';
                editLabel.style.display = 'inline';
                editInfo.style.display = 'none';
    
                showToast("Thông tin đã được cập nhật!", "success");
            }
        }
    });

    // Hủy sửa và đóng form
    cancelBtn.addEventListener('click', function() {
        // Ẩn form chỉnh sửa và hiện lại thông tin ban đầu
        editInfo.style.display = 'none'; 
        namePhone.style.display = 'block';
        editLabel.style.display = 'inline';
        addressInfo.style.display = 'block';
    });
});



// Lấy các phần tử cần thiết
const chitietButton = document.getElementById('chitiet');
const contentRight = document.querySelector('.content_right');
const deliveryWrap = document.querySelector('.Delivery_wrap');
const buttonBack = document.querySelector('.buttonback');
const productChitietContainer = document.querySelector("#Product_chitiet");

// Lấy container chính
const productContainer = document.querySelector(".product_list");

// Hàm render đơn hàng
function renderOrders(orders) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Lấy thông tin người dùng hiện tại
    if (!currentUser || !currentUser.id) {
        console.log("Không có người dùng nào đang đăng nhập.");
        return;
    }

    const product_list = document.querySelector('.product_list');
    product_list.innerHTML = ''; // Xóa các đơn hàng cũ

    // Lọc đơn hàng theo `userid`
    const userOrders = orders.filter(order => order.userid === currentUser.id);

    userOrders.forEach(order => {
        // Tạo HTML cho từng đơn hàng
        const orderHTML = `
            <div class="Order_info flex">
                <div class="order_id">Mã đơn hàng: <span id="orderId">${order.orderId}</span></div>
                <div class="order_date">Ngày đặt hàng: <span id="orderDate">${order.orderDate}</span></div>
                <div class="order_status"><span id="orderStatus">${order.statusText}</span></div>
            </div>
            ${order.items.map(product => `
                <div class="item_cart">
                    <div class="flex">
                        <div class="hinhanh">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <p class="ten" id="name">${product.name}</p>
                        <div class="quantity Bold" id="quantity">Số lượng: ${product.quantity}</div>
                    </div>
                    <div class="right">
                        <p class="price">Giá tiền: ${product.price.toLocaleString()}đ</p>
                    </div>
                </div>
            `).join('')}
            <div class="BotBill">
                <div class="totalAmount font_size">Tổng tiền: ${order.totalAmount.toLocaleString()}đ</div>
                <div class="chitiet">Chi tiết</div>
            </div>
        `;

        // Chèn vào container
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = orderHTML;
        product_list.appendChild(orderDiv);

        const detailButton = orderDiv.querySelector('.chitiet');
        if (detailButton) {
            detailButton.addEventListener('click', function() {
                // Cập nhật Delivery_wrap với thông tin từ đơn hàng đã chọn
                document.querySelector('.Delivery_wrap .id_product').innerHTML = `Chi tiết đơn hàng: ${order.orderId} - ${order.statusText}`;
                document.querySelector('.Delivery_wrap .userId').innerHTML = `${order.fullName} - ${order.phone}`;
                document.querySelector('.Delivery_wrap .address1').innerHTML = order.address;
                document.querySelector('.Delivery_wrap .orderDate').innerHTML = order.orderDate;
                document.querySelector('.Delivery_wrap .time_del .orderDate').innerHTML = order.orderDate;
                document.querySelector('.Delivery_wrap .settleAmount').innerHTML = order.totalAmount.toLocaleString() + 'đ';
                const paymentMethodElement = document.querySelector('.Delivery_wrap .COD');
                paymentMethodElement.innerHTML = `${order.paymentMethod}`;
                                // Lấy phần chèn sản phẩm trong Delivery_wrap
                const productHTML = order.items.map(product => `
                    <div class="item_cartt">
                        <div class="flex">
                            <div class="hinhanh">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <p class="ten">${product.name}</p>
                            <div class="quantity Bold">Số lượng: ${product.quantity}</div>
                            <div class="pricee">Giá: ${product.price.toLocaleString()}đ</div>
                        </div>
                    </div>
                `).join('');
                
                // Chèn sản phẩm vào phần #Product_chitiet
                const productChitietContainer = document.querySelector('#Product_chitiet');
                productChitietContainer.innerHTML = productHTML;

                // Ẩn content_right và hiển thị deliveryWrap
                const contentRight = document.querySelector('.content_right');
                const deliveryWrap = document.querySelector('.Delivery_wrap');
                contentRight.style.display = 'none';
                deliveryWrap.style.display = 'block';
            });
        }
    });
}

// Thêm sự kiện cho nút "VỀ TRANG DANH SÁCH ĐƠN HÀNG"
buttonBack.addEventListener('click', function() {
    // Hiển thị lại phần content_right và ẩn deliveryWrap
    contentRight.style.display = 'block';
    deliveryWrap.style.display = 'none';
});

// Đăng xuất
document.addEventListener('DOMContentLoaded', function() {
    const logout = document.getElementById('dangxuat');
    logout.addEventListener('click', function() {
        // Xóa currentUser khỏi localStorage
        localStorage.removeItem('currentUser');
        // Xóa lịch sử đơn hàng khỏi localStorage
        // Cập nhật lại giao diện
        updateQtyItem()
        checkLoginStatus(); 
        showCart();
    });
});

// Lấy dữ liệu đơn hàng từ localStorage
const orders = JSON.parse(localStorage.getItem('orders')) || []; // Nếu không có dữ liệu thì trả về mảng rỗng

// Gọi hàm render
document.addEventListener('load', function() {
    renderOrders();  
});
