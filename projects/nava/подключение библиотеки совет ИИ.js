// my-library.js
(function(global) {
    "use strict";

    // Все эти переменные приватны и не видны в window
    const version = "1.0.0";
    const privateKey = "секретный_ключ";

    const internalMethod = (name) => {
        return `Привет, ${name}! Версия: ${version}`;
    };

    // Создаем единственный объект-пространство имен
    const MyLibrary = {
        greet: function(name) {
            return internalMethod(name);
        },
        doSomething: () => {
            console.log("Работаю...");
        }
    };

    // Безопасный экспорт в глобальную область (window или global)
    if (!global.MyLibrary) {
        global.MyLibrary = MyLibrary;
    }

})(typeof window !== "undefined" ? window : this);