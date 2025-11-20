// 天気API設定（OpenWeatherMap APIキーが必要です）
// APIキーは https://openweathermap.org/api から無料で取得できます
const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // ここにAPIキーを入力してください
const WEATHER_CITY = 'Kagoshima'; // 鹿児島市
const WEATHER_COUNTRY = 'JP'; // 日本

// 天気アイコンのマッピング
const weatherIcons = {
    '01d': '☀️', // clear sky day
    '01n': '🌙', // clear sky night
    '02d': '⛅', // few clouds day
    '02n': '☁️', // few clouds night
    '03d': '☁️', // scattered clouds
    '03n': '☁️',
    '04d': '☁️', // broken clouds
    '04n': '☁️',
    '09d': '🌧️', // shower rain
    '09n': '🌧️',
    '10d': '🌦️', // rain day
    '10n': '🌧️', // rain night
    '11d': '⛈️', // thunderstorm
    '11n': '⛈️',
    '13d': '❄️', // snow
    '13n': '❄️',
    '50d': '🌫️', // mist
    '50n': '🌫️'
};

// 天気情報を取得する関数
async function fetchWeather() {
    // APIキーが設定されていない場合はデモデータを表示
    if (WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        displayWeatherDemo();
        return;
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY},${WEATHER_COUNTRY}&units=metric&lang=ja&appid=${WEATHER_API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('天気情報の取得に失敗しました');
        }
        
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('天気情報の取得エラー:', error);
        // エラー時はデモデータを表示
        displayWeatherDemo();
    }
}

// 天気情報を表示する関数
function displayWeather(data) {
    const tempElement = document.getElementById('weatherTemp');
    const descElement = document.getElementById('weatherDesc');
    const humidityElement = document.getElementById('weatherHumidity');
    const iconElement = document.getElementById('weatherIcon');

    if (tempElement) {
        tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    }
    
    if (descElement) {
        descElement.textContent = data.weather[0].description || '--';
    }
    
    if (humidityElement) {
        humidityElement.textContent = `${data.main.humidity}%`;
    }
    
    if (iconElement) {
        const iconCode = data.weather[0].icon;
        iconElement.textContent = weatherIcons[iconCode] || '☀️';
    }
}

// デモ天気データを表示（APIキーがない場合）
function displayWeatherDemo() {
    const tempElement = document.getElementById('weatherTemp');
    const descElement = document.getElementById('weatherDesc');
    const humidityElement = document.getElementById('weatherHumidity');
    const iconElement = document.getElementById('weatherIcon');

    if (tempElement) {
        tempElement.textContent = '25°C';
    }
    
    if (descElement) {
        descElement.textContent = '晴れ';
    }
    
    if (humidityElement) {
        humidityElement.textContent = '65%';
    }
    
    if (iconElement) {
        iconElement.textContent = '☀️';
    }

    // コンソールにAPIキー設定の案内を表示
    console.log('⚠️ 天気APIキーが設定されていません。');
    console.log('OpenWeatherMap (https://openweathermap.org/api) から無料のAPIキーを取得し、');
    console.log('script.js の WEATHER_API_KEY に設定してください。');
}

// Three.js 3Dアニメーション
let scene, camera, renderer, particles, brainMesh;
let mouseX = 0, mouseY = 0;

function init3D() {
    const container = document.getElementById('canvas-container');
    
    // シーンの作成
    scene = new THREE.Scene();
    
    // カメラの作成
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // レンダラーの作成
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // ライトの追加
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xfbbf24, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);
    
    // AIをイメージした脳のような3Dオブジェクトの作成
    const brainGeometry = new THREE.IcosahedronGeometry(1, 2);
    const brainMaterial = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        emissive: 0x1e3a8a,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    scene.add(brainMesh);
    
    // パーティクルシステムの作成
    const particleCount = 1000;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        
        // 青と黄色のパーティクル
        const color = Math.random() > 0.5 ? 0x3b82f6 : 0xfbbf24;
        colors[i] = (color >> 16) / 255;
        colors[i + 1] = ((color >> 8) & 255) / 255;
        colors[i + 2] = (color & 255) / 255;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // マウス移動の追跡
    document.addEventListener('mousemove', onMouseMove);
    
    // アニメーションループ
    animate();
    
    // ウィンドウリサイズの処理
    window.addEventListener('resize', onWindowResize);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);
    
    // 脳の回転と変形
    if (brainMesh) {
        brainMesh.rotation.x += 0.005;
        brainMesh.rotation.y += 0.01;
        
        // マウスに反応
        brainMesh.rotation.y += mouseX * 0.05;
        brainMesh.rotation.x += mouseY * 0.05;
        
        // パルス効果
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        brainMesh.scale.set(scale, scale, scale);
    }
    
    // パーティクルの回転
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        
        // パーティクルの動き
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.0001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// スクロールアニメーション
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// アニメーション要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.about-card, .service-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// ナビゲーション
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// スムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// フォーム送信
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // アニメーション効果
        const submitButton = contactForm.querySelector('.submit-button');
        submitButton.textContent = '送信中...';
        submitButton.style.background = '#10b981';
        
        setTimeout(() => {
            submitButton.textContent = '送信完了！';
            submitButton.style.background = '#10b981';
            
            // フォームリセット
            setTimeout(() => {
                contactForm.reset();
                submitButton.textContent = '送信';
                submitButton.style.background = '';
            }, 2000);
        }, 1000);
    });
}

// ダークモード切り替え機能（グローバル変数を先に定義）
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

// ナビゲーションバーのスクロール効果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    
    if (currentScroll > 100) {
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        } else {
            navbar.style.background = 'rgba(30, 58, 138, 0.98)';
        }
        navbar.style.boxShadow = currentTheme === 'dark' 
            ? '0 4px 20px rgba(0, 0, 0, 0.6)' 
            : '0 4px 20px rgba(0, 0, 0, 0.2)';
    } else {
        if (currentTheme === 'dark') {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            navbar.style.background = 'rgba(30, 58, 138, 0.95)';
        }
        navbar.style.boxShadow = currentTheme === 'dark'
            ? '0 2px 10px rgba(0, 0, 0, 0.5)'
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ローカルストレージからテーマを読み込む
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    return savedTheme;
}

// テーマアイコンの更新
function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeIcon.setAttribute('aria-label', 'ライトモードに切り替え');
    } else {
        themeIcon.textContent = '🌙';
        themeIcon.setAttribute('aria-label', 'ダークモードに切り替え');
    }
}

// テーマを切り替える
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // スムーズな切り替えアニメーション
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // ナビゲーションバーの背景も更新
    if (navbar) {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            if (newTheme === 'dark') {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            } else {
                navbar.style.background = 'rgba(30, 58, 138, 0.98)';
            }
        } else {
            if (newTheme === 'dark') {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.background = 'rgba(30, 58, 138, 0.95)';
            }
        }
    }
}

// テーマトグルボタンのイベントリスナー
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// おみくじ機能
const omikujiResults = [
    { name: '大吉', icon: '🎉', class: 'daikichi', probability: 5 },
    { name: '中吉', icon: '✨', class: 'chukichi', probability: 15 },
    { name: '小吉', icon: '🌟', class: 'syokichi', probability: 25 },
    { name: '吉', icon: '🎋', class: 'kichi', probability: 30 },
    { name: '凶', icon: '⚡', class: 'kyo', probability: 25 }
];

// おみくじを引く関数
function drawOmikuji() {
    // 重み付きランダム抽選
    const totalProbability = omikujiResults.reduce((sum, result) => sum + result.probability, 0);
    let random = Math.random() * totalProbability;
    
    let selectedResult = omikujiResults[0];
    for (const result of omikujiResults) {
        random -= result.probability;
        if (random <= 0) {
            selectedResult = result;
            break;
        }
    }
    
    // 結果を表示
    displayOmikujiResult(selectedResult);
}

// おみくじ結果を表示する関数
function displayOmikujiResult(result) {
    const resultElement = document.getElementById('omikujiResult');
    const resultIcon = document.getElementById('omikujiResultIcon');
    const resultText = document.getElementById('omikujiResultText');
    
    if (!resultElement || !resultIcon || !resultText) return;
    
    // 結果をセット
    resultIcon.textContent = result.icon;
    resultText.textContent = result.name;
    
    // クラスをリセットしてから新しいクラスを追加
    resultElement.className = 'omikuji-result ' + result.class;
    
    // 結果を表示
    resultElement.style.display = 'flex';
    
    // アニメーション
    setTimeout(() => {
        resultElement.classList.add('show');
    }, 10);
}

// おみくじ結果を閉じる関数
function closeOmikujiResult() {
    const resultElement = document.getElementById('omikujiResult');
    if (resultElement) {
        resultElement.style.display = 'none';
        resultElement.classList.remove('show');
    }
}

// おみくじボタンのイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const omikujiButton = document.getElementById('omikujiButton');
    const omikujiClose = document.getElementById('omikujiClose');
    const omikujiResult = document.getElementById('omikujiResult');
    
    if (omikujiButton) {
        omikujiButton.addEventListener('click', (e) => {
            e.preventDefault();
            drawOmikuji();
        });
    }
    
    if (omikujiClose) {
        omikujiClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeOmikujiResult();
        });
    }
    
    // 結果ウィンドウの外側をクリックしても閉じる
    if (omikujiResult) {
        omikujiResult.addEventListener('click', (e) => {
            if (e.target === omikujiResult) {
                closeOmikujiResult();
            }
        });
    }
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeOmikujiResult();
        }
    });
});

// Googleマップの初期化
function initGoogleMap() {
    const mapFrame = document.getElementById('googleMap');
    if (!mapFrame) return;
    
    // 会社の住所
    const address = '鹿児島県鹿児島市玉里町１４－４５';
    // 住所をURLエンコード
    const encodedAddress = encodeURIComponent(address);
    
    // Google Maps Embed APIのURLを生成（2つの方法を試す）
    // 方法1: 埋め込み用URL（APIキー不要の場合がある）
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.9447890625!2d130.533!3d31.533!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzU4LjgiTiAxMzDCsDMxJzU4LjgiRQ!5e0!3m2!1sja!2sjp!4v1234567890123!5m2!1sja!2sjp&q=${encodedAddress}`;
    
    // 方法2: より確実な方法（APIキーが必要な場合）
    // Google Maps Embed APIキーが設定されている場合、こちらを使用
    // const API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
    // if (API_KEY && API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    //     mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodedAddress}&language=ja&zoom=15`;
    // } else {
    //     // 住所検索のリンクを使用（iframeではなく別タブで開く）
    //     mapFrame.src = `https://www.google.com/maps?q=${encodedAddress}&output=embed&hl=ja`;
    // }
    
    // iframeのsrcを設定（フォールバック方法）
    // まず、Google Mapsの検索結果をiframeで表示する方法を試す
    try {
        mapFrame.src = `https://www.google.com/maps?q=${encodedAddress}&output=embed&hl=ja&z=15`;
    } catch (error) {
        console.error('Google Mapsの読み込みエラー:', error);
        // エラー時はリンクのみ表示
        mapFrame.style.display = 'none';
    }
}

// Canvas APIを使ったお絵かき機能
let drawingCanvas, drawingCtx;
let isDrawing = false;
let currentColor = '#3b82f6';
let currentSize = 5;
let lastX = 0;
let lastY = 0;

// Canvasの初期化
function initDrawingCanvas() {
    drawingCanvas = document.getElementById('drawingCanvas');
    if (!drawingCanvas) return;
    
    drawingCtx = drawingCanvas.getContext('2d');
    
    // Canvasのサイズを設定
    resizeCanvas();
    
    // ウィンドウリサイズ時にCanvasのサイズを更新
    window.addEventListener('resize', resizeCanvas);
    
    // 色選択の設定
    const colorPicker = document.getElementById('drawingColor');
    const sizePicker = document.getElementById('drawingSize');
    const sizeValue = document.getElementById('drawingSizeValue');
    
    if (colorPicker) {
        colorPicker.value = currentColor;
        colorPicker.addEventListener('change', (e) => {
            currentColor = e.target.value;
        });
    }
    
    if (sizePicker && sizeValue) {
        sizePicker.value = currentSize;
        sizeValue.textContent = currentSize;
        sizePicker.addEventListener('input', (e) => {
            currentSize = parseInt(e.target.value);
            sizeValue.textContent = currentSize;
        });
    }
    
    // マウスイベント
    setupDrawingEvents();
}

// Canvasのサイズを調整
function resizeCanvas() {
    if (!drawingCanvas || !drawingCtx) return;
    
    const container = drawingCanvas.parentElement;
    if (!container) return;
    
    // Canvasの実際のサイズを設定
    drawingCanvas.width = container.clientWidth - 40; // padding分を考慮
    drawingCanvas.height = Math.min(container.clientHeight - 150, window.innerHeight * 0.7); // ヘッダー分を考慮
    
    // 背景を白（またはダークモードの場合は黒）に設定
    const theme = document.documentElement.getAttribute('data-theme');
    drawingCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
    drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// 描画イベントの設定
function setupDrawingEvents() {
    if (!drawingCanvas) return;
    
    // マウスイベント
    drawingCanvas.addEventListener('mousedown', startDrawing);
    drawingCanvas.addEventListener('mousemove', draw);
    drawingCanvas.addEventListener('mouseup', stopDrawing);
    drawingCanvas.addEventListener('mouseout', stopDrawing);
    
    // タッチイベント（モバイル対応）
    drawingCanvas.addEventListener('touchstart', handleTouch);
    drawingCanvas.addEventListener('touchmove', handleTouch);
    drawingCanvas.addEventListener('touchend', stopDrawing);
}

// 描画開始
function startDrawing(e) {
    if (e.type === 'touchstart') {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = drawingCanvas.getBoundingClientRect();
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
    } else {
        const rect = drawingCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    }
    isDrawing = true;
}

// 描画
function draw(e) {
    if (!isDrawing || !drawingCtx) return;
    
    e.preventDefault();
    const rect = drawingCanvas.getBoundingClientRect();
    let currentX, currentY;
    
    if (e.type === 'touchmove') {
        const touch = e.touches[0];
        currentX = touch.clientX - rect.left;
        currentY = touch.clientY - rect.top;
    } else {
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
    }
    
    drawingCtx.lineWidth = currentSize;
    drawingCtx.lineCap = 'round';
    drawingCtx.lineJoin = 'round';
    drawingCtx.strokeStyle = currentColor;
    
    drawingCtx.beginPath();
    drawingCtx.moveTo(lastX, lastY);
    drawingCtx.lineTo(currentX, currentY);
    drawingCtx.stroke();
    
    lastX = currentX;
    lastY = currentY;
}

// 描画終了
function stopDrawing() {
    isDrawing = false;
}

// タッチイベントの処理
function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = drawingCanvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    if (e.type === 'touchstart') {
        lastX = x;
        lastY = y;
        isDrawing = true;
    } else if (e.type === 'touchmove' && isDrawing) {
        draw({
            preventDefault: () => {},
            clientX: touch.clientX,
            clientY: touch.clientY,
            touches: [touch]
        });
    }
}

// Canvasをクリア
function clearCanvas() {
    if (!drawingCanvas || !drawingCtx) return;
    const theme = document.documentElement.getAttribute('data-theme');
    drawingCtx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
    drawingCtx.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
}

// お絵かきオーバーレイを開く
function openDrawingOverlay() {
    const overlay = document.getElementById('drawingOverlay');
    if (!overlay) return;
    
    overlay.style.display = 'flex';
    
    // Canvasを初期化
    setTimeout(() => {
        initDrawingCanvas();
        resizeCanvas();
    }, 100);
    
    // ボディのスクロールを無効化
    document.body.style.overflow = 'hidden';
}

// お絵かきオーバーレイを閉じる
function closeDrawingOverlay() {
    const overlay = document.getElementById('drawingOverlay');
    if (!overlay) return;
    
    overlay.style.display = 'none';
    
    // ボディのスクロールを有効化
    document.body.style.overflow = '';
}

// お絵かき機能のイベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const drawingButton = document.getElementById('drawingButton');
    const drawingClose = document.getElementById('drawingClose');
    const drawingClear = document.getElementById('drawingClear');
    const drawingOverlay = document.getElementById('drawingOverlay');
    
    if (drawingButton) {
        drawingButton.addEventListener('click', (e) => {
            e.preventDefault();
            openDrawingOverlay();
        });
    }
    
    if (drawingClose) {
        drawingClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeDrawingOverlay();
        });
    }
    
    if (drawingClear) {
        drawingClear.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('すべての描画を削除しますか？')) {
                clearCanvas();
            }
        });
    }
    
    // オーバーレイの外側をクリックしても閉じる
    if (drawingOverlay) {
        drawingOverlay.addEventListener('click', (e) => {
            if (e.target === drawingOverlay) {
                closeDrawingOverlay();
            }
        });
    }
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('drawingOverlay');
            if (overlay && overlay.style.display === 'flex') {
                closeDrawingOverlay();
            }
        }
    });
});

// 日本時間時計機能
const daysOfWeek = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];
const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

// 日本時間を取得する関数
function getJapanTime() {
    const now = new Date();
    // Intl.DateTimeFormatを使って日本時間を取得
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        hour12: false
    });
    
    const parts = formatter.formatToParts(now);
    const weekdayStr = parts.find(p => p.type === 'weekday').value;
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(weekdayStr);
    
    const japanTime = {
        year: parseInt(parts.find(p => p.type === 'year').value),
        month: parseInt(parts.find(p => p.type === 'month').value) - 1, // 月は0から始まる
        day: parseInt(parts.find(p => p.type === 'day').value),
        hour: parseInt(parts.find(p => p.type === 'hour').value),
        minute: parseInt(parts.find(p => p.type === 'minute').value),
        second: parseInt(parts.find(p => p.type === 'second').value),
        dayIndex: dayIndex
    };
    
    return japanTime;
}

// 2桁にフォーマットする関数
function formatTwoDigits(num) {
    return num.toString().padStart(2, '0');
}

// 時計を更新する関数
function updateClock() {
    const japanTime = getJapanTime();
    
    const hours = formatTwoDigits(japanTime.hour);
    const minutes = formatTwoDigits(japanTime.minute);
    const seconds = formatTwoDigits(japanTime.second);
    const dayOfWeek = daysOfWeek[japanTime.dayIndex];
    const year = japanTime.year;
    const month = months[japanTime.month];
    const date = japanTime.day;
    
    // DOM要素を取得
    const hoursElement = document.getElementById('clockHours');
    const minutesElement = document.getElementById('clockMinutes');
    const secondsElement = document.getElementById('clockSeconds');
    const dayElement = document.getElementById('clockDay');
    const dateElement = document.getElementById('clockDate');
    
    // 時計を更新
    if (hoursElement) hoursElement.textContent = hours;
    if (minutesElement) minutesElement.textContent = minutes;
    if (secondsElement) secondsElement.textContent = seconds;
    if (dayElement) dayElement.textContent = dayOfWeek;
    if (dateElement) dateElement.textContent = `${year}年${month}${date}日`;
    
    // 秒が変わるたびにアニメーション効果
    if (secondsElement) {
        secondsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            secondsElement.style.transform = 'scale(1)';
        }, 100);
    }
}

// 時計の初期化
function initClock() {
    // 初回更新
    updateClock();
    
    // 1秒ごとに更新
    setInterval(updateClock, 1000);
}

// ページ読み込み時にテーマを適用
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    // 天気情報を取得
    fetchWeather();
    // 30分ごとに天気情報を更新
    setInterval(fetchWeather, 30 * 60 * 1000);
    // Googleマップを初期化
    initGoogleMap();
    // 時計を初期化
    initClock();
});

// 3Dアニメーションの初期化
window.addEventListener('load', () => {
    init3D();
});

// ページ読み込み時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});






