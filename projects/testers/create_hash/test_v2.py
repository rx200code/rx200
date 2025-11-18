# python3 test.py
# https://dev.vk.com/ru/mini-apps/development/protect-with-signature

from urllib.parse import urlencode
import hmac
import hashlib
import base64

# Значение защищённого ключа из настроек вашего приложения
client_secret = b"sPntLaiCyKYd8QFhQ69w"# ключь для примера, реальный, но уже изменен.
# Подпись, полученная в запросе
sign_param = "tVg78Xv6uscTGYDz9THlpvCuYiM_mhGQmRXOTHhdR0U"

hash_params = {
    'ts': 1759645290, # Время создания подписи
    'request_id': 'test text' # Присваиваем значение параметра payload
}
# Добавляем идентификатор пользователя и мини-приложения или игры к ответу на событие
hash_params['user_id'] = 1477085
hash_params['app_id'] = 52910233
# Сортируем список по ключам
hash_params = dict(sorted(hash_params.items()))
# Формируем строку для вычисления подписи
sign_params_query = urlencode(hash_params)
# Формируем подпись, используя защищёный ключ приложения (метод HMAC)\
sign = base64.b64encode(hmac.new(client_secret, sign_params_query.encode('utf-8'), hashlib.sha256).digest()).decode('utf-8').replace("+", "-").replace("/", "_").rstrip("=")
# Сравниваем полученную строку со значением из VKWebAppCreateHash
status = sign == sign_param

print('ok' if status else 'fail')
