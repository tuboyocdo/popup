// Tự động tìm hoặc tạo canvas nếu chưa có
let canvas = document.getElementById('bubbleCanvas');
if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'bubbleCanvas';
    document.body.appendChild(canvas);
}
const ctx = canvas.getContext('2d');

// Hàm cập nhật kích thước chuẩn màn hình
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let bubbles = [];

// Đối tượng Bong bóng màu sắc bay ra
class ClickBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 8 + 5; 
        
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2; 
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        this.hue = Math.random() * 360;
        this.color = `hsla(${this.hue}, 100%, 65%, 1)`;
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedX *= 0.96;
        this.speedY *= 0.96;
        this.speedY -= 0.03; 
        this.alpha -= this.fadeSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 6;
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

// HÀM KÍCH NỔ ĐỒNG BỘ TÊN VỚI FILE HTML/SMALI
function createBubbleBurst(clientX, clientY) {
    const bubbleCount = Math.floor(Math.random() * 5) + 12; 
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new ClickBubble(clientX, clientY));
    }
}

// Đăng ký trực tiếp vào cửa sổ toàn cục để từ đâu cũng gọi được
window.createBubbleBurst = createBubbleBurst;

// Tự động lắng nghe trên window để kích nổ phòng hờ
window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        createBubbleBurst(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

window.addEventListener('click', (e) => {
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
