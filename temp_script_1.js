
        function injectMockData() {
            console.log("🧪 Đang chèn dữ liệu mẫu...");
            const mockOrders = [
                { id: "ORD-001", first_name: "Nguyễn", last_name: "Văn A", phone: "0901234567", status: "pending", total: 150000, items: [{ name: "Sushi Set A", quantity: 1 }], created_at: new Date().toISOString() },
                { id: "ORD-002", first_name: "Trần", last_name: "Thị B", phone: "0902223334", status: "confirmed", total: 250000, items: [{ name: "Sashimi Mix", quantity: 2 }], created_at: new Date().toISOString() },
                { id: "ORD-003", first_name: "Lê", last_name: "Văn C", phone: "0905556667", status: "cancelled", total: 120000, items: [{ name: "Miso Soup", quantity: 3 }], created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: "ORD-004", first_name: "Phạm", last_name: "Thị D", phone: "0908889990", status: "pending", total: 300000, items: [{ name: "Dragon Roll", quantity: 1 }], created_at: new Date().toISOString() }
            ];

            // Ghi đè hàm list
            if (!window.api) window.api = {};
            if (!window.api.orders) window.api.orders = {};

            window.api.orders.isMock = true; // Cờ nhận diện chế độ mẫu
            window.api.orders.list = async function (status = 'all') {
                if (status === 'all') return mockOrders;
                return mockOrders.filter(o => o.status === status);
            };

            // Ép buộc render dữ liệu ngay lập tức
            window.__loadOrdersRunning = false; // Reset cờ trạng thái để cho phép chạy lại
            if (typeof loadOrders === 'function') {
                loadOrders(false, false);
            }
            alert("✅ Đã chèn dữ liệu mẫu! Đơn hàng sẽ hiện ra ngay lập tức.");
        }
    