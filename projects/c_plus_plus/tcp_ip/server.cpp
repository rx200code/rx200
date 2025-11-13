#include <iostream>
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
	
	struct sockaddr_in local;
	int s;
	int s1;
	int rc;
	char buf[1];
	
	local.sin_family = AF_INET;
	local.sin_port = htons(7500);
	local.sin_addr.s_addr = htonl(INADDR_ANY);
	
	s = socket(AF_INET, SOCK_STREAM, 0);
	if(s == (int)INVALID_SOCKET){
		std::cout << "Ошибка вызова socket " << s << std::endl;
		return 1;
	}
	
	rc = bind(s, (struct sockaddr *) &local, sizeof(local));
	if(rc){
		std::cout << "Ошибка вызова bind" << std::endl;
		return 2;
	}
	
	rc = listen(s, 5);
	if(rc){
		std::cout << "Ошибка вызова listen" << std::endl;
		return 3;
	}
	
	s1 = accept(s, NULL, NULL);
	if(s1 == (int)INVALID_SOCKET){
		std::cout << "Ошибка вызова accept" << std::endl;
		return 4;
	}
	
	rc = recv(s1, buf, 1, 0);
	if(rc <= 0){
		std::cout << "Ошибка вызова recv" << std::endl;
		return 5;
	}
	
	std::cout << buf[0] << std::endl;
	
	rc = send(s1, "2", 1, 0);
	if(rc <= 0){
		std::cout << "Ошибка вызова send" << std::endl;
		return 6;
	}
	
	return 0;
}