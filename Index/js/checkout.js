var products = JSON.parse(localStorage.getItem('products')) || [];
var currentUser = JSON.parse(localStorage.getItem('currentUser'));
const checkout = document.getElementById('checkout_page')


//  Bật trang checkout 
function thanhToan() {
  // Lấy lại currentUser từ localStorage để đảm bảo dữ liệu mới nhất
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser||currentUser.cart.length === 0) {
      showToast("Giỏ hàng của bạn đang trống !", "error");
      return;
  }

  checkout.classList.add('active');
  showProductCart(); // Gọi hàm hiển thị sản phẩm
  thanhtoanpage();
  closeCart();
  document.body.style.overflow = "hidden";
}

// Đóng trang checkout
function closecheckout() {
  checkout.classList.remove('active')
  document.body.style.overflow = "auto"
  resetCheckoutForm();
  resetPaymentMethods();
  resetDeliveryMethods();
}


/* ----- *\
  Button
\* ----- */
const PaymentMethods = document.querySelectorAll('.method');
PaymentMethods.forEach(method => {
  const radio = method.querySelector('input[type="radio"]');
  const details = method.querySelector('.details');

  radio.addEventListener('click', () => {
    PaymentMethods.forEach(item => item.classList.remove('active'));
    method.classList.add('active');
  });
});


const deliveryMethods = document.querySelectorAll('.delivery-method');
deliveryMethods.forEach(method => {
  const radio = method.querySelector('input[type="radio"]');
  const details = method.querySelector('.details');

  radio.addEventListener('click', () => {
    deliveryMethods.forEach(item => item.classList.remove('active'));
    method.classList.add('active');
  });
});



// Hien thi hang trong gio
function showProductCart() {
  let listOrder = document.getElementById("list_order_checkout");
  let listOrderHtml = '';
  currentUser.cart.forEach(item => {
    listOrderHtml +=
      `<div class="food_total">
        <div class="count">${item.soluong}x</div>
        <div class="info_food">
            <div class="name_food">${item.name}</div>
        </div>
    </div>`;
  });
  listOrder.innerHTML = listOrderHtml;
}

function thanhtoanpage() {
  // Hiển thị đơn hàng
  showProductCart();

  // Tính tiền
  totalBillOrderHtml = `
      <div class="priceFlx">
          <div class="text">
              Tiền hàng 
              <span class="count">${getQtyItem()} món</span>
          </div>
          <div class="price-detail">
              <span id="checkout_cart_total">${vnd(getCartTotal())}</span>
          </div>
      </div>
      <div class="priceFlxship">
          <div class="text">Phí vận chuyển</div>
              <span>Miễn phí</span>
      </div>`;

  // Hiển thị tổng tiền
  const summaryCheckout = document.getElementById("bill_tax");
  summaryCheckout.innerHTML = totalBillOrderHtml;

  // Cập nhật tổng tiền
  const priceFinal = document.getElementById("tongtien_gia_checkout");
  priceFinal.innerText = vnd(getCartTotal());
}


/* ------------------- *\
     Nhập thông tin
\* ------------------- */

//Số điện thoại
document.getElementById("phone").addEventListener("input", function (event) {
  let input = event.target.value.replace(/[^0-9]/g, ''); // Chỉ giữ lại các ký tự số
  event.target.value = input; // Cập nhật giá trị input
});


//Số thẻ
document.querySelector('.cardNumber_input').addEventListener('input', function (event) {
  let input = event.target.value.replace(/\D/g, ''); // Loại bỏ tất cả ký tự không phải số  

  // Chia chuỗi thành các nhóm 4 chữ số
  let formattedInput = input.replace(/(.{4})(?=.)/g, '$1 ');

  // Cập nhật giá trị của input
  event.target.value = formattedInput;
});



// Hàm lấy địa chỉ từ các trường nhập liệu (khi chọn địa chỉ mới)
function getAddress() {
  const street = document.getElementById("address").value; // Số nhà, đường
  const city = document.getElementById("provinces").value; // Tỉnh/Thành phố
  const district = document.getElementById("districts").value; // Quận/Huyện
  const ward = document.getElementById("wards").value; // Phường/Xã
  const firstName = document.getElementById("first-name").value; // Tên
  const lastName = document.getElementById("last-name").value; // Họ
  const phone = document.getElementById("phone").value; // Điện thoại

  // Kiểm tra xem người dùng đã nhập đầy đủ thông tin chưa
  if (!street || city === "Chọn tỉnh/thành phố" || district === "Chọn Quận/Huyện" || ward === "Chọn Phường/Xã" || !firstName || !lastName || !phone) {
    showToast("Vui lòng nhập đầy đủ thông tin địa chỉ giao hàng.", "error");
    return null; // Trả về null nếu thiếu thông tin
  }

  if (/[^a-zA-ZàáạảãâấầậẩẫăắằặẳẵéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữýỳỵỷỹđĐ\s]/.test(firstName) || /[^a-zA-ZàáạảãâấầậẩẫăắằặẳẵéèẹẻẽêếềệểễíìịỉĩóòọỏõôốồộổỗơớờợởỡúùụủũưứừựửữýỳỵỷỹđĐ\s]/.test(lastName)) {
    showToast("Vui lòng nhập họ tên hợp lệ.", "error");
    return null;
  }
  

  // Kiểm tra nếu số điện thoại không hợp lệ
  if (!/^0\d{9}$/.test(phone)) { //Bắt đầu = 0 và có 9 chữ số tiếp theo (sđt 10 số) / test => true/false
    showToast("Vui lòng nhập số điện thoại hợp lệ.", "error");
    return null;
  }

  // Trả về một đối tượng chứa địa chỉ và thông tin cá nhân
  return {
    street: street,
    ward: ward,
    district: district,
    city: city,
    fullName: `${lastName} ${firstName}`,
    phone: phone
  };
}

// Hàm kiểm tra địa chỉ từ tài khoản
function validateAddressFromAccount(currentUser) {
  const { street, ward, district, city } = currentUser.address;
  const { name, numberphone } = currentUser;



  // Kiểm tra địa chỉ và thông tin cá nhân từ tài khoản
  if (!street || !ward || !district || !city || !name || !numberphone) {
    showToast("Địa chỉ hoặc thông tin cá nhân từ tài khoản chưa được cập nhật. Vui lòng nhập địa chỉ mới.", "error");
    return null; // Trả về null nếu thiếu thông tin
  }

  // Kiểm tra nếu số điện thoại không hợp lệ
  if (!/^0\d{9}$/.test(numberphone)) {
    showToast("Vui lòng nhập số điện thoại hợp lệ.", "error");
    return null;
  }

  return {
    street: street,
    ward: ward,
    district: district,
    city: city,
    fullName: name,
    phone: numberphone
  };
}

// Hàm lấy địa chỉ cuối cùng
function getFinalAddress(currentUser) {
  const isAccountAddress = document.getElementById("acc-location").checked; // Kiểm tra chọn địa chỉ từ tài khoản
  const isNewAddress = document.getElementById("new-location").checked; // Kiểm tra chọn nhập địa chỉ mới

  if (isAccountAddress) {
    return validateAddressFromAccount(currentUser); // Trả về địa chỉ từ tài khoản
  } else if (isNewAddress) {
    return getAddress(); // Trả về địa chỉ mới nhập
  } else {
    showToast("Vui lòng chọn phương thức nhập địa chỉ.", "eror");
    return null;
  }
}

// Xử lý đặt hàng
document.getElementById("place-order-btn").addEventListener("click", function () {
  // Lấy địa chỉ cuối cùng
  const addressInfo = getFinalAddress(currentUser); // Sử dụng currentUser
  if (!addressInfo) return; // Dừng nếu địa chỉ không hợp lệ

  // Xử lý phương thức thanh toán
  let paymentMethod = "";
  let cardNumber = "";
  if (document.getElementById("onepay").checked) {
    paymentMethod = "OnePay";
    cardNumber = document.querySelector(".cardNumber_input").value; // Lấy số thẻ
    if (!cardNumber) {
      showToast("Vui lòng nhập số thẻ thanh toán.", "error");
      return;
    }
  } else if (document.getElementById("cod").checked) {
    paymentMethod = "COD";
  } else if (document.getElementById("bank").checked) {
    paymentMethod = "Chuyển khoản";
  } else {
    showToast("Vui lòng chọn phương thức thanh toán.", "error");
    return;
  }

  // Dữ liệu sản phẩm trong giỏ hàng
  const cart = currentUser.cart || []; // Lấy giỏ hàng từ currentUser
  if (cart.length === 0) {
    showToast("Giỏ hàng rỗng. Không thể đặt hàng.", "error");
    return;
  }

  // Tính tổng tiền
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.soluong, 0);

  // Tạo đơn hàng
  const order = {
    userid: currentUser.id,
    orderId: `ORD-${Date.now()}`, // Tạo mã đơn hàng
    orderDate: new Date().toLocaleDateString('en-CA'),
    fullName: addressInfo.fullName,
    phone: addressInfo.phone,
    address: `${addressInfo.street}, ${addressInfo.ward}, ${addressInfo.district}, ${addressInfo.city}`, // Lưu địa chỉ chi tiết
    paymentMethod: paymentMethod,
    cardNumber: cardNumber || "N/A", // Lưu số thẻ hoặc N/A nếu không có
    items: cart.map(item => ({
      productid: item.id,
      name: item.name,               // Lưu tên sản phẩm
      quantity: item.soluong,       // Lưu số lượng sản phẩm
      price: item.price,             // Lưu giá sản phẩm
      image: item.img             // Lưu ảnh sản phẩm
    })),
    totalAmount: totalAmount,
    statusText: "Chưa xử lý"
  };

  // Lưu đơn hàng vào localStorage
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || []; // Lấy danh sách đơn hàng hiện tại
  existingOrders.push(order); // Thêm đơn hàng mới vào danh sách
  localStorage.setItem("orders", JSON.stringify(existingOrders)); // Cập nhật lại localStorage

  // Xóa giỏ hàng sau khi đặt hàng thành công
  currentUser.cart = [];
  localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Cập nhật lại currentUser trong localStorage


  // Cập nhật giỏ hàng trong danh sách users
  const users = JSON.parse(localStorage.getItem("users")) || [];
  users.forEach(user => {
    if (user.id === currentUser.id) {
      user.cart = []; // Làm rỗng giỏ hàng
    }
  });
  localStorage.setItem("users", JSON.stringify(users));


  window.onload = updateQtyItem();
  window.onload = showCart();
  window.onload = updateCartTotal();

  console.log("Đơn hàng:", order);
  showToast("Đơn hàng của bạn đã được đặt thành công!", "success");
  closecheckout();

  renderOrders(existingOrders); // add vao lich su mua
});





/* ============ *\
    Reset nhập
/* ============ */
function resetCheckoutForm() {
  document.querySelector('.cardNumber_input').value = ''; // Reset trường nhập số thẻ
  document.getElementById("address").value = ''; // Reset số nhà, đường
  document.getElementById("provinces").value = 'Chọn tỉnh/thành phố'; // Reset tỉnh/thành phố
  document.getElementById("districts").value = 'Chọn Quận/Huyện'; // Reset quận/huyện
  document.getElementById("wards").value = 'Chọn Phường/Xã'; // Reset phường/xã
  document.getElementById("first-name").value = ''; // Reset tên
  document.getElementById("last-name").value = ''; // Reset họ
  document.getElementById("phone").value = ''; // Reset điện thoại
}

// Hàm reset các button phương thức giao hàng
function resetDeliveryMethods() {
  const deliveryMethods = document.querySelectorAll('.delivery-method');
  deliveryMethods.forEach(method => {
    method.classList.remove('active');
  });
}

// Hàm reset các button phương thức thanh toán
function resetPaymentMethods() {
  const PaymentMethods = document.querySelectorAll('.method');
  PaymentMethods.forEach(method => {
    method.classList.remove('active');

  });
}

