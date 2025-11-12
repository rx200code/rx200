#include <iostream>
//#include <string>     // для std::getline
#include "windows.h"

HHOOK _hook;
KBDLLHOOKSTRUCT kbStruct;
LRESULT CALLBACK hookCallBack(int nCode, WPARAM wParam, LPARAM lParam){
	//std::cout << counter << std::endl;
	//out(nCode);
	std::cout << (DWORD)lParam << std::endl;
	if(nCode >= 0){
		kbStruct = *((KBDLLHOOKSTRUCT*)lParam);
		if(wParam == WM_KEYDOWN){
			std::cout << kbStruct.vkCode << std::endl;
			//std::cout << kbStruct.scanCode << std::endl;
			
			// Подмена.
			if(kbStruct.vkCode == 81){
				INPUT ip;
				ip.type = INPUT_KEYBOARD;
				ip.ki.wScan = 0; 
				ip.ki.time = 0;
				ip.ki.dwExtraInfo = 0;	
				ip.ki.wVk = 0x4d; //m
				ip.ki.dwFlags = 0; // key press
				SendInput(1, &ip, sizeof(INPUT));
				return 1;
			}
		}else {
			// Подмена.
			if(kbStruct.vkCode == 81){
				INPUT ip;
				ip.type = INPUT_KEYBOARD;
				ip.ki.wScan = 0; 
				ip.ki.time = 0;
				ip.ki.dwExtraInfo = 0;	
				ip.ki.wVk = 0x4d; //m
				ip.ki.dwFlags = KEYEVENTF_KEYUP; // key release
				SendInput(1, &ip, sizeof(INPUT));
				return 1;
			}
			
			std::cout << kbStruct.vkCode << std::endl;
		}
		
		
		// Подмена.
		if(kbStruct.vkCode == 81){
			INPUT ip;
			ip.type = INPUT_KEYBOARD;
			ip.ki.wScan = 0; 
			ip.ki.time = 0;
			ip.ki.dwExtraInfo = 0;	
			ip.ki.wVk = 0x31; //1
			ip.ki.dwFlags = 0; // key press
			SendInput(1, &ip, sizeof(INPUT));
			
			ip.ki.dwFlags = KEYEVENTF_KEYUP; // key release
			SendInput(1, &ip, sizeof(INPUT));
			return 1;
		}
		
	}
	return CallNextHookEx(_hook, nCode, wParam, lParam);
}


int main()
{
	
	ShowWindow(FindWindowA("ConsoleWindowClass", NULL), 1);
	
	
	_hook = SetWindowsHookEx(	  
		WH_KEYBOARD_LL,
		hookCallBack,
		NULL,
		0
	);
	
	
	
	if(_hook == 0){
		std::cout << "SetWindowsHookEx ERROR" << std::endl;
		std::cout << GetLastError() << std::endl;
	}
	
	MSG message;
	
	while(true){
		GetMessage(&message, NULL, 0, 0);
		std::cout << "message" << std::endl;
	}
	
	
	
	
	std::cout << UnhookWindowsHookEx(_hook) << std::endl;
	std::cout << "END" << std::endl;

}