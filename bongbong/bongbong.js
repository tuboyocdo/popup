const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

// Tự động fit kín toàn màn hình điện thoại
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bubbles = [];

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Đối tượng Bong bóng màu sắc bay ra
class ClickBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Kích thước bong bóng ngẫu nhiên phù hợp hiển thị mobile
        this.radius = Math.random() * 8 + 5; 
        
        // Tính toán lực bung ra 360 độ cực đẹp
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2; 
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        // Hệ màu cầu vồng sắc nét
        this.hue = Math.random() * 360;
        this.color = `hsla(${this.hue}, 100%, 65%, 1)`;
        
        // Tốc độ mờ dần giúp giảm tải dung lượng RAM điện thoại
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        this.speedY -= 0.03; // Hiệu ứng nhẹ bay lên trên
        this.alpha -= this.fadeSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Tạo viền neon phát sáng nhẹ xung quanh bong bóng
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.5)`;

        // Vẽ bong bóng tròn
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Vẽ vệt sáng phản chiếu (Highlight 3D) giúp bóng trông thật hơn
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        ctx.restore();
    }
}

// Hàm xử lý kích nổ
function createBubbleBurst(clientX, clientY) {
    const bubbleCount = Math.floor(Math.random() * 5) + 12; 
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new ClickBubble(clientX, clientY));
    }
}

// FIX CHUẨN ANDROID WEBVIEW: Lắng nghe ngón tay chạm trực tiếp
window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        // Lấy chính xác tọa độ của ngón tay đầu tiên chạm vào màn hình
        const clientX = e.touches[0].clientX;
        const clientY = e.touches[0].clientY;
        createBubbleBurst(clientX, clientY);
    }
}, { passive: true });

// Lắng nghe click chuột trên máy tính (nếu dùng PC giả lập)
window.addEventListener('click', (e) => {
    // Tránh trùng lặp tọa độ nếu thiết bị nhận diện nhầm touch sang click
    if (e.clientX !== undefined) {
        createBubbleBurst(e.clientX, e.clientY);
    }
});

// Vòng lặp vẽ liên tục
function animate() {
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
