const speakBtn  = document.getElementById('speakBtn');
const scriptBox = document.getElementById('script');
const mouth     = document.getElementById('mouth');
const avatar    = document.getElementById('avatar');

let isTalking = false;
let mouthInterval = null;

// تحريك الفم بشكل عشوائي أثناء الكلام
function startMouthAnimation() {
    isTalking = true;
    avatar.classList.add('talking');

    mouthInterval = setInterval(() => {
        const ry = 5 + Math.random() * 20;  // ارتفاع الفم
        const rx = 20 + Math.random() * 15; // عرض الفم
        mouth.setAttribute('ry', ry.toFixed(1));
        mouth.setAttribute('rx', rx.toFixed(1));
    }, 100);
}

function stopMouthAnimation() {
    isTalking = false;
    avatar.classList.remove('talking');
    clearInterval(mouthInterval);
    mouth.setAttribute('rx', 25);
    mouth.setAttribute('ry', 5);
}

// دالة النطق باستخدام Web Speech API
function speak(text) {
    if (!('speechSynthesis' in window)) {
        alert('متصفحك لا يدعم النطق. جرّب Chrome أو Edge.');
        return;
    }

    // إيقاف أي كلام سابق
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 1;
    utterance.pitch = 1.1;

    // اختيار صوت عربي إن وُجد
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onstart = startMouthAnimation;
    utterance.onend   = stopMouthAnimation;
    utterance.onerror = stopMouthAnimation;

    window.speechSynthesis.speak(utterance);
}

// زر التشغيل والإيقاف
speakBtn.addEventListener('click', () => {
    const text = scriptBox.value.trim();
    if (!text) return alert('اكتب نصًا أولاً');

    if (isTalking) {
        window.speechSynthesis.cancel();
        stopMouthAnimation();
        speakBtn.textContent = '🎤 ابدأ البث';
    } else {
        speakBtn.textContent = '⏹ إيقاف البث';
        speak(text);
    }
});

// مراقبة انتهاء الكلام لإعادة الزر لحالته
const checkSpeechEnd = setInterval(() => {
    if (!window.speechSynthesis.speaking && isTalking) {
        stopMouthAnimation();
        speakBtn.textContent = '🎤 ابدأ البث';
    }
}, 500);
