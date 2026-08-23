/**
 * QR Code Generator for Leo Sushi Delivery System
 * Generates QR codes for orders that delivery staff can scan
 * Uses qrcode.js library (loaded via CDN)
 */

// QR format: https://www.leo-sushi-berlin.de/delivery.html?scan={order_id}
// Example: https://www.leo-sushi-berlin.de/delivery.html?scan=LEO-260724-001

/**
 * Dynamically load the qrcode.js library from CDN if not already loaded
 * @returns {Promise<void>}
 */
function loadQRCodeLibrary() {
    return new Promise((resolve, reject) => {
        if (typeof window.QRCode !== 'undefined') {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
        script.onload = () => {
            console.log('🍣 QRCode library loaded successfully');
            resolve();
        };
        script.onerror = () => {
            console.error('🍣 Failed to load QRCode library');
            reject(new Error('Failed to load QRCode library'));
        };
        document.head.appendChild(script);
    });
}

/**
 * Generate a QR code and render it into a container element
 * @param {string} orderId - The order ID to encode
 * @param {HTMLElement|string} container - DOM element or ID to render QR into
 * @param {object} options - Optional settings {width: 200, height: 200, colorDark: '#e5cf8e', colorLight: '#1a1a2e'}
 * @returns {Promise<HTMLCanvasElement>} The QR code canvas element
 */
async function generateOrderQR(orderId, container, options = {}) {
    try {
        await loadQRCodeLibrary();
        
        let containerEl = container;
        if (typeof container === 'string') {
            containerEl = document.getElementById(container);
        }
        
        if (!containerEl) {
            throw new Error(`Container element not found: ${container}`);
        }
        
        // Clear previous QR code if any
        containerEl.innerHTML = '';
        // Use current domain dynamically
        const currentDomain = window.location.origin;
        const text = `${currentDomain}/delivery.html?scan=${orderId}`;
        const defaultOptions = {
            text: text,
            width: 200,
            height: 200,
            colorDark: '#e5cf8e', // Gold accent
            colorLight: '#1a1a2e', // Dark theme background
            correctLevel: QRCode.CorrectLevel.H
        };
        
        const finalOptions = { ...defaultOptions, ...options, text: text };
        
        // Render the QR code
        new QRCode(containerEl, finalOptions);
        
        // QRCodejs might render as canvas or table depending on browser support
        const canvas = containerEl.querySelector('canvas');
        return canvas;
    } catch (error) {
        console.error('🍣 Error generating QR code:', error);
        throw error;
    }
}

/**
 * Generate a QR code as a data URL (for download/print)
 * @param {string} orderId 
 * @param {object} options
 * @returns {Promise<string>} Base64 data URL of QR code image
 */
async function generateOrderQRDataURL(orderId, options = {}) {
    try {
        const tempContainer = document.createElement('div');
        const canvas = await generateOrderQR(orderId, tempContainer, options);
        
        if (canvas) {
            return canvas.toDataURL('image/png');
        } else {
            // Fallback for browsers where QRCodejs generates an img tag instead of canvas
            const img = tempContainer.querySelector('img');
            if (img && img.src) {
                return img.src;
            }
            throw new Error('Could not extract data URL from generated QR code');
        }
    } catch (error) {
        console.error('🍣 Error generating QR data URL:', error);
        throw error;
    }
}

/**
 * Show a modal with a large QR code for an order
 * @param {string} orderId
 * @param {object} orderInfo - {customerName, address, total} for display
 */
async function showQRCodeModal(orderId, orderInfo = {}) {
    try {
        // Remove existing modal if any
        const existingModal = document.getElementById('qr-code-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'qr-code-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(10, 10, 15, 0.85);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        // Create modal content (glassmorphism style)
        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(26, 26, 46, 0.9);
            border: 1px solid rgba(229, 207, 142, 0.2);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            max-width: 400px;
            width: 100%;
            text-align: center;
            color: #fff;
            position: relative;
        `;
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 16px; right: 16px;
            background: none;
            border: none;
            color: rgba(255,255,255,0.6);
            font-size: 20px;
            cursor: pointer;
            transition: color 0.3s;
            padding: 4px;
        `;
        closeBtn.onmouseover = () => closeBtn.style.color = '#e5cf8e';
        closeBtn.onmouseout = () => closeBtn.style.color = 'rgba(255,255,255,0.6)';
        closeBtn.onclick = () => modal.remove();
        
        // Title
        const title = document.createElement('h3');
        title.innerText = 'Mã QR Giao Hàng';
        title.style.cssText = 'color: #e5cf8e; margin: 0 0 24px 0; font-size: 22px; font-weight: 600;';
        
        // QR Container
        const qrContainer = document.createElement('div');
        qrContainer.style.cssText = `
            background: #1a1a2e;
            padding: 16px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 24px;
            border: 1px solid rgba(229, 207, 142, 0.3);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        
        // Order Info
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'text-align: left; margin-bottom: 24px; font-size: 15px; line-height: 1.6; color: #e2e8f0;';
        infoDiv.innerHTML = `
            <div style="margin-bottom: 8px;"><strong style="color: #e5cf8e;">Mã ĐH:</strong> ${orderId}</div>
            ${orderInfo.customerName ? `<div style="margin-bottom: 8px;"><strong style="color: #e5cf8e;">Khách hàng:</strong> ${orderInfo.customerName}</div>` : ''}
            ${orderInfo.address ? `<div style="margin-bottom: 8px;"><strong style="color: #e5cf8e;">Địa chỉ:</strong> ${orderInfo.address}</div>` : ''}
            ${orderInfo.total ? `<div style="margin-bottom: 8px;"><strong style="color: #e5cf8e;">Tổng tiền:</strong> ${orderInfo.total}</div>` : ''}
        `;
        
        // Print Button
        const printBtn = document.createElement('button');
        printBtn.innerText = '🖨️ In Mã QR';
        printBtn.style.cssText = `
            background: #e5cf8e;
            color: #1a1a2e;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            font-size: 16px;
            transition: opacity 0.3s;
        `;
        printBtn.onmouseover = () => printBtn.style.opacity = '0.9';
        printBtn.onmouseout = () => printBtn.style.opacity = '1';
        
        // Assemble modal
        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(qrContainer);
        content.appendChild(infoDiv);
        content.appendChild(printBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Generate QR Code (size 300x300 for large display)
        await generateOrderQR(orderId, qrContainer, { width: 300, height: 300 });
        
        // Setup Print functionality
        printBtn.onclick = async () => {
            try {
                const dataUrl = await generateOrderQRDataURL(orderId, { width: 300, height: 300 });
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                            <head>
                                <title>In Mã QR - ${orderId}</title>
                                <style>
                                    body { text-align: center; padding-top: 40px; font-family: sans-serif; }
                                    .container { border: 2px dashed #333; padding: 20px; display: inline-block; }
                                    h2 { margin: 0 0 10px 0; }
                                    h3 { margin: 0 0 20px 0; color: #555; }
                                    img { max-width: 300px; margin: 20px 0; }
                                    p { margin: 8px 0; text-align: left; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <h2>Leo Sushi Delivery</h2>
                                    <h3>Mã ĐH: ${orderId}</h3>
                                    <img src="${dataUrl}" alt="QR Code">
                                    <div style="text-align: left; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
                                        ${orderInfo.customerName ? `<p><strong>Khách hàng:</strong> ${orderInfo.customerName}</p>` : ''}
                                        ${orderInfo.address ? `<p><strong>Địa chỉ:</strong> ${orderInfo.address}</p>` : ''}
                                        ${orderInfo.total ? `<p><strong>Tổng tiền:</strong> ${orderInfo.total}</p>` : ''}
                                    </div>
                                </div>
                                <script>
                                    setTimeout(() => { window.print(); window.close(); }, 500);
                                </script>
                            </body>
                        </html>
                    `);
                    printWindow.document.close();
                }
            } catch (err) {
                console.error('🍣 Error printing QR code:', err);
                alert('Có lỗi xảy ra khi in mã QR.');
            }
        };
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
    } catch (error) {
        console.error('🍣 Error showing QR code modal:', error);
    }
}

// Export to window
if (typeof window !== 'undefined') {
    window.generateOrderQR = generateOrderQR;
    window.generateOrderQRDataURL = generateOrderQRDataURL;
    window.showQRCodeModal = showQRCodeModal;
}
