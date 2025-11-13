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
//*
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
                        _T("������ Windows-����������"),// "Каркас Windows-приложения"
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