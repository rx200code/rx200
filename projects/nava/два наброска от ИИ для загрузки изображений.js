/**
 * Загружает массив URL изображений и возвращает промис, 
 * который разрешается, когда все изображения загружены.
 *
 * @param {string[]} imageUrls - Массив URL-адресов изображений для загрузки.
 * @returns {Promise<HTMLImageElement[]>} Промис, возвращающий массив загруженных объектов Image.
 */
function loadImages(imageUrls) {
    const promises = imageUrls.map(url => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;

            img.onload = () => {
                // Если изображение загружено успешно, возвращаем сам объект img
                resolve(img); 
            };

            img.onerror = () => {
                // Если произошла ошибка, отклоняем промис
                console.error(`Ошибка загрузки изображения: ${url}`);
                reject(new Error(`Failed to load image: ${url}`));
            };
        });
    });

    // Promise.all ждет выполнения всех промисов в массиве
    return Promise.all(promises);
}

// --- Пример использования ---

const imagesToLoad = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.png',
    'https://example.com/image3.jpg'
];

loadImages(imagesToLoad)
    .then(loadedImages => {
        console.log("Все изображения успешно загружены:", loadedImages);
        // Теперь массив loadedImages содержит готовые объекты Image.
        // Вы можете сразу же использовать их для отрисовки на вашем Canvas:
        
        drawImagesOnCanvas(loadedImages); 
    })
    .catch(error => {
        console.error("Произошла ошибка при загрузке одного или нескольких изображений:", error);
        // Обработка ситуации, если хотя бы одно изображение не загрузилось
    });


function drawImagesOnCanvas(images) {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Очищаем или подготавливаем канвас
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем изображения
    images.forEach((img, index) => {
        // Пример отрисовки:
        ctx.drawImage(img, index * 100, 0, img.width, img.height);
    });

    console.log("Канвас перерисован с использованием всех загруженных изображений.");
}


/**
 * Загружает массив URL изображений, используя Promise.all,
 * и возвращает промис с массивом загруженных объектов Image.
 */
const loadAllImages = (urls) => {
    // Создаем массив промисов, где каждый промис отвечает за загрузку одного изображения
    const promises = urls.map(url => new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        // Используем стрелочные функции для краткости
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    }));

    // Promise.all дождется выполнения всех промисов
    return Promise.all(promises);
};

// --- Пример использования с синтаксисом async/await (самый чистый способ) ---

const imageUrls = [
    'https://example.com/img1.jpg',
    'https://example.com/img2.png',
    // 'https://example.com/broken_img.jpg', // Раскомментировать для проверки обработки ошибок
];

async function initializeCanvas() {
    try {
        // Ожидаем загрузки всех изображений
        const loadedImages = await loadAllImages(imageUrls);
        
        console.log("Все изображения готовы к отрисовке:", loadedImages);
        
        // --- Ваш код отрисовки на Canvas здесь ---
        const ctx = document.getElementById('myCanvas').getContext('2d');
        loadedImages.forEach((img, index) => {
            ctx.drawImage(img, index * 100, 0);
        });
        // ----------------------------------------
        
    } catch (error) {
        console.error("Не удалось загрузить изображения, отрисовка отменена:", error.message);
        // Обработка ошибок UI
    }
}

// Запускаем процесс
initializeCanvas();

