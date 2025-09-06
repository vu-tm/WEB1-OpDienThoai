// Hàm để làm cho số liệu chạy tới giá trị đúng
function animateValue(id, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        document.getElementById(id).textContent = currentValue;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}



// Dữ liệu thu nhập của năm nay và năm trước
const currentYearData = [3000, 2500, 3200, 2900, 2700, 3100, 3300, 2800, 3600,4000]; // 9 tháng
const previousYearData = [2800, 2200, 3100, 2500, 2900, 3000, 2700, 2500, 3300, 3200, 3400, 3500]; // 12 tháng

// Tạo biểu đồ
const ctx = document.getElementById('incomeChart').getContext('2d');

// Tháng hiển thị
const labels = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5',
    'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10',
    'Tháng 11', 'Tháng 12'
];

const incomeChart = new Chart(ctx, {
    type: 'line', // Biểu đồ dạng đường
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Năm Nay',
                data: currentYearData.concat(new Array(3).fill(null)), // Thêm null cho các tháng không có dữ liệu
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Màu nền cho khu vực bên dưới đường
                borderColor: 'rgba(75, 192, 192, 1)', // Màu cho đường
                borderWidth: 3, // Độ dày của đường
                fill: true, // Đổ màu bên dưới đường
                pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Màu cho các điểm
                pointBorderColor: '#fff', // Màu viền cho các điểm
                pointRadius: 5, // Kích thước của các điểm
                pointHoverRadius: 7, // Kích thước khi hover
                tension: 0.4, // Độ cong của đường
                hoverBackgroundColor: 'rgba(75, 192, 192, 0.4)' // Màu nền khi hover
            },
            {
                label: 'Năm Trước',
                data: previousYearData, // Dữ liệu cho năm trước
                backgroundColor: 'rgba(153, 102, 255, 0.2)', // Màu nền cho khu vực bên dưới đường
                borderColor: 'rgba(153, 102, 255, 1)', // Màu cho đường
                borderWidth: 3, // Độ dày của đường
                fill: true, // Đổ màu bên dưới đường
                pointBackgroundColor: 'rgba(153, 102, 255, 1)', // Màu cho các điểm
                pointBorderColor: '#fff', // Màu viền cho các điểm
                pointRadius: 5, // Kích thước của các điểm
                pointHoverRadius: 7, // Kích thước khi hover
                tension: 0.4, // Độ cong của đường
                hoverBackgroundColor: 'rgba(153, 102, 255, 0.4)' // Màu nền khi hover
            }
        ]
    },
    options: {
        responsive: true, // Responsive
        maintainAspectRatio: false, // Không giữ tỷ lệ khung hình
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)', // Màu lưới
                }
            },
            x: {
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)', // Màu lưới
                }
            }
        },
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(75, 75, 75, 0.8)', // Màu nền cho tooltip
                titleColor: '#fff', // Màu tiêu đề
                bodyColor: '#fff' // Màu nội dung
            },
            legend: {
                labels: {
                    color: '#333' // Màu chữ cho nhãn
                }
            }
        }
    }
});



// Hàm cập nhật bảng khách hàng với bộ lọc thời gian
function updateTableThongKe(startDate = "", endDate = "") {
    const tabletopkhachhang = document.getElementById("topkhachhang").getElementsByTagName('tbody')[0];

    // Lấy dữ liệu từ localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];  // Dữ liệu đơn hàng
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];    // Dữ liệu người dùng

    // Tạo một mảng tạm để lưu chi tiêu của người dùng
    let userSpending = {};

    // Lọc các đơn hàng có trạng thái "Đã Giao Hàng" và trong khoảng thời gian lọc
    allOrders.forEach(order => {
        if (order.statusText === "Đã giao hàng") {
            const orderDate = new Date(order.orderDate).toLocaleDateString('en-CA');  // Chuyển về định dạng chuẩn
            if ((!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate)) {
                // Duyệt qua các sản phẩm trong đơn hàng và tính tổng chi tiêu
                order.items.forEach(item => {
                    // Lấy userId của đơn hàng và tính tổng chi tiêu
                    if (!userSpending[order.userid]) {
                        userSpending[order.userid] = 0;  // Nếu chưa có, khởi tạo
                    }
                    userSpending[order.userid] += item.price * item.quantity;  // Cộng chi tiêu
                });
            }
        }
    });

    // Lọc ra các người dùng có chi tiêu (spending) > 0 từ mảng userSpending
    const filteredUsers = allUsers.filter(user => {
        return userSpending[user.id] > 0;  // Chỉ giữ lại những người dùng có chi tiêu
    });

    // Sắp xếp người dùng theo chi tiêu giảm dần
    const sortedUsers = filteredUsers.sort((a, b) => userSpending[b.id] - userSpending[a.id]);

    // Xóa nội dung cũ của bảng
    tabletopkhachhang.innerHTML = '';

    // Duyệt qua danh sách người dùng đã lọc và thêm vào bảng
    sortedUsers.forEach((user, index) => {
        const spending = userSpending[user.id];  // Lấy chi tiêu của người dùng từ biến tạm
        const newRow = `
            <tr>
                <td>${index + 1}</td> <!-- Số thứ tự -->
                <td onclick="showUserDetails('${user.id}', '${startDate}', '${endDate}')" style="cursor: pointer; color: blue;">${user.id}</td>
                <td>${user.name || user.email}</td> <!-- Tên khách hàng -->
                <td>${user.numberphone || 'Chưa cập nhật'}</td> <!-- Số điện thoại -->
                <td>${formatCurrencygiohang(spending) || 'Chưa có dữ liệu'}</td> <!-- Tổng chi tiêu -->
            </tr>
        `;
        tabletopkhachhang.innerHTML += newRow; // Thêm dòng mới vào bảng
    });

    // Nếu không có khách hàng nào thỏa điều kiện lọc
    if (sortedUsers.length === 0) {
        tabletopkhachhang.innerHTML = '<tr><td colspan="5">Không có khách hàng nào thỏa điều kiện.</td></tr>';
    }
}


function showUserDetails(userId, startDate = null, endDate = null) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    // Tìm thông tin người dùng
    const user = users.find(u => String(u.id) === String(userId));
    if (!user) {
        alert('Không tìm thấy người dùng!');
        return;
    }

    // Lọc các đơn hàng thuộc về người dùng
    let userOrders = orders.filter(order => order.userid === user.id);

    // Áp dụng bộ lọc thời gian nếu có
    if (startDate || endDate) {
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        userOrders = userOrders.filter(order => {
            const orderDate = new Date(order.orderDate); // Giả sử `order.orderDate` là chuỗi định dạng `YYYY-MM-DD`
            if (start && orderDate < start) return false; // Loại bỏ nếu trước ngày bắt đầu
            if (end && orderDate > end) return false; // Loại bỏ nếu sau ngày kết thúc
            return true;
        });
    }

    // Tính toán thống kê
    let totalOrders = 0;
    let totalCancelled = 0;
    let totalSpent = 0;

    userOrders.forEach(order => {
        if (order.statusText === 'Đã giao hàng') {
            totalOrders++;
            totalSpent += order.totalAmount;
        } else if (order.statusText === 'Đã hủy') {
            totalCancelled++;
        }
    });

    // Tạo nội dung modal
    const modalContent = `
        <div class="modal-content">
            <span class="close-button" onclick="closeUserDetails()">&times;</span>
            <div class="container-bill">
                <div class="header-bill">
                    <b>Hóa đơn tổng quan của khách hàng ${user.name}</b>
                </div>
                <div class="box-bill">
                    <div class="box-bill-con">
                        <div class="box-icon_bill">
                            <img src="img/quality_restoration_20241115223458915.png" alt="" style="width: 70%;">
                        </div>
                        <div class="box-info_bill"> <h3>Tổng đơn đã mua: ${totalOrders}</h3></div>
                    </div>
                    <div class="box-bill-con">
                        <div class="box-icon_bill">
                            <img src="img/quality_restoration_20241115223439909.png" alt="" style="width: 65%;">
                        </div>
                        <div class="box-info_bill"> <h3>Tổng đơn đã hủy: ${totalCancelled}</h3></div>
                    </div>
                    <div class="box-bill-con">
                        <div class="box-icon_bill">
                            <img src="img/quality_restoration_20241115223419656.png" alt="" style="width: 70%;">
                        </div>
                        <div class="box-info_bill"><h3>Tổng chi tiêu: ${formatCurrency(totalSpent)}</h3></div>
                    </div>
                </div>
                <div class="content-bill">
                    <table class="nested-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Ngày mua</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Tình Trạng</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userOrders.map((order, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${order.orderId}</td>
                                    <td>${order.orderDate}</td>
                                    <td>${formatCurrency(order.totalAmount)}</td>
                                    <td>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                                    <td>${order.statusText}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Hiển thị modal
    const modal = document.getElementById('modalThongke'); // Đảm bảo có modal với ID này trong HTML
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
}


// Hàm đóng modal
function closeUserDetails() {
    const modal = document.getElementById('modalThongke');
    modal.style.display = 'none';
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
}





document.getElementById("unique-filter-toggle-customer").addEventListener("click", function () {
    const filterDiv = document.getElementById("unique-filter-time-customer");
    if (filterDiv.style.display === "none" || !filterDiv.style.display) {
        filterDiv.style.display = "flex"; // Hiển thị bộ lọc
    } else {
        filterDiv.style.display = "none"; // Ẩn bộ lọc
    }
});

document.getElementById("unique-filter-apply-btn-customer").addEventListener("click", function () {
    const startDate = document.getElementById("unique-filter-start-date-customer").value;
    const endDate = document.getElementById("unique-filter-end-date-customer").value;

    if (!startDate || !endDate) {
        showToast("Vui lòng chọn đầy đủ từ ngày và đến ngày.", "error");
        return;
    }

    console.log("Lọc khách hàng từ ngày:", startDate, "đến ngày:", endDate);

    // Cập nhật bảng khách hàng theo thời gian
    updateTableThongKe(startDate, endDate);
});

document.getElementById("unique-filter-clear-btn-customer").addEventListener("click", function () {
    document.getElementById("unique-filter-start-date-customer").value = "";
    document.getElementById("unique-filter-end-date-customer").value = "";

    console.log("Xóa điều kiện lọc khách hàng.");
    // Hiển thị lại bảng khách hàng mà không áp dụng lọc
    updateTableThongKe();
});



document.getElementById("unique-filter-toggle-product").addEventListener("click", function () {
    const filterDiv = document.getElementById("unique-filter-time-product");
    if (filterDiv.style.display === "none" || !filterDiv.style.display) {
        filterDiv.style.display = "flex"; // Hiển thị bộ lọc
    } else {
        filterDiv.style.display = "none"; // Ẩn bộ lọc
    }
});

document.getElementById("unique-filter-apply-btn-product").addEventListener("click", function () {
    const startDate = document.getElementById("unique-filter-start-date-product").value;
    const endDate = document.getElementById("unique-filter-end-date-product").value;

    if (!startDate || !endDate) {
        showToast("Vui lòng chọn đầy đủ từ ngày và đến ngày.", "error");
        return;
    }

    console.log("Lọc sản phẩm từ ngày:", startDate, "đến ngày:", endDate);

    // Cập nhật bảng sản phẩm theo thời gian
    updateTablethongkesanpham(startDate, endDate);
});

document.getElementById("unique-filter-clear-btn-product").addEventListener("click", function () {
    document.getElementById("unique-filter-start-date-product").value = "";
    document.getElementById("unique-filter-end-date-product").value = "";

    console.log("Xóa điều kiện lọc sản phẩm.");
    // Hiển thị lại bảng sản phẩm mà không áp dụng lọc
    updateTablethongkesanpham();
});
















window.addEventListener("load", function () {
    updateTablethongkesanpham();
    updateTableThongKe();
    updateTableKhachHangMoi();

});














function updateTableKhachHangMoi() {
    // Lấy bảng `khachhangmoi` (tbody)
    const tablekhachhangmoi = document.getElementById("khachhangmoi").getElementsByTagName('tbody')[0];

    // Lấy dữ liệu từ localStorage
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];

    // Sắp xếp danh sách khách hàng theo ID giảm dần (ID mới nhất ở đầu)
    const sortedUsers = allUsers.sort((a, b) => b.id - a.id);

    // Lấy 10 khách hàng mới nhất
    const newUsers = sortedUsers.slice(0, 10);

    // Xóa nội dung cũ của bảng
    tablekhachhangmoi.innerHTML = '';

    // Cập nhật bảng với danh sách khách hàng mới
    newUsers.forEach((user, index) => {
        const newRow = `
            <tr>
                <td>${index + 1}</td> <!-- Số thứ tự -->
                <td>${user.name || 'Chưa có tên'}</td> <!-- Tên khách hàng -->
                <td>${user.numberphone || 'Không có số'}</td> <!-- Số điện thoại -->
                <td>${user.email || 'Không có email'}</td> <!-- Email khách hàng -->
            </tr>
        `;
        tablekhachhangmoi.innerHTML += newRow; // Thêm dòng mới
    });
}



// Hàm định dạng tiền (VND)
function formatCurrencygiohang(amount) {
    if (typeof amount !== 'number') return 'Không có dữ liệu';
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
}

function updateTablethongkesanpham(startDate = "", endDate = "") {
    const tabletopsanpham = document.getElementById("thongkesanphambanra").getElementsByTagName('tbody')[0];

    // Lấy dữ liệu từ localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders')) || []; // Giả sử các đơn hàng được lưu trong 'orders'

    // Tạo mảng tạm để lưu trữ thống kê sản phẩm
    let productStats = [];

    // Lọc các đơn hàng theo thời gian và trạng thái "Đã Giao Hàng"
    const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-CA'); // Định dạng ngày theo chuẩn 'en-CA'
        return order.statusText === "Đã giao hàng" &&
               (!startDate || orderDate >= startDate) &&
               (!endDate || orderDate <= endDate);
    });

    if (filteredOrders.length === 0) {
        console.log('Không có đơn hàng nào thỏa điều kiện.');
        tabletopsanpham.innerHTML = '<tr><td colspan="5">Không có đơn hàng nào thỏa điều kiện.</td></tr>';
        return;
    }

    // Lặp qua tất cả đơn hàng đã lọc và thống kê sản phẩm
    filteredOrders.forEach(order => {
        order.items.forEach(item => {
            const existingProduct = productStats.find(stat => stat.productid === item.productid);

            if (existingProduct) {
                // Cập nhật số lượng bán và tổng doanh thu nếu sản phẩm đã tồn tại trong mảng thống kê
                existingProduct.sold += item.quantity;
                existingProduct.totalRevenue += item.quantity * item.price;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới vào mảng thống kê
                productStats.push({
                    productid: item.productid,
                    name: item.name,
                    sold: item.quantity,
                    totalRevenue: item.quantity * item.price
                });
            }
        });
    });

    // Sắp xếp các sản phẩm theo tổng doanh thu giảm dần
    productStats.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Tính tổng doanh thu của tất cả sản phẩm
    let totalRevenue = 0;
    productStats.forEach(product => {
        totalRevenue += product.totalRevenue;
    });

    // Tìm sản phẩm chạy nhất (bán nhiều nhất)
    const bestSellingProduct = productStats.reduce((bestProduct, currentProduct) => {
        return currentProduct.sold > bestProduct.sold ? currentProduct : bestProduct;
    }, productStats[0]);

    // Tìm sản phẩm ế nhất (bán ít nhất)
    const worstSellingProduct = productStats.reduce((worstProduct, currentProduct) => {
        return currentProduct.sold < worstProduct.sold ? currentProduct : worstProduct;
    }, productStats[0]);

    // Cập nhật tổng doanh thu và sản phẩm chạy nhất/ế nhất vào các phần tử HTML
    const totalPurchasesElement = document.getElementById("total-purchases");
    const bestSellingProductElement = document.getElementById("best-selling-product");
    const worstSellingProductElement = document.getElementById("worst-selling-product");

    if (totalPurchasesElement && bestSellingProductElement && worstSellingProductElement) {
        totalPurchasesElement.textContent = formatCurrencygiohang(totalRevenue);
        bestSellingProductElement.textContent = bestSellingProduct.name || 'Không có tên';
        worstSellingProductElement.textContent = worstSellingProduct.name || 'Không có tên';
    }

    // Xóa nội dung cũ của bảng
    tabletopsanpham.innerHTML = '';

    // Cập nhật bảng với danh sách sản phẩm mới
    productStats.forEach((product, index) => {
        const newRow = document.createElement('tr');

        // Tạo các ô trong bảng
        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);
        const cell5 = newRow.insertCell(4);

        cell1.textContent = index + 1; // Số thứ tự
        cell2.innerHTML = `<a href="javascript:void(0);" onclick="showProductDetailsthongke('${product.productid}', '${startDate}', '${endDate}')">${product.productid}</a>`; // ID sản phẩm
        cell3.textContent = product.name || 'Không có tên'; // Tên sản phẩm
        cell4.textContent = product.sold || 'Không có dữ liệu'; // Số lượng bán
        cell5.textContent = formatCurrencygiohang(product.totalRevenue) || 'Không có dữ liệu'; // Doanh thu sản phẩm

        // Thêm dòng vào bảng
        tabletopsanpham.appendChild(newRow);
    });
}



    

// Hàm hiển thị modal khi click vào mã sản phẩm
function showProductDetailsthongke(productId, startDate = "", endDate = "") {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    console.log('products:', products); // Xem tất cả các sản phẩm trong localStorage
    console.log('Searching for product with ID:', productId); // Kiểm tra productId

    // Kiểm tra xem sản phẩm có trong danh sách không
    const product = products.find(p => p.id === Number(productId)); // Chuyển đổi id thành kiểu số
    if (!product) {
        alert('Không tìm thấy sản phẩm!');
        console.log('Sản phẩm không tồn tại với ID:', productId);
        return;
    }

    console.log('Sản phẩm tìm thấy: ', product); // Kiểm tra thông tin sản phẩm

    // Lọc các đơn hàng có sản phẩm này
    const productOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        const isInTimeRange = (!startDate || orderDate >= new Date(startDate)) && (!endDate || orderDate <= new Date(endDate));
        return order.items.some(item => 
            item.name.trim().toLowerCase() === product.name.trim().toLowerCase()
        ) && isInTimeRange; // Lọc theo thời gian và sản phẩm
    });

    // Kiểm tra nếu không có đơn hàng nào có sản phẩm
    if (productOrders.length === 0) {
        alert('Không có đơn hàng nào với sản phẩm này!');
        console.log('Không có đơn hàng nào với sản phẩm này: ', product.name);
        return;
    }

    console.log('Đơn hàng liên quan đến sản phẩm: ', productOrders);

    // Tạo nội dung modal
    const modalContent = `
        <div class="modal-content">
            <span class="close-button" onclick="closeProductDetailsthongke()">&times;</span>
            <div class="container-bill">
                <div class="header-bill">
                    <b>Hóa đơn tổng quan của sản phẩm ${product.name} - Thống kê</b>
                </div>
                <div class="content-bill">
                    <table class="nested-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Ngày mua</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productOrders.map((order, index) => {
                                // Lọc các sản phẩm có tên giống với sản phẩm hiện tại
                                const productItems = order.items.filter(item => 
                                    item.name.trim().toLowerCase() === product.name.trim().toLowerCase()
                                );

                                // Tính tổng tiền của từng sản phẩm
                                return productItems.map((item, subIndex) => {
                                    const totalProductPrice = item.price * item.quantity; // Tính tổng giá cho sản phẩm này
                                    return `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${order.orderId}</td>
                                            <td>${order.orderDate}</td>
                                            <td>${formatCurrency(item.price)}</td>
                                            <td>${item.quantity}</td>
                                            <td>${formatCurrency(totalProductPrice)}</td>
                                            <td>${order.statusText}</td>
                                        </tr>
                                    `;
                                }).join(''); // Lặp qua các sản phẩm của đơn hàng
                            }).join('')}  <!-- Kết hợp các dòng từ tất cả các đơn hàng -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    // Hiển thị modal
    const modal = document.getElementById('modalThongkesanpham');
    modal.innerHTML = modalContent;
    modal.style.display = 'block';
}

// Hàm đóng modal
function closeProductDetailsthongke() {
    const modal = document.getElementById('modalThongkesanpham');
    modal.style.display = 'none';
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ');
}




















function updateTotalProductstongsanpham() {
    // Lấy dữ liệu từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];

    // Đếm số lượng sản phẩm
    const totalProducts = products.length;

    // Cập nhật số lượng sản phẩm vào phần tử HTML
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = totalProducts; // Gán số lượng vào span
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateTotalProductstongsanpham();
});



function updateTotalProductstongkhachhang() {
    // Lấy dữ liệu từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Đếm số lượng sản phẩm
    const totalusers = users.length;

    // Cập nhật số lượng sản phẩm vào phần tử HTML
    const totalusersElement = document.getElementById('total-customers');
    if (totalusersElement) {
        totalusersElement.textContent = totalusers; // Gán số lượng vào span
    }
}
document.addEventListener('DOMContentLoaded', () => {
    updateTotalProductstongkhachhang();
});










