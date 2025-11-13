#
# https://dev.vk.com/ru/mini-apps/development/protect-with-signature

from urllib.parse import urlencode
print(urlencode({'test':'&?="'}))# вывод:test=%26%3F%3D%22

