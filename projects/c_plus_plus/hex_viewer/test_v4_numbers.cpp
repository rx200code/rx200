#include <Windows.h>
#include <iostream>

HANDLE hConsole;

int main(){
	hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	
	int numbers[] = {9, 24, -2100000000, 2100000000, 51, -1, 1111111111, 0x100, 0xff};
	
	for(int n: numbers){
		std::cout << std::endl;
		SetConsoleTextAttribute(hConsole, 0xf);
		std::cout << "n: ";
		SetConsoleTextAttribute(hConsole, 0x3);
		std::cout << n;
		printf(" (0x%0X)", n);
		std::cout << std::endl;
		
		SetConsoleTextAttribute(hConsole, 0xf);
		std::cout << "int >";
		SetConsoleTextAttribute(hConsole, 0x3);
		for(int i = 3; i >= 0; --i)printf(" %02X |", (n >> (8 * i)) & 0xff);
		std::cout << std::endl;
		
		SetConsoleTextAttribute(hConsole, 0xf);
		std::cout << "int <";
		SetConsoleTextAttribute(hConsole, 0x3);
		for(int i = 0; i < 4; ++i)printf(" %02X |", (n >> (8 * i)) & 0xff);
		std::cout << std::endl;
		
		
		bool signed_n = n >> 31;
		//*
		if(signed_n)n = ~n + 1;
		//*/
		int ex = 31 - __builtin_clz(n);
		
		
		unsigned int n32_float = signed_n;
		unsigned long long n64_double = signed_n;
		
		n32_float <<= 31;
		n64_double <<= 63;
		
		n32_float |= (ex + 127) << 23;
		n64_double |= ((unsigned long long)(ex + 1023)) << 52;
		
		/*
		n32_float |= n << (22 - ex);
		n64_double |= ((unsigned long long)n) << (51 - ex);
		//*/
		
		n32_float |= (n << (23 - ex)) & 0x7fffff;
		n64_double |= (((unsigned long long)n) << (52 - ex)) & 0xfffffffffffff;
		
		//int temp32;
		//long temp64;
		
		
		SetConsoleTextAttribute(hConsole, 0xf);
		std::cout << "float :";
		SetConsoleTextAttribute(hConsole, 0x3);
		printf(" %08X ", n32_float);
		std::cout << std::endl;
		SetConsoleTextAttribute(hConsole, 0xf);
		std::cout << "double: ";
		SetConsoleTextAttribute(hConsole, 0x3);
		//printf(" %016X ", n64_double);
		for(int i = 7; i >= 0; --i)printf("%02X", (unsigned int)(n64_double >> (8 * i)) & 0xff);
		//std::cout << std::endl << n64_double;
		//printf(" %0X ", signed_n);
		//printf(" %d ", ex);
		
		//std::cout << n;
		
		
		std::cout << std::endl;
		
		
		
	}
	SetConsoleTextAttribute(hConsole, 0x7);
	std::cout << std::endl << "END" << std::endl;
	//system("pause");
	return 0;
}