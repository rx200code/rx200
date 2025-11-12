#include <iostream>
//#include <string>     // для std::getline
#include "windows.h"

HHOOK _hook;
KBDLLHOOKSTRUCT kbStruct;
INPUT ip;
LRESULT CALLBACK hookCallBack(int nCode, WPARAM wParam, LPARAM lParam){
	//std::cout << counter << std::endl;
	//out(nCode);
	if(nCode >= 0){
		if(wParam == WM_KEYDOWN){
			//std::cout << kbStruct.vkCode << std::endl;
			//std::cout << kbStruct.scanCode << std::endl;
			// Подмена.
			kbStruct = *((KBDLLHOOKSTRUCT*)lParam);
			switch(kbStruct.vkCode){
				case 81:{// q -> 6 & mouse;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 54;
					SendInput(1, &ip, sizeof(INPUT));
					ip.type = INPUT_MOUSE;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 87:{// w -> 7 & mouse;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 55;
					SendInput(1, &ip, sizeof(INPUT));
					ip.type = INPUT_MOUSE;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 69:{// e -> 8 & mouse;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 56;
					SendInput(1, &ip, sizeof(INPUT));
					ip.type = INPUT_MOUSE;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 82:{// r -> 9 & mouse;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 57;
					SendInput(1, &ip, sizeof(INPUT));
					ip.type = INPUT_MOUSE;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 84:{// t -> 0 & mouse;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 58;
					SendInput(1, &ip, sizeof(INPUT));
					ip.type = INPUT_MOUSE;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 83:{// s -> Alt(r);
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 165;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 68:{// d -> m;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 77;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}case 70:{// f -> i;
					ip.type = INPUT_KEYBOARD;
					ip.ki.wVk = 73;
					SendInput(1, &ip, sizeof(INPUT));
					return 1;
				}
			}
		}else if(wParam == WM_SYSKEYUP){// Alt(r) -> up
			ip.type = INPUT_KEYBOARD;
			ip.ki.wVk = 165;
			ip.ki.dwFlags = KEYEVENTF_KEYUP;
			SendInput(1, &ip, sizeof(INPUT));
			ip.ki.dwFlags = 0;
			return 1;
		}
	}
	return CallNextHookEx(_hook, nCode, wParam, lParam);
}


int main()
{
	ShowWindow(FindWindowA("ConsoleWindowClass", NULL), 1);
	
	ip.ki.wScan = 0; 
	ip.ki.time = 0;
	ip.ki.dwExtraInfo = 0;
	ip.ki.dwFlags = 0; // key press
	ip.mi.dx = 0;
	ip.mi.dy = 0;
	ip.mi.dwFlags = (MOUSEEVENTF_RIGHTDOWN | MOUSEEVENTF_RIGHTUP);
	ip.mi.mouseData = 0;
	ip.mi.dwExtraInfo = 0;
	ip.mi.time = 0;
	
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