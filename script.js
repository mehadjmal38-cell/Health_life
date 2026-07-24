// ====== بيانات التطبيق ======
const mealsData = [
    { id: 1, name: 'شوفان بالفواكه', type: 'breakfast', calories: 350, description: 'شوفان مع فواكه طازجة وعسل' },
    { id: 2, name: 'بيض مسلوق مع خضار', type: 'breakfast', calories: 280, description: 'بيض مسلوق مع خضار مشكلة' },
    { id: 3, name: 'سلطة تونة', type: 'lunch', calories: 420, description: 'تونة مع خضار طازجة وزيت زيتون' },
    { id: 4, name: 'دجاج مشوي مع أرز', type: 'lunch', calories: 550, description: 'صدور دجاج مشوية مع أرز بسمتي' },
    { id: 5, name: 'سمك مشوي مع خضار', type: 'dinner', calories: 380, description: 'سمك مشوي مع خضار مشكلة' },
    { id: 6, name: 'شوربة عدس', type: 'dinner', calories: 200, description: 'شوربة عدس غنية بالبروتين' },
    { id: 7, name: 'فواكه طازجة', type: 'snack', calories: 120, description: 'تشكيلة فواكه طازجة' },
    { id: 8, name: 'زبادي مع مكسرات', type: 'snack', calories: 180, description: 'زبادي يوناني مع مكسرات' }
];

const exercisesData = [
    { id: 1, name: 'المشي السريع', type: 'cardio', duration: '30 دقيقة', difficulty: 'سهل', description: 'مشي سريع لتحسين اللياقة' },
    { id: 2, name: 'ركوب الدراجة', type: 'cardio', duration: '20 دقيقة', difficulty: 'متوسط', description: 'ركوب دراجة ثابتة' },
    { id: 3, name: 'تمارين الضغط', type: 'strength', duration: '15 دقيقة', difficulty: 'متوسط', description: 'تقوية عضلات الصدر والذراعين' },
    { id: 4, name: 'القرفصاء', type: 'strength', duration: '15 دقيقة', difficulty: 'متوسط', description: 'تقوية عضلات الفخذين والأرداف' },
    { id: 5, name: 'تمارين الإطالة', type: 'flexibility', duration: '10 دقيقة', difficulty: 'سهل', description: 'تمارين مرونة للجسم' },
    { id: 6, name: 'اليوغا', type: 'flexibility', duration: '20 دقيقة', difficulty: 'متوسط', description: 'جلسة يوغا للاسترخاء' }
];

// ====== إدارة الصفحات ======
let currentUser = null;

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active-page');
    });
    document.getElementById(pageId).classList.add('active-page');
    
    // إظهار/إخفاء التذييل
    const footer = document.getElementById('main-footer');
    if (footer) {
        footer.style.display = (pageId === 'home-page' || pageId === 'meals-page' || pageId === 'exercises-page') ? 'block' : 'none';
    }
    
    // تحديث الروابط النشطة
    document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });
}

function navigateTo(pageId) {
    if (currentUser) {
        showPage(pageId);
    }
}

// ====== تسجيل الدخول والتسجيل ======
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // التحقق من وجود المستخدم
    const users = JSON.parse(localStorage.getItem('healthyLifeUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        document.getElementById('login-error').textContent = '';
        showPage('home-page');
        updateUserGreeting(user.name);
    } else {
        document.getElementById('login-error').textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    const users = JSON.parse(localStorage.getItem('healthyLifeUsers') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('هذا البريد الإلكتروني مسجل بالفعل');
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('healthyLifeUsers', JSON.stringify(users));
    alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
    showLogin();
});

function showRegister() {
    showPage('register-page');
}

function showLogin() {
    showPage('login-page');
}

function updateUserGreeting(name) {
    const welcomeSection = document.querySelector('.welcome-section h1');
    if (welcomeSection) {
        welcomeSection.innerHTML = `<i class="fas fa-smile"></i> مرحباً ${name} في Healthy Life`;
    }
}

// ====== تسجيل الخروج ======
document.querySelectorAll('#logout-btn, #logout-btn2, #logout-btn3').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        currentUser = null;
        showPage('login-page');
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
    });
});

// ====== التنقل بين الصفحات ======
document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentUser) {
            showPage(this.dataset.page);
        }
    });
});

// ====== عرض الوجبات ======
function renderMeals(filter = 'all') {
    const grid = document.getElementById('meals-grid');
    if (!grid) return;
    
    const filtered = filter === 'all' ? mealsData : mealsData.filter(m => m.type === filter);
    
    const typeMap = {
        'breakfast': 'الفطور',
        'lunch': 'الغداء',
        'dinner': 'العشاء',
        'snack': 'وجبة خفيفة'
    };
    
    const iconMap = {
        'breakfast': '🥣',
        'lunch': '🍲',
        'dinner': '🍽️',
        'snack': '🥜'
    };
    
    grid.innerHTML = filtered.map(meal => `
        <div class="meal-card">
            <div class="meal-image">${iconMap[meal.type] || '🍽️'}</div>
            <div class="meal-info">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
                <span class="meal-tag">${typeMap[meal.type] || meal.type}</span>
                <span class="meal-calories">🔥 ${meal.calories} سعرة</span>
            </div>
        </div>
    `).join('');
}

function filterMeals(filter) {
    document.querySelectorAll('.meal-filters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(filter === 'all' ? 'الكل' : 
            filter === 'breakfast' ? 'الفطور' :
            filter === 'lunch' ? 'الغداء' :
            filter === 'dinner' ? 'العشاء' : 'وجبات خفيفة'));
    });
    renderMeals(filter);
}

// ====== عرض التمارين ======
function renderExercises(filter = 'all') {
    const grid = document.getElementById('exercises-grid');
    if (!grid) return;
    
    const filtered = filter === 'all' ? exercisesData : exercisesData.filter(e => e.type === filter);
    
    const typeMap = {
        'cardio': 'كارديو',
        'strength': 'قوة',
        'flexibility': 'مرونة'
    };
    
    const iconMap = {
        'cardio': '🏃',
        'strength': '💪',
        'flexibility': '🧘'
    };
    
    grid.innerHTML = filtered.map(exercise => `
        <div class="exercise-card">
            <div class="exercise-image">${iconMap[exercise.type] || '🏋️'}</div>
            <div class="exercise-info">
                <h3>${exercise.name}</h3>
                <p>${exercise.description}</p>
                <span class="exercise-tag">${typeMap[exercise.type] || exercise.type}</span>
                <span style="margin-right:10px;color:#3498db;">⏱ ${exercise.duration}</span>
                <span style="color:#f39c12;">⭐ ${exercise.difficulty}</span>
            </div>
        </div>
    `).join('');
}

function filterExercises(filter) {
    document.querySelectorAll('.exercise-filters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.includes(filter === 'all' ? 'الكل' :
            filter === 'cardio' ? 'كارديو' :
            filter === 'strength' ? 'قوة' : 'مرونة'));
    });
    renderExercises(filter);
}

// ====== تحميل الصفحة ======
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من وجود مستخدم مسجل
    const users = JSON.parse(localStorage.getItem('healthyLifeUsers') || '[]');
    if (users.length > 0) {
        // عرض صفحة تسجيل الدخول
        showPage('login-page');
    }
    
    // تحميل البيانات الأولية
    renderMeals('all');
    renderExercises('all');
    
    // تحديث الإحصائيات بشكل عشوائي
    setInterval(() => {
        const steps = document.getElementById('daily-steps');
        const calories = document.getElementById('daily-calories');
        const sleep = document.getElementById('daily-sleep');
        const water = document.getElementById('daily-water');
        
        if (steps) steps.textContent = Math.floor(6000 + Math.random() * 5000).toLocaleString();
        if (calories) calories.textContent = Math.floor(1400 + Math.random() * 800);
        if (sleep) sleep.textContent = (6 + Math.random() * 3).toFixed(1);
        if (water) water.textContent = (2 + Math.random() * 1.5).toFixed(1) + ' لتر';
    }, 5000);
});