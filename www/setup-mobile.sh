#!/bin/bash

# Script tự động setup mobile app cho LEO SUSHI

echo "🚀 Bắt đầu setup mobile app cho LEO SUSHI..."
echo ""

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài Node.js trước."
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ npm: $(npm --version)"
echo ""

# Cài đặt dependencies
echo "📦 Đang cài đặt dependencies..."
npm install

# Thêm Android platform
echo ""
echo "🤖 Đang thêm Android platform..."
npx cap add android

# Thêm iOS platform (chỉ trên macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo ""
    echo "🍎 Đang thêm iOS platform..."
    npx cap add ios
    echo ""
    echo "📱 Để hoàn tất iOS setup, chạy:"
    echo "   cd ios/App && pod install && cd ../.."
fi

# Sync code
echo ""
echo "🔄 Đang sync code..."
npx cap sync

echo ""
echo "✅ Setup hoàn tất!"
echo ""
echo "📱 Các lệnh hữu ích:"
echo "   - Mở Android Studio: npx cap open android"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   - Mở Xcode: npx cap open ios"
fi
echo "   - Sync code sau khi sửa: npx cap sync"
echo "   - Xem hướng dẫn chi tiết: cat HUONG_DAN_BUILD_APP.md"












