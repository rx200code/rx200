#include <iostream>
//#include <windows.h>
#include <winsock2.h>

int main(){
	
	WSADATA w;
	int error = WSAStartup(0x0202, &w);
	if(error){
		std::cout << "Ошибка WSASartup" << std::endl;
		return 1;
	}
	if(w.wVersion != 0x0202){
		std::cout << "Ошибка версии w.wVersion" << std::endl;
		WSACleanup();
		return 1;
	}
	
	struct sockaddr_in peer;
	int s;
	int rc;
	char buf[1];
	
	peer.sin_family = AF_INET;
	peer.sin_port = htons(7500);
	peer.sin_addr.s_addr = inet_addr("127.0.0.1");
	
	s = socket(AF_INET, SOCK_STREAM, 0);
	if(s == (int)INVALID_SOCKET){
		std::cout << "Ошибка вызова socket" << std::endl;
		return 1;
	}
	
	rc = connect(s, (struct sockaddr *) &peer, sizeof(peer));
	if(rc){
		std::cout << "Ошибка вызова connect" << std::endl;
		return 2;
	}
	
	rc = send(s, "1", 1, 0);
	if(rc <= 0){
		std::cout << "Ошибка вызова send" << std::endl;
		return 3;
	}
	
	rc = recv(s, buf, 1, 0);
	if(rc <= 0){
		std::cout << "Ошибка вызова recv" << std::endl;
		return 4;
	}
	
	std::cout << buf[0] << std::endl;
	
	
	/*
	std::cout << "Введите числа:" << std::endl;
	int v1, v2;
	std::cin >> v1 >> v2;
	std::cout << "Сумма чисел: " << v1 << " и " << v2 << " = " << v1 + v2 << std::endl;
	//*/
	return 0;
}