#include<windows.h>



//* взято с http://radiofront.narod.ru/htm/prog/htm/winda/api/api.html
//Создаём прототип функции окна
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
//объявляем имя программы
char szProgName[]="Имя программы";

//char iconPath[] = "resource/iconx.bmp";
//char iconPath[] = {'r','e','s','o','u','r','c','e','/','i','c','o','n','.','i','c','o', 0};

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpszCmdLine, int nCmdShow){
	HWND hWnd; //идентификатор окна
	MSG lpMsg;

	WNDCLASS w; //создаём экземпляр структуры WNDCLASS и начинаем её заполнять

	w.lpszClassName=szProgName; //имя программы
	w.hInstance=hInstance; //идентификатор текущего приложения
	w.lpfnWndProc=WndProc; //указатель на функцию окна
	w.hCursor=LoadCursor(NULL, IDC_ARROW); //загружаем курсор в виде стрелки
	//w.hIcon=LoadIcon(hInstance, IDI_ASTERISK);// иконка
	//w.hIcon=LoadIcon(NULL, iconPath);// иконка
	//*
	w.hIcon=(HICON) LoadImage(	// returns a HANDLE so we have to cast to HICON // загружаем иконку.
		NULL,					// hInstance must be NULL when loading from a file
		"resource/icon.ico",	// the icon file name
		IMAGE_ICON,				// specifies that the file is an icon
		0,						// width of the image (we'll specify default later on)
		0,						// height of the image
		LR_LOADFROMFILE|		// we want to load a file (as opposed to a resource)
		LR_DEFAULTSIZE|			// default metrics based on the type (IMAGE_ICON, 32x32)
		LR_SHARED				// let the system release the handle when it's no longer used
	);//*/
	w.lpszMenuName=0; //и меню пока не будет
	//w.hbrBackground=(HBRUSH)GetStockObject(WHITE_BRUSH); //цвет фона окна - белый
	w.hbrBackground=CreateSolidBrush(0x00888888); //цвет фона окна - белый
	w.style=CS_HREDRAW|CS_VREDRAW; //стиль окна - перерисовываемое по х и по у
	w.cbClsExtra=0;
	w.cbWndExtra=0;

	//Если не удалось зарегистрировать класс окна - выходим
	if(!RegisterClass(&w))
		return 0;

	//Создадим окно в памяти, заполнив аргументы CreateWindow

	hWnd=CreateWindow(
		szProgName, //Имя программы
		"Моя первая программа!", //Заголовок окна
		WS_OVERLAPPEDWINDOW, //Стиль окна - перекрывающееся
		100, //положение окна на экране по х
		100, //по у
		500, //размеры по х
		400, //по у
		(HWND)NULL, //идентификатор родительского окна
		(HMENU)NULL, //идентификатор меню
		(HINSTANCE)hInstance, //идентификатор экземпляра программы
		(HINSTANCE)NULL //отсутствие дополнительных параметров
	);
	
	
	/*Создание строки состояния*/
 
    HMENU hMenu = CreateMenu ();
	HMENU hMenu1 = CreatePopupMenu ();
	HMENU hMenu2 = CreatePopupMenu ();
	 
	AppendMenu (hMenu, MF_POPUP, (UINT_PTR)hMenu1, "&test");
	 
	AppendMenu (hMenu1, MF_STRING, 1000, "test1");
	AppendMenu (hMenu1, MF_STRING, 2000, "test2");
	AppendMenu (hMenu1, MF_STRING, 3000, "test3");
	AppendMenu (hMenu1, MF_SEPARATOR, 0, NULL);
	 
	AppendMenu (hMenu2, MF_STRING, 4000, "test5");
	AppendMenu (hMenu1, MF_STRING | MF_POPUP, (UINT_PTR)hMenu2, "test4");
	 
	SetMenu (hWnd, hMenu);

	//Выводим окно из памяти на экран
	ShowWindow(hWnd, nCmdShow);
	//Обновим содержимое окна
	UpdateWindow(hWnd);

	//Цикл обработки сообщений

	while(GetMessage(&lpMsg, NULL, 0, 0)) { //Получаем сообщение из очереди
		TranslateMessage(&lpMsg); //Преобразуем сообщения клавиш в символы
		DispatchMessage(&lpMsg); //Передаём сообщение соответствующей функции окна
	}
	return(lpMsg.wParam);
}



//char text_number[11]={48, 48, 48, 48, ' ', ' ', 48, 48, 48, 48, 0};
char text_number[12]={48, 48, 48, 48, 48, ' ', 48, 48, 48, 48, 48, 0};
int n_test = 1234567893;
void f_int_to_text(int n){
	//int x = n & 0xFFFF;
	int x = LOWORD(n);
	n >>= 16;// y
	int dilimiter = 10000;
	for(int i = 0; i < 5; ++i){
		text_number[i + 6] = (char)((x / dilimiter) % 10 + 48);
		dilimiter /= 10;
	}
	dilimiter = 10000;
	for(int i = 0; i < 5; ++i){
		text_number[i] = (char)((n / dilimiter) % 10 + 48);
		dilimiter /= 10;
	}
	
	/*
	int dilimiter = 1000000000;
	for(int i = 0; i < 10; ++i){
		text_number[i] = (char)((n / dilimiter) % 10 + 48);
		dilimiter /= 10;
	}//*/
}

//Функция окна
LRESULT CALLBACK WndProc(HWND hWnd, UINT messg, WPARAM wParam, LPARAM lParam){
	HDC hdc; //создаём контекст устройства
	PAINTSTRUCT ps; //создаём экземпляр структуры графического вывода
	
	//Цикл обработки сообщений
	switch(messg){
		//сообщение рисования
		case WM_RBUTTONUP:
			
			f_int_to_text(lParam);
			MessageBox(NULL, text_number, "WM_LBUTTONUP", MB_OK);
			break;
		case WM_MOUSEMOVE://WM_LBUTTONUP
			
			f_int_to_text(lParam);
			InvalidateRect(hWnd, 0, true);
			break;
		//сообщение рисования
		case WM_PAINT:
			//начинаем рисовать
			hdc=BeginPaint(hWnd, &ps);
			//здесь вы обычно вставляете свой текст:
			TextOut(hdc, 150,150, "Здравствуй, WIN 32 API!!!!", 26);
			TextOut(hdc, 150,170, text_number, 11);
			//закругляемся
			//обновляем окно
			ValidateRect(hWnd, NULL);
			//заканчиваем рисовать
			EndPaint(hWnd, &ps);
			break;
		
		case WM_COMMAND:
			switch (LOWORD(wParam)) {
				case 1000:
					MessageBox(NULL, "Hello World", "Hello", MB_OK);
					break;
			}
			break;
		
		
		
		//сообщение выхода - разрушение окна
		case WM_DESTROY:
			PostQuitMessage(0); //Посылаем сообщение выхода с кодом 0 - нормальное завершение
			break;

		default:
			return(DefWindowProc(hWnd, messg, wParam, lParam)); //освобождаем очередь приложения от нераспознаных
	}
	return 0;
}
//*/
/* Сообщение.
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpszCmdLine, int nCmdShow){
	MessageBox(0, "Привет, Win32 API", "Первое окно...", MB_ICONINFORMATION | MB_OK);
	return 0;
}
//*/
////////
/*
#include <windows.h>
 
int WINAPI WinMain (HINSTANCE hInstance, 
                                 HINSTANCE hPrevInstance, 
                                 PSTR szCmdLine, 
                                 int iCmdShow) 
{
      MessageBox (NULL, "Hello", "Hello Demo", MB_OK);
      return (0);
}
//*/
/*
#include <windows.h>
 
int WINAPI WinMain(HINSTANCE hInstance,
                   HINSTANCE hPrevInstance,
                   LPSTR lpCmdLine,
                   int nCmdShow) {
 
  MessageBox(NULL, "Hello World", "Hello", MB_OK);
 
  return 0;
}
//*/
/*
#include <windows.h>
#include <tchar.h>
 
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
TCHAR WinName[] = _T("MainFrame");
 
INT_PTR CALLBACK About(HWND, UINT, WPARAM, LPARAM);
 
int APIENTRY _tWinMain(HINSTANCE This, HINSTANCE Prew, LPTSTR cmd, int mode){
    HWND hWnd;
    MSG msg;
    WNDCLASS wc;
 
            wc.hInstance        = This;                                 // 
            wc.lpszClassName    = WinName;                              // Имя класса окна
            wc.lpfnWndProc      = WndProc;                              // Функция окна
            wc.style            = CS_HREDRAW | CS_VREDRAW;              // Стиль окна
            wc.hIcon            = LoadIcon(NULL, IDI_WINLOGO);          // Стандартная иконка
            wc.hCursor          = LoadCursor(NULL, IDC_ARROW);          // Стандартный курсор
            wc.lpszMenuName     = NULL;                                 // Меню ( NULL = нету )
            wc.cbClsExtra       = 0;                                    // Нет дополнительных данных класса
            wc.cbWndExtra       = 0;                                    // Нет дополнительных данных окна
 
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW+1);
 
    if(!RegisterClass(&wc)) return 0;
 
    hWnd = CreateWindow(WinName,
                        _T("??? Windows-???y"),// "Каркас Windows-приложения"
                        WS_OVERLAPPEDWINDOW,
                        CW_USEDEFAULT,
                        CW_USEDEFAULT,
                        CW_USEDEFAULT,
                        CW_USEDEFAULT,
                        HWND_DESKTOP, 
                        NULL, 
                        This, 
                        NULL);
 
    ShowWindow(hWnd, mode);
 
    while(GetMessage(&msg, NULL, 0, 0)){
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
return 0;
}
 
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam){
    switch(message){
        case WM_DESTROY : PostQuitMessage(0);
                          break;
        default: return DefWindowProc(hWnd, message, wParam, lParam);
    }
return 0;
}
//*/
/*
#include<windows.h>
#include <tchar.h>

char szClassName[]="Имя программы";
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpszCmdLine, int nCmdShow){
	
	TCHAR szText[80];
	USHORT regCS,regDS,regSS;

	regCS = 0xFF;
	regDS = 0xA1;
	regSS = 0x88;
	
	wsprintf(szText, _T(" CS=%X, DS=%X, SS=%X\n WinMain=%X\n szClassName=%X"), regCS, regDS, regSS, WinMain, szClassName); 
	MessageBox(NULL, szText, _T(" Регистры"), MB_ICONINFORMATION);
	
	//MessageBox(0, "Привет, Win32 API", "Первое окно...", MB_ICONINFORMATION | MB_OK);
	return 0;
}
//*/