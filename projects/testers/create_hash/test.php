<?php
// Значение защищённого ключа из настроек вашего приложения
$client_secret = "sPntLaiCyKYd8QFhQ69w"; 
// Подпись, полученная в запросе
$sign_param = 'fSibt9N1v3DYflFKFl2qyRk-g3szAKiGDL0p6fYGFSI'; 

$hash_params = [
  'ts' => 1759645290, // Время создания подписи
  'request_id' => 'test text', // Присваиваем значение параметра payload
];

// Добавляем идентификатор пользователя и мини-приложения или игры к ответу на событие
$hash_params['user_id'] = 1477085;
$hash_params['app_id'] = 52910233;

// Сортируем список по ключам
ksort($hash_params);

// Формируем строку для вычисления подписи
$sign_params_query = http_build_query($hash_params);
echo $sign_params_query; 

echo "\n";

echo hash_hmac('sha256', $sign_params_query, $client_secret, true);

// Формируем подпись, используя защищёный ключ приложения (метод HMAC)\
//$sign = rtrim(strtr(base64_encode(hash_hmac('sha256', $sign_params_query, $client_secret, true)), '+/', '-_'), '=');
//echo $sign;
