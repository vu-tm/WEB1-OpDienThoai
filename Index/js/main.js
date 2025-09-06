function showToast(message, type) {
    const toast = document.getElementById("toast");

    toast.innerHTML = `
        ${message} <i class="${type === 'success' ? 'fa-solid fa-check' : 'fa-regular fa-circle-xmark'}"></i> 
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
const authButton = document.getElementById('authButton');
const loginModal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close-btn');
const signInBtnLink = document.querySelector('.signInBtn-link');
const signUpBtnLink = document.querySelector('.signUpBtn-link');
const wrapper = document.querySelector('.wrapper'); // Phần chứa hai form (Login & Register)
const gologout = document.querySelector('.gologout');
const goPur = document.querySelector('.gopurchase');
const passwordInput = document.getElementById('password');
const registerPasswordInput = document.getElementById('registerPassword');
const eyeIcon = document.getElementById('eye');
const regEyeIcon = document.getElementById('regEye');

// Hiển thị form đăng nhập
function showLogin() {
    loginModal.style.display = 'block';
    wrapper.classList.remove('active'); // Chuyển về form Đăng nhập
    resetForms();
}

// Hiển thị form đăng ký
function showRegisterForm() {
    loginModal.style.display = 'block';
    wrapper.classList.add('active'); // Chuyển sang form Đăng ký
    resetForms();
}
function resetForms() {
    document.getElementById("loginForm").reset(); // Reset form đăng nhập
    document.getElementById("registerForm").reset(); // Reset form đăng ký
    document.getElementById("loginMessage").textContent = ""; // Xóa thông báo lỗi đăng nhập
    document.getElementById("registerMessage").textContent = ""; // Xóa thông báo lỗi đăng ký
}
const opuser = document.querySelector('.Opuser');
// Đóng Opuser
document.addEventListener('click', function (event) {
    if (!userIcon.contains(event.target) && !opuser.contains(event.target)) {
        userIcon.classList.remove('active');
    }
});

// Đóng modal
function hideLoginForm() {
    loginModal.style.display = 'none';
}

// Đăng ký sự kiện chuyển đổi giữa Đăng nhập và Đăng ký
if (signUpBtnLink) {
    signUpBtnLink.addEventListener('click', (event) => {
        event.preventDefault();
        wrapper.classList.add('active'); // Chuyển sang form Đăng ký
        resetForms(); // Reset dữ liệu
    });
}

if (signInBtnLink) {
    signInBtnLink.addEventListener('click', (event) => {
        event.preventDefault();
        wrapper.classList.remove('active'); // Quay lại form Đăng nhập
        resetForms(); // Reset dữ liệu
    });
}

// Đăng ký sự kiện mở form đăng nhập
if (authButton) {
    authButton.onclick = showLogin;
}

// Lấy thẻ <a class="user"> và modal đăng nhập
const userIcon = document.querySelector('.user');
let isLoggedOut = false;
// Kiểm tra user hiện tại trong localStorage
function checkCurrentUser() {
    // const currentUser = localStorage.getItem('currentUser'); 
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser && !isLoggedOut) {
        // Nếu currentUser trống -> hiển thị form đăng nhập
        resetForms();
        loginModal.style.display = 'block';
        userIcon.classList.remove('active');
    } else {
        if (userIcon.classList.contains('active')) {
            userIcon.classList.remove('active'); // Đóng Opuser
        } else {
            userIcon.classList.add('active'); // Mở Opuser
        }
    }
}
// Đăng ký sự kiện click cho biểu tượng user
if (userIcon) {
    userIcon.addEventListener('click', checkCurrentUser);
}

// Đóng modal khi nhấn ra ngoài
window.addEventListener('click', (event) => {
    if (event.target === loginModal) {
        hideLoginForm();
    }
});
function getNextUserId() {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) return 1; // Nếu không có người dùng nào, bắt đầu từ ID 1
    return Math.max(...users.map(user => user.id)) + 1; // Lấy ID lớn nhất và cộng thêm 1
}

// Xử lý đăng ký
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn chặn hành động gửi mặc định của form

    // Lấy giá trị từ form đăng ký
    const email = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const isChecked = document.getElementById("registerCheckbox").checked;

    // Tạo đối tượng người dùng
    const user = {
        id: getNextUserId(), // Lấy ID tự tăng
        email: email,
        password: password,
        address: {
            city: "",
            district: "",
            ward: "",
            street: ""
        }, // sẽ cập nhật sau khi mua hàng
        spending: 0,   // mặc định là 0, sẽ cập nhật khi mua hàng
        numberphone: "",
        status: 'unlocked', // Trạng thái người dùng ban đầu là mở khóa
        name: "",
        cart: []
    };

    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra email đã tồn tại
    const emailExists = users.some(u => u.email === email);

    if (!isValidEmail(email)) {
        showToast('Email không hợp lệ. Vui lòng kiểm tra lại.', "error");
        registerEmailInput.value = "";;
        return;
    }

    if (emailExists) {
        // Hiển thị thông báo lỗi nếu email đã tồn tại
        showToast("Email đã tồn tại", "error");
    } else if (!isChecked) {
        // Kiểm tra nếu người dùng chưa đồng ý điều khoản
        document.getElementById("registerMessage").textContent = "Vui lòng đồng ý với các điều khoản.";
    } else {
        // Thêm người dùng vào danh sách và lưu vào localStorage
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        showToast("Đăng ký thành công!", "success");
        document.getElementById("registerForm").reset(); // Đặt lại form
        document.getElementById("registerMessage").textContent = ""; // Xóa thông báo lỗi
        wrapper.classList.remove('active');
    }
});

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailPattern.test(email);
}

// Xử lý đăng nhập
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn không reload trang

    // Lấy giá trị từ các input đăng nhập
    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Lấy danh sách người dùng từ localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Tìm kiếm người dùng có email và mật khẩu khớp
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
        // Kiểm tra trạng thái tài khoản
        if (foundUser.status === 'locked') {
            // Hiển thị thông báo nếu tài khoản bị khóa
            showToast("Tài khoản của bạn đã bị khóa !", "error");
        } else {
            showToast("Đăng nhập thành công!", "success");
            localStorage.setItem("currentUser", JSON.stringify(foundUser)); // Lưu người dùng hiện tại
            document.getElementById("loginForm").reset(); // Đặt lại form
            document.getElementById("loginMessage").textContent = ""; // Xóa thông báo lỗi
            hideLoginForm();
            checkLoginStatus();
            showCart();
            updateQtyItem();
            updateCartTotal();
        }
    } else {
        // Hiển thị thông báo lỗi nếu đăng nhập thất bại
        showToast("Email hoặc mật khẩu không chính xác", "error");
    }
});

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Lấy thông tin người dùng từ localStorage
    const userNameElement = document.getElementById('tennguoidung');
    if (currentUser) {
        const userEmail = currentUser.email;
        let userName = userEmail.split('@')[0]; // Lấy phần tên người dùng trước dấu "@"

        const maxLength = 10;
        if (userName.length > maxLength) {
            userName = userName.substring(0, maxLength) + '...';
        }

        userNameElement.innerText = userName;

        // reset đơn hàng về
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        renderOrders(orders);
    } else {
        // Nếu không có người dùng, xóa tên người dùng và hiển thị giao diện chưa đăng nhập
        userNameElement.innerText = 'Đăng nhập';
        document.querySelector('.container_Pur').style.display = 'none';
        document.getElementById('slider').style.display = 'flex';
        document.getElementById('main').style.display = 'block';
        document.getElementById('footer').style.display = 'block';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus();
});

gologout.addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    isLoggedOut = true;
    checkLoginStatus();
    showCart();
    updateQtyItem();
    updateCartTotal();
    setTimeout(() => {
        isLoggedOut = false;
    }, 100);
});
goPur.addEventListener('click', function () {
    document.querySelector('.container_Pur').style.display = 'flex';
    document.getElementById('slider').style.display = 'none';
    document.getElementById('main').style.display = 'none';
    document.getElementById('footer').style.display = 'none';
})
eyeIcon.addEventListener('click', function () {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Hiển thị mật khẩu
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
    else {
        passwordInput.type = 'password'; // Ẩn mật khẩu
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
});
regEyeIcon.addEventListener('click', function () {
    if (registerPasswordInput.type === 'password') {
        registerPasswordInput.type = 'text';
        regEyeIcon.classList.remove('fa-eye');
        regEyeIcon.classList.add('fa-eye-slash');
    }
    else {
        registerPasswordInput.type = 'password';
        regEyeIcon.classList.remove('fa-eye-slash');
        regEyeIcon.classList.add('fa-eye');
    }
});

// Định dạng giá VND
function vnd(price) {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


// Back to top
window.onscroll = () => {
    let backtopTop = document.querySelector(".back-to-top")
    if (document.documentElement.scrollTop > 100) {
        backtopTop.classList.add("active");
    } else {
        backtopTop.classList.remove("active");
    }
}
// Format ngày tháng
function formatDate(date) {
    let fm = new Date(date);
    let yyyy = fm.getFullYear();
    let mm = fm.getMonth() + 1;
    let dd = fm.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return dd + '/' + mm + '/' + yyyy;
}

function indexLoadPage() {
    // Gọi các hàm để khởi tạo các phần cần thiết của trang
    renderProducts(products);  // Truyền một mảng sản phẩm mẫu vào hàm renderProducts
    initializeModelSelection(document.querySelectorAll('.model_option'), document.getElementById('model_name'));
    initializeProductPreview(document.querySelector('.product_container'));
    renderCart();
}

// Tạo và hiển thị sản phẩm
function renderProducts(showProduct) {
    const productDetail = document.querySelector(".product_detail");
    productDetail.innerHTML = ''; // Clear existing products

    if (showProduct.length === 0) {
        document.getElementById("main_product").style.display = "none";
        productDetail.innerHTML = `
            <div class="no-result">
                <div class="no-result-h">Không tìm thấy kết quả tìm kiếm</div>
                <div class="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div>
                <div class="no-result-i"><i class="fa-light fa-face-sad-cry"></i></div>
            </div>`;
    } else {
        document.getElementById("main_product").style.display = "block";
        showProduct.forEach((product) => {
            const productItem = `
                <div class="product_items">
                    <img src="${product.img}" onerror="this.src='blank-image.png'" style="background: transparent;">
                    <div class="title">${product.name}</div>
                    <div class="price">
                        <span class="curr_price">${vnd(product.price)}</span>
                    </div>
                    <button onclick="detailProduct(${product.id})">Xem chi tiết</button>
                </div>`;
            productDetail.innerHTML += productItem;
        });
    }
    // Sau khi render xong, gọi lại hàm tìm kiếm nếu có
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        performSearch(query);
    }
}


function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        return false;
    }
    return true;
}
// Trang chi tiết sản phẩm
function detailProduct(index) {
    // Tìm thông tin sản phẩm theo id
    let infoProduct = products.find(sp => sp.id === index);

    // Tạo nội dung modal cho trang chi tiết sản phẩm
    let modalHtml = `
        <div class="product_container">
            <button class="close_detail_btn"><i class="fa-solid fa-caret-left"></i></button>
            <div class="main_image_preview">
                <img src="${infoProduct.img}" alt="Main Image">
            </div>
            <div class="product_details">
                <div class="title_group">
                    <div class="Info">
                        <h1>${infoProduct.name}</h1>
                        <div class="Model">${infoProduct.model}</div>
                    </div>
                    <div class="Price">
                        <h2>${vnd(infoProduct.price)}</h2>
                    </div>
                </div>
                <div class="product_attributes">
                    <div class="add_to_cart_button">
                        <button onclick="addCart(${infoProduct.id})"><strong>Thêm vào giỏ hàng</strong></button>
                    </div>
                </div>
                <h3 class="product_feature_tittle">Thông tin sản phẩm</h3>
                <div class="product_features">${infoProduct.desc}</div>
                <div class="policy_section">
                    <div class="policy_item">
                        <div class="policy_summary">
                            <span>Giao hàng miễn phí</span>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <div class="policy_content">
                            <p>MOBCASE miễn phí vận chuyển cho mọi đơn hàng!</p></br>
                            <p><strong>Thời gian dự kiến nhận hàng:</strong> 02 – 05 ngày làm việc kể từ ngày đặt đơn.</p></br>
                            <p>Trước khi nhận hàng và thanh toán, Quý Khách được quyền kiểm tra sản phẩm. Không hỗ trợ thử hàng.</p></br>
                            <p>Quý Khách vui lòng mở gói hàng kiểm tra để đảm bảo đơn hàng được giao đúng mẫu mã, số lượng như đơn hàng đã đặt. Không thử hay dùng thử sản phẩm.</p>
                        </div>
                    </div>
                    <div class="policy_item">
                        <div class=policy_summary>
                            <span>Bảo hành 1 đổi 1</span>
                            <i class="fa-solid fa-angle-down"></i>
                        </div>
                        <div class="policy_content">
                            <p>Sản phẩm được bảo hành đổi trả trong 30 ngày nếu có lỗi từ nhà sản xuất.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Tạo modal
    let modal = document.createElement('div');
    modal.classList.add('KhuChiTiet'); // Thêm class cho modal
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);

    // Tạo backdrop
    const backdrop = document.querySelector('.backdrop');
    document.body.style.overflow = "hidden";
    // Hiển thị modal và backdrop
    modal.classList.add('open');
    backdrop.classList.add('open');

    // Lấy nút đóng modal
    let closeDetailBtn = document.querySelector('.close_detail_btn');

    // Đóng modal khi click vào backdrop hoặc button
    closeDetailBtn.addEventListener('click', closeDetail);
    backdrop.addEventListener('click', closeDetail);

    // Hàm đóng modal
    function closeDetail() {
        modal.classList.remove('open');
        backdrop.classList.remove('open');
        modal.remove();
        document.body.style.overflow = "auto"
    }


    document.querySelectorAll('.policy_item').forEach(item => {
        const summaryDetail = item.querySelector(".policy_summary");
        summaryDetail.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Nếu phần tử chưa mở, mở nó
            if (!isOpen) {
                item.classList.add('open');
            } else {
                // Nếu phần tử đã mở, đóng lại
                item.classList.remove('open');
            }
        });
    });
}





/* --------------------- *\
       TRANG CHI TIẾT
/* --------------------- */

/*Shopping cart*/
const cart = document.getElementById('sidecart');
const backdrop = document.querySelector('.backdrop');

//Open Shopping Cart

function openCart() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // Lấy thông tin người dùng từ localStorage
    if (!currentUser) {
        showToast("Vui lòng đăng nhập để xem giỏ hàng");
        showLogin();
        return
    }
    document.body.style.overflow = "hidden";
    cart.classList.add('open');
    backdrop.classList.add('open')
}

//Close Shopping Cart
backdrop.addEventListener('click', closeCart); // Đóng giỏ hàng khi click backdrop
function closeCart() {
    document.body.style.overflow = "auto"
    cart.classList.remove('open');
    backdrop.classList.remove('open')
}


// Lấy danh sách sản phẩm từ localStorage
var products = JSON.parse(localStorage.getItem('products')) || [];


// Thêm sản phẩm vào giỏ hàng
function addCart(productId) {
    if (!checkLogin()) {
        showToast("Vui lòng đăng nhập để mua hàng !", "error");
        showLogin(); // Hiển thị modal login nếu chưa đăng nhập
        return;  // Không tiếp tục nếu chưa đăng nhập
    }
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    let checkProduct = currentUser.cart.find(value => value.id == productId);

    if (!checkProduct) {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới vào giỏ hàng
        let productCurrent = products.find(value => value.id == productId);

        if (productCurrent) {
            currentUser.cart.push({
                id: productCurrent.id,
                img: productCurrent.img,
                name: productCurrent.name,
                price: productCurrent.price,
                soluong: 1
            });
            localStorage.setItem('currentUser', JSON.stringify(currentUser));  // Lưu giỏ hàng vào localStorage
            // Lấy danh sách người dùng từ localStorage
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Cập nhật giỏ hàng trong danh sách người dùng
            users.forEach(user => {
                if (user.id === currentUser.id) {
                    user.cart = currentUser.cart; // Cập nhật giỏ hàng của người dùng
                }
            });

            // Lưu lại danh sách người dùng đã được cập nhật vào localStorage
            localStorage.setItem("users", JSON.stringify(users));




            updateQtyItem();  // Cập nhật số lượng sản phẩm trong giỏ
        }
    } else {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên 1
        let productIndex = currentUser.cart.findIndex(value => value.id == productId);
        if (productIndex !== -1) {
            let productCurrent = currentUser.cart[productIndex];
            productCurrent.soluong++;  // Tăng số lượng sản phẩm
            currentUser.cart[productIndex] = productCurrent;  // Cập nhật lại giỏ hàng
            localStorage.setItem('currentUser', JSON.stringify(currentUser));  // Lưu lại giỏ hàng vào localStorage


            const users = JSON.parse(localStorage.getItem("users")) || [];
            // Cập nhật giỏ hàng trong danh sách người dùng
            users.forEach(user => {
                if (user.id === currentUser.id) {
                    user.cart = currentUser.cart; // Cập nhật giỏ hàng của người dùng
                }
            });
            localStorage.setItem("users", JSON.stringify(users));

            updateQtyItem();  // Cập nhật số lượng sản phẩm trong giỏ
        }
    }
    showCart();  // Hiển thị giỏ hàng sau khi thêm sản phẩm
    showToast("Thêm thành công !", "success");
}



// Hàm hiển thị giỏ hàng
function showCart() {
    const cartItemContainer = document.querySelector('.cart_item');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Kiểm tra nếu người dùng đăng nhập và giỏ hàng không rỗng
    if (currentUser && currentUser.cart && currentUser.cart.length > 0) {
        let ItemContent = '';
        currentUser.cart.forEach(product => {
            ItemContent += `
            <div class="item">
                <div class="remove_item" onclick="removeItem(${product.id})"> <span>&times;</span> </div>
                <div class="item_pic"> <img src="${product.img}" alt=""> </div>
                <div class="item_detail">
                    <p>${product.name}</p> <strong>${vnd(product.price)}</strong>
                    <div class="Tang_Giam">
                        <span onclick="updateQuantity(this, 'decrease', ${product.id})">-</span>
                        <strong>${product.soluong}</strong> 
                        <span onclick="updateQuantity(this, 'increase', ${product.id})">+</span>
                    </div>
                </div>
            </div>`;
        });
        cartItemContainer.innerHTML = ItemContent;
        updateCartTotal();
    } else {
        cartItemContainer.innerHTML = `
        <div class="gio_hang_trong">
            <i class="fa-solid fa-cart-arrow-down"></i>
            <p>Giỏ hàng của bạn đang trống.</p>
        </div>
        `;
    }
}


// Cập nhật số lượng sản phẩm trong giỏ
function updateQuantity(element, action, id) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let product = currentUser.cart.find(item => item.id == id);

    if (action === 'increase') {
        product.soluong++;  // Tăng số lượng sản phẩm
    } else if (action === 'decrease' && product.soluong > 1) {
        product.soluong--;  // Giảm số lượng sản phẩm (không được nhỏ hơn 1)
    }

    // Cập nhật lại giỏ hàng trong localStorage
    let vitri = currentUser.cart.findIndex(item => item.id == id);
    currentUser.cart[vitri] = product;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));


    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Cập nhật giỏ hàng trong danh sách người dùng
    users.forEach(user => {
        if (user.id === currentUser.id) {
            user.cart = currentUser.cart; // Cập nhật giỏ hàng của người dùng
        }
    });
    localStorage.setItem("users", JSON.stringify(users));

    showCart();
    updateQtyItem();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(id) {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Tìm và xóa sản phẩm khỏi giỏ hàng
    currentUser.cart = currentUser.cart.filter(item => item.id != id);
    // Cập nhật lại localStorage
    localStorage.setItem("currentUser", JSON.stringify(currentUser));


    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Cập nhật giỏ hàng trong danh sách người dùng
    users.forEach(user => {
        if (user.id === currentUser.id) {
            user.cart = currentUser.cart; // Cập nhật giỏ hàng của người dùng
        }
    });
    localStorage.setItem("users", JSON.stringify(users));

    showCart();
    updateQtyItem();
    updateCartTotal();
}


function getQtyItem() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let totalQuantity = 0;

    if (currentUser && currentUser.cart) {
        currentUser.cart.forEach(product => {
            totalQuantity += product.soluong;
        });
    }

    return totalQuantity;
}


// Cập nhật tổng số lượng sản phẩm trong giỏ
function updateQtyItem() {
    const totalQty = getQtyItem(); // Gọi hàm getQtyItem để lấy tổng số lượng
    document.querySelector(".count-product-cart").innerText = totalQty;
}


// Cập nhật tổng giá trị giỏ hàng
function updateCartTotal() {
    let TongTien = getCartTotal();
    document.querySelector(".tongtien_gia").innerText = vnd(TongTien);
}

// Tính tổng tiền
function getCartTotal() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let TongTien = 0;  // Khởi tạo biến tính tổng tiền

    if (currentUser && currentUser.cart && currentUser.cart.length > 0) {
        // Duyệt qua tất cả các sản phẩm trong giỏ hàng
        for (let i = 0; i < currentUser.cart.length; i++) {
            let product = currentUser.cart[i];

            // Kiểm tra nếu giá của sản phẩm là một chuỗi, nếu không chuyển nó thành chuỗi
            let inputPrice = product.price;
            if (typeof inputPrice !== 'string') {
                inputPrice = inputPrice.toString();  // Chuyển giá thành chuỗi
            }

            // Làm sạch giá sản phẩm (nếu có ký tự '₫' hoặc dấu '.')
            inputPrice = inputPrice.replace('₫', '').replace(/\./g, '').trim();

            // Tính tổng tiền cho sản phẩm này (số lượng * giá)
            let SumPrice = parseInt(inputPrice) * product.soluong;

            // Cộng dồn tổng tiền
            TongTien += SumPrice;
        }
    }

    return TongTien;
}


window.onload = function () {
    updateQtyItem();
    showCart();
};







// Phân trang 
let perPage = 12;
let currentPage = 1;
function displayList(productAll, perPage, currentPage) {
    let start = (currentPage - 1) * perPage;
    let end = start + perPage;
    let productShow = productAll.slice(start, end);  // Hiển thị các sản phẩm theo phạm vi trang hiện tại

    const productSection = document.querySelector(".product_detail");
    const offset = 300;  // Cuộn mượt đến vị trí

    const topPosition = productSection.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({
        top: topPosition,
        behavior: "smooth",
    });
    renderProducts(productShow);  // Gọi hàm renderProducts để hiển thị các sản phẩm đã lọc và phân trang
}

//setup số trang hiển thị
function setupPagination(productAll) {
    const pageNavList = document.querySelector('.page-nav-list');
    pageNavList.innerHTML = '';
    let pageCount = Math.ceil(productAll.length / perPage);

    // "Prev" button
    let prev = document.createElement('li');
    prev.classList.add('page-nav-item');
    prev.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-arrow-left"></i></a>`;
    prev.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll);
        }
    });
    pageNavList.appendChild(prev);

    // Page numbers
    let startPage = Math.max(currentPage - 1, 1);  // Hiển thị 3 trang gần nhau
    let endPage = Math.min(currentPage + 1, pageCount);

    if (startPage > 1) {
        let firstPage = document.createElement('li');
        firstPage.classList.add('page-nav-item');
        firstPage.innerHTML = `<a href="javascript:;">1</a>`;
        firstPage.addEventListener('click', function () {
            currentPage = 1;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll);
        });
        pageNavList.appendChild(firstPage);

        let dots = document.createElement('li');
        dots.classList.add('page-nav-item', 'dots');
        dots.innerHTML = '...';
        pageNavList.appendChild(dots);
    }

    for (let i = startPage; i <= endPage; i++) {
        let li = document.createElement('li');
        li.classList.add('page-nav-item');
        li.innerHTML = `<a href="javascript:;">${i}</a>`;
        if (currentPage == i) li.classList.add('active');
        li.addEventListener('click', function () {
            currentPage = i;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll);
        });
        pageNavList.appendChild(li);
    }

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
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll);
        });
        pageNavList.appendChild(lastPage);
    }

    // "Next" button
    let next = document.createElement('li');
    next.classList.add('page-nav-item');
    next.innerHTML = `<a href="javascript:;"><i class="fa-solid fa-arrow-right"></i></a>`;
    next.addEventListener('click', function () {
        if (currentPage < pageCount) {
            currentPage++;
            displayList(productAll, perPage, currentPage);
            setupPagination(productAll);
        }
    });
    pageNavList.appendChild(next);
}











// BỘ LỌC sản phẩm theo danh mục
// Hàm mở/đóng menu bộ lọc mobile
function toggleFilterMenuMobile() {
    const filterMenuMobile = document.querySelector('.filter_list_mobile');
    filterMenuMobile.classList.toggle('open');  // Mở hoặc đóng menu
}
// Hàm chọn bộ lọc và đóng menu mobile
function selectFilterMobile(category) {
    filterProduct(category); // Lọc sản phẩm theo danh mục
    const filterMenuMobile = document.querySelector('.filter_list_mobile');
    filterMenuMobile.classList.remove('open'); // Đóng menu sau khi chọn
}
function toggleFilterMenu() {
    const filterMenuMobile = document.querySelector('.filter_list_mobile');
    const filterMenu = document.querySelector('.filter_menu');
    if (filterMenuMobile.classList.contains('open')) {
        filterMenuMobile.classList.remove('open');
    }
    filterMenu.classList.toggle('open');
}
let filteredProducts = [];
// Reset giá trị ô nhập giá khi thay đổi danh mục
function resetManualPriceFields() {
    document.getElementById("manualMinPrice").value = "";
    document.getElementById("manualMaxPrice").value = "";
}

function filterProduct(category, minPrice = 0, maxPrice = Infinity) {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const filteredByCategory = category === 'All'
        ? products
        : products.filter(product => product.category === category);

    filteredProducts = filteredByCategory.filter(product => {
        return product.price >= minPrice && product.price <= maxPrice;
    });

    document.querySelectorAll(".filter-item").forEach(item => item.classList.remove("active"));
    const activeItem = document.querySelector(`.filter-item[data-category="${category}"]`);
    if (activeItem) activeItem.classList.add("active");

    currentPage = 1;
    displayList(filteredProducts, perPage, currentPage);
    setupPagination(filteredProducts);

}
// Xử lý khi người dùng thay đổi danh mục
document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', function () {
        // Reset các ô nhập giá khi thay đổi danh mục
        resetManualPriceFields();

        // Lọc sản phẩm theo danh mục
        const category = item.getAttribute('data-category');
        filterProduct(category);
    });
});






// khoảng giá tự nhập
// Hàm kiểm tra và validate giá nhập vào
function validateManualPriceInput() {
    const minInput = document.getElementById("manualMinPrice");
    const maxInput = document.getElementById("manualMaxPrice");

    // Kiểm tra giá trị min và max khi người dùng blur (rời khỏi ô nhập liệu)
    minInput.addEventListener("blur", () => {
        let minValue = parseInt(minInput.value.replace(/\D/g, '')) || 0;
        let maxValue = parseInt(maxInput.value.replace(/\D/g, '')) || Infinity;

        if (minValue < 0) minInput.value = "0";  // Không cho giá trị min nhỏ hơn 0
        if (minValue > maxValue) {
            showToast("Giá nhập không hợp lệ. Vui lòng nhập lại!", "err");
            maxInput.value = minValue; // Cập nhật giá trị max bằng giá trị min nếu nhỏ hơn
        }
        // Định dạng lại giá trị min với dấu phân cách
        minInput.value = formatPrice(minValue);
    });

    maxInput.addEventListener("blur", () => {
        let minValue = parseInt(minInput.value.replace(/\D/g, '')) || 0;
        let maxValue = parseInt(maxInput.value.replace(/\D/g, '')) || Infinity;

        if (maxValue < minValue) {
            showToast("Giá nhập không hợp lệ. Vui lòng nhập lại!", "err");
            maxInput.value = minInput.value;  // Cập nhật giá trị max bằng giá trị min nếu nhỏ hơn
        }
        // Định dạng lại giá trị max với dấu phân cách
        maxInput.value = formatPrice(maxValue);
    });
}

// Hàm định dạng giá trị với dấu phân cách
function formatPrice(value) {
    return new Intl.NumberFormat('vi-VN').format(value);
}

// Hàm áp dụng lọc với khoảng giá đã nhập
function applyManualPriceFilter() {
    const minInput = document.getElementById("manualMinPrice");
    const maxInput = document.getElementById("manualMaxPrice");

    // Lấy giá trị đã nhập vào và loại bỏ dấu phân cách để tính toán
    const minPrice = parseInt(minInput.value.replace(/\D/g, '')) || 0;
    const maxPrice = parseInt(maxInput.value.replace(/\D/g, '')) || Infinity;

    console.log(`Manual Price Filter: Min = ${minPrice}, Max = ${maxPrice}`);

    // Lấy danh mục đang hoạt động (nếu có) hoặc "All" nếu chưa chọn
    const activeCategory = document.querySelector(".filter-item.active")?.getAttribute('data-category') || "All";

    // Lọc sản phẩm theo khoảng giá và danh mục
    filterProduct(activeCategory, minPrice, maxPrice);
}
document.addEventListener('DOMContentLoaded', function () {
    // Áp dụng bộ lọc giá mặc định (nếu có) khi vừa vào web
    const minInput = document.getElementById("manualMinPrice");
    const maxInput = document.getElementById("manualMaxPrice");

    if (minInput.value || maxInput.value) {
        applyManualPriceFilter(); // Nếu có giá trị, áp dụng bộ lọc
    } else {
        filterProduct("All"); // Lọc tất cả sản phẩm khi mới vào web
    }
});











// sắp xếp giá
function resetSortButtons() {
    document.querySelectorAll('.sort_button').forEach(button => {
        button.classList.remove('active');
    });
}
// Hàm sắp xếp sản phẩm
function sortPrice(order) {
    selectedSortOrder = order;
    if (filteredProducts.length === 0) return;

    // Sắp xếp sản phẩm theo giá
    filteredProducts.sort((a, b) => {
        const priceA = a.price;
        const priceB = b.price;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
    });

    currentPage = 1;
    displayList(filteredProducts, perPage, currentPage);
    setupPagination(filteredProducts);

    resetSortButtons();
    const activeButton = order === 'asc'
        ? document.querySelector('.sort_button[onclick*="asc"]')
        : document.querySelector('.sort_button[onclick*="desc"]');
    if (activeButton) activeButton.classList.add('active');
}

document.querySelectorAll('.filter-item').forEach(item => {
    item.addEventListener('click', function () {
        resetManualPriceFields();
        resetSortButtons();
        const category = item.getAttribute('data-category');
        filterProduct(category);
    });
});








// reset bộ lọc
function resetFilters() {
    // Reset giá trị nhập thủ công
    document.getElementById("manualMinPrice").value = "";
    document.getElementById("manualMaxPrice").value = "";

    filterProduct("All");

    document.querySelectorAll('.sort_button').forEach(button => button.classList.remove('active'));

    const allCategoryButton = document.querySelector('.filter-item[data-category="All"]');
    if (allCategoryButton) allCategoryButton.classList.add('active');
}





const initApp = () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    filterProduct("All");
};

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});