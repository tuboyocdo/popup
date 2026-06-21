const canvas = document.getElementById('bubbleCanvas');
const ctx = canvas.getContext('2d');

// Cấu hình kích thước canvas phủ kín màn hình điện thoại
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let bubbles = [];

// Tự động thay đổi kích thước khi xoay màn hình điện thoại
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Lớp đối tượng tạo từng bong bóng nhỏ sắc màu
class ClickBubble {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
        // Kích thước bong bóng ngẫu nhiên từ 5px đến 15px phù hợp màn hình mobile
        this.radius = Math.random() * 10 + 5; 
        
        // Tạo góc bắn ngẫu nhiên 360 độ và lực đẩy
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2; 
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        // Tạo màu sắc cầu vồng rực rỡ ngẫu nhiên (Hệ màu HSL)
        this.hue = Math.random() * 360;
        this.color = `hsla(${this.hue}, 100%, 65%, 1)`;
        
        // Thiết lập độ mờ dần và tốc độ biến mất (Tránh lag cho máy cấu hình yếu)
        this.alpha = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Lực cản không khí nhẹ khiến bong bóng bay chậm dần tự nhiên
        this.speedX *= 0.95;
        this.speedY *= 0.95;
        
        // Bong bóng nhẹ nên sẽ có xu hướng bay nhẹ lên trên
        this.speedY -= 0.04; 
        
        // Giảm độ rõ để mờ dần
        this.alpha -= this.fadeSpeed;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Tạo hiệu ứng phát sáng neon mờ xung quanh bong bóng
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${this.hue}, 100%, 65%, 0.5)`;

        // Vẽ hình tròn bong bóng
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Vẽ điểm sáng màu trắng (Highlight) tạo độ bóng 3D chân thật
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        ctx.restore();
    }
}

// Hàm kích hoạt nổ bong bóng
function createBubbleBurst(clientX, clientY) {
    // Trên điện thoại tạo khoảng 10-15 hạt mỗi cú chạm là vừa đẹp, không bị lag
    const bubbleCount = Math.floor(Math.random() * 5) + 10; 
    for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new ClickBubble(clientX, clientY));
    }
}

// Hàm bắt tọa độ chính xác trên thiết bị di động và máy tính
function handleTouchOrClick(e) {
    let clientX, clientY;
    
    // Nếu là sự kiện chạm tay (Mobile Touch)
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } 
    // Nếu là sự kiện click chuột (PC)
    else if (e.clientX !== undefined) {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    if (clientX !== undefined && clientY !== undefined) {
        createBubbleBurst(clientX, clientY);
    }
}

// Lắng nghe sự kiện chạm trên toàn bộ cửa sổ màn hình (window)
// Bất kể bạn chạm trúng nút Facebook, logo gif hay chữ, hiệu ứng đều sẽ nổ ra
window.addEventListener('click', handleTouchOrClick);
window.addEventListener('touchstart', handleTouchOrClick, { passive: true });

// Vòng lặp vẽ chuyển động liên tục
function animate() {
    // Xóa sạch canvas cũ để giữ độ trong suốt hoàn hảo cho giao diện bên dưới
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < bubbles.length; i++) {
        bubbles[i].update();
        bubbles[i].draw();

        // Tự động xóa bong bóng khỏi bộ nhớ khi đã mờ hẳn để tiết kiệm RAM điện thoại
        if (bubbles[i].alpha <= 0) {
            bubbles.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

// Chạy hiệu ứng
animate();
