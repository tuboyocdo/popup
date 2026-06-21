const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bubbles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class ClickBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 15 + 5; 
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2; 
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        this.hue = Math.random() * 360;
        this.color = `hsla(${this.hue}, 100%, 65%, 1)`;
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.015 + 0.01;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.speedY -= 0.05; 
        this.alpha -= this.fadeSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.5)`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        ctx.restore();
    }
}

function createBubbleBurst(clientX, clientY) {
    const bubbleCount = Math.floor(Math.random() * 6) + 15; 
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new ClickBubble(clientX, clientY));
    }
}

// Hàm xử lý "Click xuyên thấu" thông minh
function handlePassThroughClick(e) {
    // 1. Lấy tọa độ click chuột/chạm
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX === undefined || clientY === undefined) return;

    // 2. Kích hoạt hiệu ứng bung bong bóng tại tọa độ đó
    createBubbleBurst(clientX, clientY);

    // 3. LOGIC XUYÊN THẤU: Tạm thời ẩn canvas đi trong tích tắc
    canvas.style.pointerEvents = 'none';

    // 4. Tìm xem phần tử thực sự nằm dưới tọa độ đó là gì (nút, link, chữ...)
    const elementBelow = document.elementFromPoint(clientX, clientY);

    // 5. Nếu tìm thấy phần tử bên dưới, giả lập một cú click thật vào nó
    if (elementBelow) {
        elementBelow.click();
        // Đối với các ô nhập liệu (input, textarea), tự động tập trung chuột vào đó
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(elementBelow.tagName)) {
            elementBelow.focus();
        }
    }

    // 6. Hiện lại canvas ngay lập tức để chờ cú click tiếp theo
    canvas.style.pointerEvents = 'auto';
}

// Lắng nghe sự kiện click trên máy tính
window.addEventListener('click', (e) => {
    // Tránh vòng lặp vô hạn khi elementBelow.click() được kích hoạt
    if (e.target === canvas) {
        handlePassThroughClick(e);
    }
});

// Lắng nghe sự kiện chạm trên điện thoại
window.addEventListener('touchstart', (e) => {
    if (e.target === canvas) {
        handlePassThroughClick(e);
    }
}, { passive: true });

function animate() {
    // Sử dụng clearRect để canvas trong suốt hoàn toàn, không che nội dung web bên dưới
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
        bubbles[i].draw();

        if (bubbles[i].alpha <= 0) {
            bubbles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();
