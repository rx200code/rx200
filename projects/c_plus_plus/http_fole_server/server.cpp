#include <winsock2.h>
#include <Mswsock.h>//Mswsock.lib
#include <windows.h>
#include <string>
#define ID_BUTTON_START_STOP 3000
#define ID_BUTTON_FILE 3001
#define ID_BUTTON_INDEX 3002
#define ID_EDIT_IP 3003
#define ID_EDIT_PORT 3004
#define ID_EDIT_OUT 3005
#define ID_EDIT_ERROR 3007
#define ID_EDIT_MESSAGE 3008

#define GCL_HMODULE -16

const char CZ_START[] = "Start";
const char CZ_STOP[] = "Stop";
const char CZ_DEFAULT_ADDR[] = "192.168.0.10";
const char CZ_PORT[] = "80";
const char CZ_FILE[] = "File";
const char CZ_INDEX[] = "index:";
const char CZ_DIRECTORY_TEMP[] = "temp";

char szFile[2048];
size_t size_szFile = sizeof(szFile);
char szFileDirectory[1024];
size_t size_szFileDirectory = sizeof(szFileDirectory);
int counterFile = 0;
const int quantityFile = 128;
const int lengthNameFile = 256;
char fileNames[quantityFile][lengthNameFile];

//const char* CURRENT_DIRECTORY;
char szDirectoryTemp[1024];
size_t sizeDirectoryTemp = sizeof(szDirectoryTemp);
DWORD i_sizeDirectoryTemp;
char szDirectoryTempPath[1280];
HWND hMainWnd; //идентификатор окна

// Сигнатуры функций.
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);
DWORD WINAPI ThreadFuncServer(PVOID);
void StartServer();
void StopServer();

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow){
	//* определяем директорию запуска программы в CURRENT_DIRECTORY
	i_sizeDirectoryTemp = GetCurrentDirectory(sizeDirectoryTemp, szDirectoryTemp);
	if(i_sizeDirectoryTemp == 0)MessageBox(NULL, "GetCurrentDirectory", "ERROR", MB_OK);
	if(i_sizeDirectoryTemp < sizeDirectoryTemp)szDirectoryTemp[i_sizeDirectoryTemp] = '\\';
	else MessageBox(NULL, "ERROR", "недостаточный размер szDirectoryTemp", MB_OK);
	++i_sizeDirectoryTemp;
	//CURRENT_DIRECTORY = czCurrentDirectory;
	//*/
	// Создаем в дериктории программы CURRENT_DIRECTORY папку tmp если не создана. для загрузки файлов.
	if(CreateDirectory(CZ_DIRECTORY_TEMP, NULL) == 0 && GetLastError() != ERROR_ALREADY_EXISTS)MessageBox(NULL, "CreateDirectory", "ERROR", MB_OK);
	
	if((i_sizeDirectoryTemp + 6) < sizeDirectoryTemp){
		for(int i = 0; i < 4; ++i)szDirectoryTemp[i_sizeDirectoryTemp++] = CZ_DIRECTORY_TEMP[i];
		szDirectoryTemp[i_sizeDirectoryTemp++] = '\\';
		szDirectoryTemp[i_sizeDirectoryTemp] = 0;
	}else MessageBox(NULL, "недостаточный размер szDirectoryTemp2", "ERROR", MB_OK);
	strcpy(szDirectoryTempPath, szDirectoryTemp);
	
	MSG msg;
	char szClassName[] = "MyClass";
	
	WNDCLASSEX wc; // WNDCLASSEX для RegisterClassEx а WNDCLASS для RegisterClass
	
	wc.cbSize = sizeof(wc);// Размер данной структуры в байтах
	wc.style = CS_HREDRAW|CS_VREDRAW;// Стиль окна - перерисовываемое по х и по у
	wc.lpfnWndProc = WndProc;// Указатель на функцию окна
	wc.cbClsExtra = 0;// Число дополнительных байтов в конце класса окна
	wc.cbWndExtra = 0;// Число дополнительных байтов за экземпляром окна
	wc.hInstance = hInstance;// Дискриптор(идентификатор) текущего приложения
	wc.hIcon = LoadIcon(NULL, IDI_APPLICATION);// Дискриптор иконки
	wc.hCursor = LoadCursor(NULL, IDC_ARROW);// Дисариптор курсор IDC_ARROW в виде стрелки
	wc.hbrBackground = CreateSolidBrush(0x00AAAAAA);//(HBRUSH)GetStockObject(WHITE_BRUSH);// Дискриптор фона окна WHITE_BRUSH - белый
	wc.lpszMenuName = NULL;// Указатель на строку имени меню, по умолчанию для этого класса
	wc.lpszClassName = szClassName;// Указатель на имя класса окна
	wc.hIconSm = LoadIcon(NULL, IDI_APPLICATION);// Дискриптор малой иконки
	
	//Если не удалось зарегистрировать класс окна - выходим
	if(!RegisterClassEx(&wc)){
		MessageBox(NULL, "Cannot register class WNDCLASSEX", "ERROR", MB_OK);
		return 0;
	}
	
	//Создадим окно в памяти, заполнив аргументы CreateWindow
	hMainWnd=CreateWindow(
		szClassName, //Имя зарегистрированного класса окна
		"Сервер HTTP", //Заголовок окна
		WS_OVERLAPPEDWINDOW, //Стиль окна - перекрывающееся
		100, //положение окна на экране по х
		50, //по у
		800, //размеры по х
		450, //по у
		(HWND)NULL, //идентификатор родительского окна
		(HMENU)NULL, //идентификатор меню
		(HINSTANCE)hInstance, //идентификатор экземпляра программы
		//(HINSTANCE)NULL //отсутствие дополнительных параметров
		NULL //Указатель на данные переданные в сообщение WM_CREATE
	);
	if(!hMainWnd){
		MessageBox(NULL, "Cannot create main window", "ERROR", MB_OK);
		return 0;
	}
	
	//Выводим окно из памяти на экран
	ShowWindow(hMainWnd, nCmdShow);
	
	//Обновим содержимое окна
	//UpdateWindow(hMainWnd);
	//Цикл обработки сообщений
	while(GetMessage(&msg, NULL, 0, 0)) { //Получаем сообщение из очереди
		TranslateMessage(&msg); //Преобразуем сообщения клавиш в символы
		DispatchMessage(&msg); //Передаём сообщение соответствующей функции окна
	}
	
	//delete[] czCurrentDirectory;
	return(msg.wParam);
}
int flags;
//Функция окна
LRESULT CALLBACK WndProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam){
	HDC hDC; //создаём контекст устройства
	PAINTSTRUCT ps; //создаём экземпляр структуры графического вывода
	static RECT rect_text_ip;
	static RECT rect_text_port;
	static RECT rect_text_message;
	static HWND hButton;
	static HWND hButtonFile;
	static HWND hButtonIndex;
	static OPENFILENAME lpofn;
	static HWND hEditAddr;
	static HWND hEditPort;
	static HWND hEditOut;
	static HWND hEditMessage;
	static HWND hEditError;
	//Цикл обработки сообщений
	switch(uMsg){
		//сообщение рисования
		case WM_PAINT:
			//начинаем рисовать
			hDC=BeginPaint(hWnd, &ps);
			SetBkMode(hDC, TRANSPARENT);
			DrawText(hDC, "ip:", -1, &rect_text_ip, DT_SINGLELINE | DT_CENTER | DT_VCENTER);
			DrawText(hDC, "port:", -1, &rect_text_port, DT_SINGLELINE | DT_CENTER | DT_VCENTER);
			DrawText(hDC, "message", -1, &rect_text_message, DT_SINGLELINE | DT_CENTER | DT_VCENTER);
			//заканчиваем рисовать
			EndPaint(hWnd, &ps);
			break;
		/* закоментированно так как DestroyWindow(hWnd) Вызовется через DefWindowProc(hWnd, uMsg, wParam, lParam)
		case WM_CLOSE:
			DestroyWindow(hWnd);// разрушаем окно, посылает событие WM_DESTROY
			break;
		//*/
		// Создание окна.
		case WM_CREATE:
			flags = 0;
			szFile[0] = 0;
			lpofn.lStructSize = sizeof(OPENFILENAME);
			lpofn.hwndOwner = hWnd;
			lpofn.lpstrFile = szFile;
			lpofn.nMaxFile = size_szFile;
			lpofn.lpstrTitle = "Выбор файлов для передачи";
			lpofn.Flags = OFN_ALLOWMULTISELECT | OFN_EXPLORER | OFN_FILEMUSTEXIST;
			
			hButton = CreateWindow(
				"button",// Указатель на имя класса
				CZ_START,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON,// Стиль окна
				0,// Координата x
				0,// Координата y
				70,// ширина
				20,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_BUTTON_START_STOP,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			rect_text_ip.left = 70;
			rect_text_ip.top = 0;
			rect_text_ip.right = 100;
			rect_text_ip.bottom = 20;
			hEditAddr = CreateWindow(
				"edit",// Указатель на имя класса
				CZ_DEFAULT_ADDR,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | WS_BORDER | ES_LEFT,// Стиль окна
				100,// Координата x
				0,// Координата y
				120,// ширина
				20,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_EDIT_IP,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			rect_text_port.left = 220;
			rect_text_port.top = 0;
			rect_text_port.right = 270;
			rect_text_port.bottom = 20;
			hEditPort = CreateWindow(
				"edit",// Указатель на имя класса
				CZ_PORT,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | WS_BORDER | ES_LEFT | ES_NUMBER | ES_READONLY,// Стиль окна
				270,// Координата x
				0,// Координата y
				50,// ширина
				20,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_EDIT_PORT,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			hButtonFile = CreateWindow(
				"button",// Указатель на имя класса
				CZ_FILE,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON,// Стиль окна
				340,// Координата x
				0,// Координата y
				70,// ширина
				20,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_BUTTON_FILE,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			hButtonIndex = CreateWindow(
				"button",// Указатель на имя класса
				CZ_INDEX,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | BS_CHECKBOX | BS_LEFTTEXT | BS_AUTOCHECKBOX,// Стиль окна
				420,// Координата x
				0,// Координата y
				60,// ширина
				20,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_BUTTON_INDEX,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			
			rect_text_message.left = 480;
			rect_text_message.top = 0;
			rect_text_message.right = 700;
			rect_text_message.bottom = 20;
			hEditOut = CreateWindow(
				"edit",// Указатель на имя класса
				NULL,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | WS_BORDER | ES_LEFT | ES_MULTILINE | ES_WANTRETURN | ES_AUTOHSCROLL | ES_AUTOVSCROLL | ES_READONLY,// Стиль окна
				0,// Координата x
				30,// Координата y
				420,// ширина
				300,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_EDIT_OUT,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			hEditMessage = CreateWindow(
				"edit",// Указатель на имя класса
				NULL,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | WS_BORDER | ES_LEFT | ES_MULTILINE | ES_WANTRETURN | ES_AUTOHSCROLL | ES_AUTOVSCROLL,// Стиль окна
				420,// Координата x
				30,// Координата y
				280,// ширина
				300,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_EDIT_MESSAGE,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			hEditError = CreateWindow(
				"edit",// Указатель на имя класса
				NULL,// Указатель на имя окна
				WS_CHILD | WS_VISIBLE | WS_VSCROLL | WS_HSCROLL | WS_BORDER | ES_LEFT | ES_MULTILINE | ES_WANTRETURN | ES_AUTOHSCROLL | ES_AUTOVSCROLL | ES_READONLY,// Стиль окна
				0,// Координата x
				340,// Координата y
				700,// ширина
				70,// высота
				(HWND)hWnd,// дисериптор родителя
				(HMENU)ID_EDIT_ERROR,// дискриптор меню или дочернего океа // для кнопок код команды
				(HINSTANCE)GetClassLong(hWnd, GCL_HMODULE),// GetModuleHandle(NULL)// hInstance,//
				NULL// указатель на данные окна
			);
			break;
		case WM_COMMAND:
			switch (LOWORD(wParam)) {
				case ID_BUTTON_START_STOP:
					if(flags & 1){
						SetWindowText(hButton, CZ_START);
						StopServer();
					}else{
						SetWindowText(hButton, CZ_STOP);
						StartServer();
					}
					EnableWindow(hButtonFile, flags);
					EnableWindow(hButtonIndex, flags);
					flags ^= 1;
					SendMessage(hEditAddr, EM_SETREADONLY, flags, 0);
					SendMessage(hEditMessage, EM_SETREADONLY, flags, 0);
					break;
				case ID_BUTTON_FILE:
					counterFile = 0;
					if(!GetOpenFileName(&lpofn)){
						szFile[0] = 0;
						SetWindowText(hEditError, "Ошибка выбора файлов");
					}else{
						//* доделать
						int i = 0;
						for(; i < lpofn.nFileOffset && i < size_szFile && i < size_szFileDirectory;){
							szFileDirectory[i] = szFile[i];
							if(szFile[i++] == 0)break;
						}
						if(szFileDirectory[i - 1] == '\\')szFileDirectory[i - 1] = 0;
						
						for(int j = 0; i < size_szFile && j < lengthNameFile && counterFile < quantityFile;){
							fileNames[counterFile][j] = szFile[i];
							if(szFile[i++] == 0){
								if(j == 0)break;
								j = 0;
								++counterFile;
							}else ++j;
						}
						
						szFile[size_szFile - 1] = 0;//*/
					}
					SetWindowText(hEditOut, szFile);
					
					break;
			}
			break;
		//сообщение выхода - разрушение окна
		case WM_DESTROY:
			PostQuitMessage(0); //Посылает событие WM_QUIT. Посылаем сообщение(msg.wParam) выхода с кодом 0
			break;

		default:
			return DefWindowProc(hWnd, uMsg, wParam, lParam); //освобождаем очередь приложения от нераспознаных
	}
	
	return 0;
}
//
bool f_index = false;
std::string str_response_index;
SOCKET callback_socket, connect_socket;
HANDLE hThreadServer;
char cz_message[8192];
int len_cz_message = sizeof(cz_message);
void StartServer(){
	f_index = BST_CHECKED == SendMessage(GetDlgItem(hMainWnd, ID_BUTTON_INDEX), BM_GETCHECK, 0, 0);
	if(!f_index){
		std::string str_index_body = "<!DOCTYPE html>\n<html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=Windows-1251\"><title>Передача файлов</title></head><body><form enctype=\"multipart/form-data\" method=\"post\" autocomplete=\"off\"><textarea name=\"m\"></textarea><br><input type=\"file\" name=\"f\" multiple><br><button type=\"submit\">Отправить</button></form><hr>";
		unsigned int len_message = GetDlgItemText(hMainWnd, ID_EDIT_MESSAGE, cz_message, len_cz_message);
		if(len_message)str_index_body += std::string(cz_message) + "<hr>";
		for(int i = 0; i < counterFile; ++i)str_index_body += "<a href=\"" + std::to_string(i) + "\" download>" + std::string(fileNames[i]) + "</a><br>";
		
		str_index_body += "</body></html>";
		str_response_index = "HTTP/1.0 200 OK\r\nServer: RX200\r\nContent-type: text/html\r\nContent-length: " + std::to_string(str_index_body.length()) + "\r\n\r\n" + str_index_body;
	}
	hThreadServer = CreateThread(NULL, 0, ThreadFuncServer, NULL, 0, NULL);
}
void StopServer(){
	if(connect_socket != INVALID_SOCKET)shutdown(connect_socket, SD_BOTH);
	if(closesocket(callback_socket))
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова close callback_socket");
	CloseHandle(hThreadServer);
	SetDlgItemText(hMainWnd, ID_EDIT_OUT, "Stop");
}

// SERVER
char cz_response_HTTP_404[] = "HTTP/1.1 404 Not Found\r\nServer: RX200\r\nContent-type: text/html; charset=windows-1251\r\nContent-length: 107\r\n\r\n<!DOCTYPE HTML>\n<html><head><title>404 Not Found</title></head><body><h1>Тут ничего нет.</h1></body></html>";

std::string str_out;

DWORD WINAPI ThreadFuncServer(PVOID p){
	str_out = "";
	connect_socket = INVALID_SOCKET;
	SetDlgItemText(hMainWnd, ID_EDIT_OUT, "Start");
	
	// Задаем адрес сервера.
	char cz_addr_ip[16];
	GetDlgItemText(hMainWnd, ID_EDIT_IP, cz_addr_ip, 16);
	unsigned long ul_addr_ip = inet_addr(cz_addr_ip);
	if(ul_addr_ip == INADDR_NONE){
		SetDlgItemText(hMainWnd, ID_EDIT_IP, CZ_DEFAULT_ADDR);
		ul_addr_ip = inet_addr(strcpy(cz_addr_ip, CZ_DEFAULT_ADDR));
		if(ul_addr_ip == INADDR_NONE)return 1;
	}
	
	WSADATA w;
	if(WSAStartup(0x0202, &w)){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка WSASartup");
		return 1;
	}
	if(w.wVersion != 0x0202){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка версии w.wVersion");
		WSACleanup();
		return 1;
	}
	
	struct sockaddr_in server_addr, client_addr;
	//SOCKET callback_socket, connect_socket;
	int rc;
	char buf[2048];
	size_t buf_len = sizeof(buf) - 1;
	char *buf_pointer;
	int on = 1;
	
	server_addr.sin_family = AF_INET;
	server_addr.sin_port = htons(80);
	server_addr.sin_addr.s_addr = ul_addr_ip;
	//*/
	callback_socket = socket(AF_INET, SOCK_STREAM, 0);
	if(callback_socket == INVALID_SOCKET){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова socket ");
		return 1;
	}
	
	if( bind(callback_socket, (struct sockaddr *) &server_addr, sizeof(server_addr)) ){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова bind");
		return 2;
	}
	
	
	if( listen(callback_socket, 3) ){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова listen");
		return 3;
	}
	
	do{
		int addr_len = sizeof(client_addr);
		
		connect_socket = accept(callback_socket, (struct sockaddr *) &client_addr, &addr_len);
		if(connect_socket == INVALID_SOCKET){
			WSACleanup();
			SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова accept");
			return 4;
		}
		
		
		if( setsockopt(connect_socket, SOL_SOCKET, SO_KEEPALIVE, (char*) &on, sizeof(on)) )SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова setsockopt");
		
		int count_read = buf_len;
		buf_pointer = &buf[0];
		int k = 0;
		
		while(count_read > 0){
			rc = recv(connect_socket, buf_pointer, count_read, 0);
			if(rc < 0){
				if(GetLastError() == EINTR)continue;
				SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова recv");
				return 5;
			}
			if(rc == 0)break;
			buf_pointer += rc;
			count_read -= rc;
			//if(buf[buf_len - count_read - 1] == '\n')break;// Сделать конец HTTP запроса
			// нахождение конца заголовков \n\n
			//*
			while(&buf[k] <= buf_pointer){
				if(buf[k++] == '\n'){
					if(&buf[k] <= buf_pointer && buf[k] == '\r')++k;
					if(&buf[k] <= buf_pointer && buf[k] == '\n')goto goto_end;
				}
			}//*/
			
			// добавить определение post /
			// анализ заголовков
			// нахождение конца заголовков \n\n
			
			// Проверяем начинается ли ввод с post
			// ищем Content-Type: multipart/form-data; boundary=(запомнить)
			// ищем Content-Length: (запомнить)
			// strcasestr
			// \r\n - перенос строки
			/*
			в заголовке после : игнорируем зозможный пробер, перед и после значения заголовка.
			//*/
			/*
			CR = <US-ASCII CR, возврат каретки (13)> \r
			LF = <US-ASCII LF, перевод строки (10)> \n
			HTTP/1.1 определяет последовательность CR LF как маркер конца строки для всех элементов протокола, кроме тела объекта
			%x0D %x0A
			
			Хотя ограничителем строки для полей start-line и header является последовательность CRLF, получатель МОЖЕТ распознать одиночный LF как ограничитель строки и проигнорировать любой предшествующий CR.
			Поэтому, если вы не хотите быть злым или иным образом нарушать правила RFC, используйте \r\n
			CRLF
			//*/
			
			
		}
		goto_end:
		int buf_len_out = buf_len - count_read;
		//buf[buf_len_out] = 0;
		buf[k] = 0;
		SetDlgItemText(hMainWnd, ID_EDIT_OUT, buf);
		
		// f_POST
		int len_POST = 4;
		char c_POST[len_POST] = {'P', 'O', 'S', 'T'};
		bool f_POST = strncmp(buf, c_POST, len_POST) == 0;
		unsigned long long ContentLength = 0;
		char boundary[128] = "\r\n--";
		int i_boundary = 4;
		if(f_POST){
			char substring[] = "Content-Length:";
			buf_pointer = strstr(buf, substring);
			if(buf_pointer != NULL){
				buf_pointer += 15;
				if(*buf_pointer == ' ')++buf_pointer;
				while(*buf_pointer >= '0' && *buf_pointer <= '9'){
					ContentLength *= 10;
					ContentLength += *buf_pointer - 48;
					++buf_pointer;
				}
				if(ContentLength <= 0){
					f_POST = false;
					goto goto_end2;
				}
			}else{
				f_POST = false;
				goto goto_end2;
			}
			char substring2[] = "Content-Type: multipart/form-data; boundary=";
			buf_pointer = strstr(buf, substring2);
			if(buf_pointer != NULL){
				buf_pointer += 44;
				while(*buf_pointer != '\r'){
					boundary[i_boundary] = *buf_pointer;
					++buf_pointer;
					++i_boundary;
				}
				boundary[i_boundary] = 0;
				if(i_boundary < 5)f_POST = false;
			}else f_POST = false;
		}
		goto_end2:
		
		//k++;// buf[k] Данные после заголовков, должны начинаться с разделителя boundary
		//int len_boundary = i_boundary;
		//i_boundary = 2;
		// buf_len_out // количество переданных байт в buf.
		// ContentLength // общее количество байт которых нужно принять после заголовков.
		bool f_CRLF = false, f_LF = false, f_CONTENT = true, f_message = true, f_read_file_name = false, f_find_empty_str = false, f_data = false, f_file_open = true, f_file_write = true;
		int len_CRLF = 2, len_CONTENT_m = 39, len_CONTENT_f = 52;
		char c_CRLF[len_CRLF] = {'\r', '\n'};
		char c_CONTENT[len_CONTENT_f] = "Content-Disposition: form-data; name=\"m\"; filename=\"";
		char cz_file_name[256];
		int len_file_name = 0;
		char cz_message_out[8192];
		cz_message_out[0] = 0;
		int len_cz_message_out = sizeof(cz_message_out);
		int i_data_out = 0;
		//cz_file_name[0] = 0;
		int counter = 0;
		int temp_counter = 0;
		--i_boundary;
		HANDLE hFile_out;
		DWORD lpNumberOfBytesWritten;
		char buf_file_write[4096];
		int len_buf_file_write = sizeof(buf_file_write);
		int i_buf_file_write = 0;
		//*
		for(;;){
			if(ContentLength > 0){
				++k;// только тут увеличиваем k
				if(k >= buf_len_out){// ещё данных
					// загружаем данные в buf обновляем buf_len_out
					rc = recv(connect_socket, buf, buf_len, 0);
					if(rc < 0){
						if(GetLastError() == EINTR)continue;
						SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова recv");
						return 5;
					}
					if(rc == 0)break;
					buf_len_out = rc;
					k = 0;
				}
			}else goto go_exit;// exit;
			// посимвольный анализ данных
			if(f_LF){// ищем конец сроки \n
				if(buf[k] == c_CRLF[1]){
					f_LF = false;
				}
			}else if(f_data){// если данные.
				// ищем конец данных, если не конец данных.
				if(f_message){// пишем в сообщение.
					
					if(boundary[counter] == buf[k]){
						if(counter == i_boundary){// конец данных
							f_message = false;
							cz_message_out[i_data_out] = 0;
							SetDlgItemText(hMainWnd, ID_EDIT_MESSAGE, cz_message_out);
							counter = 0;
							f_data = false;
							f_LF = true;
						}else ++counter;
					}else{
						if(counter > 0){
							temp_counter = 0;
							while(temp_counter < counter){
								if(i_data_out == len_cz_message_out)break;
								cz_message_out[i_data_out++] = boundary[temp_counter++];
							}
							counter = 0;
						}
						if(buf[k] == boundary[0]){
							counter = 1;
							goto go_continue;
						}
						if(i_data_out == len_cz_message_out)goto go_continue;
						cz_message_out[i_data_out++] = buf[k];
					}
					
				}else{// пишем в файл.
					if(boundary[counter] == buf[k]){
						if(counter == i_boundary){// конец данных
							counter = 0;
							f_data = false;
							f_LF = true;
							f_file_write = false;
							f_file_open = true;
							if(i_buf_file_write > 0){
								if(!WriteFile(hFile_out, buf_file_write, i_buf_file_write, &lpNumberOfBytesWritten, NULL))f_file_write = false;
								i_buf_file_write = 0;
							}
							CloseHandle(hFile_out);
						}else ++counter;
					}else{
						
						// пишем в файл.
						if(f_file_open){// открываем файл.
							if(len_file_name > 0){
								szDirectoryTempPath[i_sizeDirectoryTemp] = 0;
								strcat(szDirectoryTempPath, cz_file_name);
								hFile_out = CreateFile(szDirectoryTempPath, GENERIC_WRITE, 0, NULL, CREATE_NEW, 0, NULL);
								if(hFile_out == INVALID_HANDLE_VALUE){
									SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка hFile_out == INVALID_HANDLE_VALUE");
									f_file_write = false;// действие если например файл уже есть.
								}else f_file_write = true;
								i_buf_file_write = 0;
							}
							f_file_open = false;
						}
						if(f_file_write){// пишем в файл.
							if(counter > 0){
								temp_counter = 0;
								while(temp_counter < counter){
									buf_file_write[i_buf_file_write++] = boundary[temp_counter++];
									if(i_buf_file_write == len_buf_file_write){
										i_buf_file_write = 0;
										if(!WriteFile(hFile_out, buf_file_write, len_buf_file_write, &lpNumberOfBytesWritten, NULL))f_file_write = false;
									}
								}
								
								counter = 0;
							}
							if(buf[k] == boundary[0]){
								counter = 1;
								goto go_continue;
							}
							buf_file_write[i_buf_file_write++] = buf[k];
							if(i_buf_file_write == len_buf_file_write){
								i_buf_file_write = 0;
								if(!WriteFile(hFile_out, buf_file_write, len_buf_file_write, &lpNumberOfBytesWritten, NULL))f_file_write = false;
							}
						}else if(buf[k] == boundary[0]){
							counter = 1;
							goto go_continue;
						}
						
					}
				}
			}else{// анализируем заголовки
				if(f_find_empty_str){// ищем пустую строку
					if(buf[k] == c_CRLF[counter]){
						counter++;
						if(counter == len_CRLF){
							f_find_empty_str = false;
							counter = 0;
							f_data = true;// дальше данные
							i_data_out = 0;
						}
					}else{
						f_LF = true;
						counter = 0;
					}
				}else if(f_read_file_name){// записываем имя файла
					cz_file_name[counter] = buf[k];
					if(cz_file_name[counter] == '\"'){
						len_file_name = counter;
						cz_file_name[counter] = 0;
						f_read_file_name = false;
						// команда искать пустую строку.
						f_find_empty_str = true;
						f_LF = true;
						counter = 0;
					}else ++counter;
				}else if(buf[k] == c_CONTENT[counter]){
					// ищем Content-Disposition: form-data; name="m"; filename="
					++counter;
					if(f_message && counter == len_CONTENT_m){
						c_CONTENT[counter - 1] = 'f';
						counter = 0;
						// команда искать пустую строку.
						f_find_empty_str = true;
						f_LF = true;
						
					}else if(counter == len_CONTENT_f){// записать имя файла до "
						f_read_file_name = true;
						counter = 0;
					}
				}else{
					f_LF = true;
					counter = 0;
				}
				
			}
			
			go_continue:
			--ContentLength;// только тут уменьшаем ContentLength
		}
		go_exit:
		
		// Анализируем загаловки запроса.
		int id_file = 0;
		int j = 4;
		if(buf_len_out > 4 && buf[j] == '/')while(++j < buf_len_out){
			if(buf[j] >= '0' && buf[j] <= '9'){
				id_file *= 10;
				id_file += buf[j] - 48;
			}else break;
		}
		
		if((j == 5 && buf[j] == ' ') || f_POST){
			// index
			
			if(f_index){
				
				char szFilePathIndex[] = "data\\index.html";
				HANDLE hFile = CreateFile(szFilePathIndex, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
				// формируем заголовок.
				DWORD dwFileSize = GetFileSize(hFile, NULL);
				if(dwFileSize == INVALID_FILE_SIZE){
					SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова GetFileSize");
					return 6;
				}
				SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
				std::string str_file_headers = "HTTP/1.0 200 OK\r\nServer: RX200\r\nContent-type: text/html\r\nContent-length: " + std::to_string(dwFileSize) + "\r\n\r\n";
				
				// Отправка заголовков
				rc = send(connect_socket, str_file_headers.c_str(), str_file_headers.length(), 0);
				if(rc == SOCKET_ERROR){
					SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send file headers");
					return 6;
				}
				// Отправка бинарных данных файла.
				
				if(!TransmitFile(connect_socket, hFile, dwFileSize, 0, NULL, NULL, TF_DISCONNECT)){
					// ПРИМЕЧАНИЕ Если приложению необходимо передать файл размером более 2 147 483 646 байт, то с каждым вызовом можно использовать несколько вызовов функции TransmitFile
					SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send file(TransmitFile)");
					return 6;
				}
				
				CloseHandle(hFile);
				
			}else{
				rc = send(connect_socket, str_response_index.c_str(), str_response_index.length(), 0);
				if(rc == SOCKET_ERROR){
					SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send index");
					return 6;
				}
			}
			
		}else if(j < buf_len_out && j > 5 && buf[j] == ' ' && id_file < counterFile){
			// flie
			
			// определяем путь к файлу
			int size_szFilePath = size_szFileDirectory + lengthNameFile;
			char szFilePath[size_szFilePath];
			int i = 0;
			for(; i < size_szFileDirectory; ++i){
				szFilePath[i] = szFileDirectory[i];
				if(szFileDirectory[i] == 0){
					szFilePath[i] = '\\';
					++i;
					break;
				}
			}
			for(j = 0; j < lengthNameFile && i < size_szFilePath; ++j, ++i){
				szFilePath[i] = fileNames[id_file][j];
				if(szFilePath[i] == 0)break;
			}
			
			HANDLE hFile = CreateFile(szFilePath, GENERIC_READ, FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
			// формируем заголовок.
			
			DWORD dwFileSize = GetFileSize(hFile, NULL);
			if(dwFileSize == INVALID_FILE_SIZE){
				SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова GetFileSize");
				return 6;
			}
			SetFilePointer(hFile, 0, NULL, FILE_BEGIN);
			std::string str_file_headers = "HTTP/1.0 200 OK\r\nServer: RX200\r\nContent-type: aplication/octet-stream\r\nContent-Disposition: attachment; filename=\"" + std::string(fileNames[id_file]) + "\"\r\nContent-length: " + std::to_string(dwFileSize) + "\r\n\r\n";
			
			// Отправка заголовков
			rc = send(connect_socket, str_file_headers.c_str(), str_file_headers.length(), 0);
			if(rc == SOCKET_ERROR){
				SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send file headers");
				return 6;
			}
			// Отправка бинарных данных файла.
			
			if(!TransmitFile(connect_socket, hFile, dwFileSize, 0, NULL, NULL, TF_DISCONNECT)){
				// ПРИМЕЧАНИЕ Если приложению необходимо передать файл размером более 2 147 483 646 байт, то с каждым вызовом можно использовать несколько вызовов функции TransmitFile
				SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send file(TransmitFile)");
				return 6;
			}
			
			CloseHandle(hFile);
			
		}else{
			// 404
			rc = send(connect_socket, cz_response_HTTP_404, sizeof(cz_response_HTTP_404), 0);
			if(rc == SOCKET_ERROR){
				SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова send 404");
				return 6;
			}
		}
		
		if(closesocket(connect_socket)){
			SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова close connect_socket");
			return 7;
		}
	}while(flags);
	
	if(closesocket(callback_socket)){
		SetDlgItemText(hMainWnd, ID_EDIT_ERROR, "Ошибка вызова close callback_socket");
		return 7;
	}
	WSACleanup();
	SetDlgItemText(hMainWnd, ID_EDIT_OUT, "Stop");
	return 0;
}
