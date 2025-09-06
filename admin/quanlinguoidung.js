    // Hàm để lấy danh sách người dùng từ localStorage
    function getUsersFromLocalStorage() {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users;
    }

    // Hàm để lưu danh sách người dùng vào localStorage
    function saveUsersToLocalStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Hàm để load danh sách người dùng từ Local Storage
    function loadUsers() {
        const users = getUsersFromLocalStorage(); // Lấy danh sách người dùng từ localStorage
    
        const userTable = document.querySelector("#userTable tbody");
        if (!userTable) {
            console.error("Không tìm thấy phần tử bảng người dùng `#userTable tbody`.");
            return;
        }
    
        userTable.innerHTML = ''; // Xóa bảng cũ trước khi tải lại
    
        users.forEach(user => {
            // Kiểm tra và hiển thị số điện thoại, nếu không có thì hiển thị "Chưa cập nhật"
            const phoneDisplay = user.numberphone 
                ? user.numberphone 
                : `<span style="color: red; font-style: italic;">Chưa cập nhật</span>`;
    
            // Kiểm tra và hiển thị địa chỉ, nếu không có thì hiển thị "Chưa cập nhật"
            const addressDisplay = user.address && user.address.city && user.address.district && user.address.ward && user.address.street
                ? `${user.address.street}, ${user.address.ward}, ${user.address.district}, ${user.address.city}`
                : `<span style="color: red; font-style: italic;">Chưa cập nhật</span>`;
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${phoneDisplay}</td>
                <td>${addressDisplay}</td>
                <td>${formatCurrency(user.spending)}</td>
                <td>
                    <div class="tinhnang-qlnd">
                        <div class="icon-qlnd" onclick="promptToggleUserStatus(${user.id}, this)">
                            <i class="fa-solid ${user.status === 'unlocked' ? 'fa-lock-open' : 'fa-lock'}"></i>
                        </div>
                        <div class="icon-qlnd" onclick="editUser(${user.id})">
                            <i class="fa-solid fa-user-pen"></i>
                        </div>
                    </div>
                </td>
            `;
            userTable.appendChild(row);
        });
    }

    // Hiển thị hộp thoại xác nhận khóa/mở khóa người dùng
    function promptToggleUserStatus(userId, iconElement) {
        userToToggle = { userId, iconElement };
        document.getElementById('confirmLockModal').style.display = 'flex';
    }

    // Xác nhận thay đổi trạng thái khóa/mở khóa người dùng
    function confirmToggleStatus() {
        toggleUserStatus(userToToggle.userId, userToToggle.iconElement);
        closeConfirmModal();
    }

    function closeConfirmModal() {
        document.getElementById('confirmLockModal').style.display = 'none';
    }

    // Chuyển đổi trạng thái khóa/mở khóa người dùng
    function toggleUserStatus(userId, iconElement) {
        const users = getUsersFromLocalStorage(); // Lấy người dùng từ localStorage
        const user = users.find(u => u.id === userId);

        if (user) {
            // Thay đổi trạng thái giữa 'locked' và 'unlocked'
            user.status = user.status === 'unlocked' ? 'locked' : 'unlocked';
            saveUsersToLocalStorage(users); // Lưu lại thay đổi vào localStorage

            // Thay đổi icon dựa trên trạng thái
            const icon = iconElement.querySelector('i');
            icon.classList.toggle('fa-lock-open');
            icon.classList.toggle('fa-lock');

            // Cập nhật lại bảng người dùng
            loadUsers();  // Gọi lại hàm loadUsers để cập nhật bảng
        }
    }

    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    // Hàm kiểm tra định dạng số điện thoại (số điện thoại bắt đầu bằng 0 và có 10 chữ số)
    function validatePhoneNumber(phone) {
        const phoneRegex = /^0\d{9}$/;  // Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số
        return phoneRegex.test(phone);
    }
    function validateName(name) {
        // Kiểm tra tên phải chứa ít nhất 2 ký tự và chỉ gồm chữ cái hoặc khoảng trắng
        const namePattern = /^[a-zA-ZÀ-ỹ\s]{2,}$/;
        return namePattern.test(name.trim());
    }
    // Mở hộp thoại chỉnh sửa thông tin người dùng
    function editUser(userId) {
        const users = getUsersFromLocalStorage(); // Lấy danh sách người dùng từ localStorage
        const user = users.find(u => u.id === userId);
    
        if (user) {
            currentUserId = userId; // Ghi nhận ID của người dùng đang được chỉnh sửa
    
            // Điền thông tin người dùng vào các trường trong hộp thoại
            document.getElementById("editEmail").value = user.email;
            document.getElementById("editName").value = user.name || ''; // Điền tên
            document.getElementById("editPhone").value = user.numberphone || '';
            document.getElementById("editCity").value = user.address.city || '';            // Cập nhật đúng với `numberphone`            document.getElementById("editCity").value = user.address.city || '';
            document.getElementById("editDistrict").value = user.address.district || '';
            document.getElementById("editWard").value = user.address.ward || '';
            document.getElementById("editStreet").value = user.address.street || '';
            document.getElementById("editUserId").value = userId;

            // Hiển thị modal chỉnh sửa
            const modal = document.getElementById("editUserModal");
            if (modal) {
                modal.style.display = "flex";
            } else {
                console.error("Không tìm thấy phần tử `editUserModal`.");
            }
        } else {
            console.error("Không tìm thấy người dùng với ID:", userId);
        }
    }

    // Đóng hộp thoại chỉnh sửa người dùng
    function closeEditUserModal() {
        document.getElementById("editUserModal").style.display = "none";
    }

    // Lưu thay đổi thông tin người dùng
    function saveUserChanges() {
        const userId = document.getElementById("editUserId").value;
    
        if (!userId) {
            alert("Không xác định được người dùng để cập nhật!");
            return;
        }
    
        // Lấy giá trị từ các trường chỉnh sửa
        const email = document.getElementById("editEmail").value.trim();
        const name = document.getElementById("editName").value.trim();
        const phone = document.getElementById("editPhone").value.trim();
        const city = document.getElementById("editCity").value.trim();
        const district = document.getElementById("editDistrict").value.trim();
        const ward = document.getElementById("editWard").value.trim();
        const street = document.getElementById("editStreet").value.trim();
    
        // Kiểm tra các trường đã được nhập đầy đủ chưa
        if (!email || !name || !phone || !city || !district || !ward || !street) {
            showToast("Vui lòng nhập đầy đủ tất cả các trường!", "error");
            return;
        }
    
        // Kiểm tra email hợp lệ
        if (!validateEmail(email)) {
            showToast("Email không hợp lệ!", "error");
            return;
        }
    
        // Kiểm tra tên hợp lệ
        if (!validateName(name)) {
            showToast("Tên không hợp lệ! (Chỉ chứa chữ cái và khoảng trắng, tối thiểu 2 ký tự)", "error");
            return;
        }
    
        // Kiểm tra số điện thoại hợp lệ
        if (!validatePhoneNumber(phone)) {
            showToast("Số điện thoại không hợp lệ! (Phải bắt đầu bằng 0 và có 10 chữ số)", "error");
            return;
        }
    
        // Lấy danh sách người dùng từ localStorage
        const users = getUsersFromLocalStorage();
        const userIndex = users.findIndex(user => user.id === parseInt(userId));
    
        if (userIndex === -1) {
            alert("Không tìm thấy người dùng trong danh sách!");
            return;
        }
    
        // Cập nhật thông tin người dùng
        users[userIndex].email = email;
        users[userIndex].name = name;
        users[userIndex].numberphone = phone;
        users[userIndex].address.city = city;
        users[userIndex].address.district = district;
        users[userIndex].address.ward = ward;
        users[userIndex].address.street = street;
    
        // Đồng bộ thông tin với currentUser nếu cần
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.id === parseInt(userId)) {
            currentUser.email = email;
            currentUser.name = name;
            currentUser.numberphone = phone;
            currentUser.address.city = city;
            currentUser.address.district = district;
            currentUser.address.ward = ward;
            currentUser.address.street = street;
    
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            showToast("Cập nhật thông tin người dùng đang đăng nhập thành công!", "success");
        } else {
            showToast("Cập nhật thông tin người dùng thành công!", "success");
        }
    
        // Lưu lại danh sách người dùng
        saveUsersToLocalStorage(users);
    
        // Đóng modal và tải lại danh sách người dùng
        closeEditUserModal();
        loadUsers();
    }
    
    

    window.addEventListener("load", function () {
        // Đảm bảo đóng các modal khi trang tải
        document.getElementById("editUserModal").style.display = "none";
        document.getElementById("confirmLockModal").style.display = "none";

        loadUsers(); // Tải danh sách người dùng từ LocalStorage khi trang được tải
    });
