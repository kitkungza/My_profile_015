const greetingBtn = document.getElementById('greetingBtn');
const message = document.getElementById('greetingmassege');
const profileImg = document.getElementById('img');

// เก็บข้อความเริ่มต้นไว้
const originalMessage = message ? message.textContent : '';
let resetTimer = null;
let typingTimer = null;
let greetingIndex = 0;

// รายการข้อความทักทายสไตล์ Developer Portfolio (กดแต่ละครั้งจะสลับข้อความกัน)
const devGreetings = [
  'สวัสดีครับ! ยินดีที่ได้รู้จักครับ ✨💻',
  'ขอบคุณที่แวะมาชมพอร์ตโฟลิโอของผมนะครับ 🚀🔥',
  'กำลังมองหานักพัฒนาเว็บและระบบ IoT อยู่ใช่ไหมครับ? ⚡🌟',
  'อยากเก่ง ก็ต้องลงมือทำ! มาสร้างโปรเจกต์เจ๋งๆ กันครับ 💖✨'
];

// ฟังก์ชันสร้างละอองดาวและประกายแสง
function createSparkles(x, y) {
  const sparkleCount = 28;
  const symbols = ['✨', '💻', '🚀', '⚡', '🌟', '🔥', '💫'];
  const colors = ['#c084fc', '#e879f9', '#fef08a', '#ffffff', '#38bdf8', '#4ade80'];

  for (let i = 0; i < sparkleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'sparkle-particle';

    const isSymbol = Math.random() > 0.4;
    if (isSymbol) {
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.fontSize = (Math.random() * 12 + 14) + 'px';
    } else {
      const size = Math.random() * 7 + 5;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.borderRadius = '50%';
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;
      particle.style.boxShadow = `0 0 10px ${color}`;
    }

    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 120 + 35;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.setProperty('--dx', `${destX}px`);
    particle.style.setProperty('--dy', `${destY}px`);

    document.body.appendChild(particle);

    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}

// ฟังก์ชันพิมพ์ข้อความทีละตัวอักษร (Typewriter Effect)
function typeWriter(text, element, speed = 30) {
  if (typingTimer) {
    clearInterval(typingTimer);
  }
  element.textContent = '';
  let i = 0;

  typingTimer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingTimer);
    }
  }, speed);
}

// เมื่อคลิกปุ่มทักทาย
if (greetingBtn && message) {
  greetingBtn.addEventListener('click', function () {
    // ดึงข้อความตามลำดับและสลับไปเรื่อยๆ เมื่อกดซ้ำ
    const currentGreeting = devGreetings[greetingIndex];
    greetingIndex = (greetingIndex + 1) % devGreetings.length;

    // แสดงข้อความแบบพิมพ์ทีละตัวอักษร
    typeWriter(currentGreeting, message);

    // รีเซ็ตและเล่นแอนิเมชันที่ข้อความและปุ่ม
    message.classList.remove('sparkle-text');
    greetingBtn.classList.remove('btn-sparkle');
    void message.offsetWidth;
    void greetingBtn.offsetWidth;
    message.classList.add('sparkle-text');
    greetingBtn.classList.add('btn-sparkle');

    // ลูกเล่นรูปโปรไฟล์ขยับเบาๆ เวลากดทักทาย
    if (profileImg) {
      profileImg.style.transition = 'transform 0.35s ease, filter 0.35s ease';
      profileImg.style.transform = 'scale(1.05) rotate(1.5deg)';
      profileImg.style.filter = 'drop-shadow(0 0 16px rgba(192, 132, 252, 0.6))';
      setTimeout(() => {
        profileImg.style.transform = 'scale(1) rotate(0deg)';
        profileImg.style.filter = 'none';
      }, 350);
    }

    // คำนวณจุดกึ่งกลางปุ่มเพื่อปล่อย Sparkles
    const rect = greetingBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createSparkles(centerX, centerY);

    // ล้างเวลาเดิมหากมีการกดปุ่มซ้ำก่อนครบกำหนด
    if (resetTimer) {
      clearTimeout(resetTimer);
    }

    // คืนค่ากลับเป็นข้อความเริ่มต้นหลังจากผ่านไป 12 วินาที
    resetTimer = setTimeout(function () {
      typeWriter(originalMessage, message, 25);
      message.classList.remove('sparkle-text');
      greetingBtn.classList.remove('btn-sparkle');
    }, 12000);
  });
}

// เลื่อนหน้าเว็บแบบนุ่มนวล (Smooth Scroll) เวลาคลิกเมนูนำทาง
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
