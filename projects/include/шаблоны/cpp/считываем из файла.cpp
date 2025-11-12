#include <iostream>

int main(){
	// Читаем из файла. В данном случае текст, но как бинарный файл.
	FILE *f = fopen("data/data.json", "rb");// Открываем файл, для чтения как бинарный.
	if (f == NULL) {// Если файл открыть не удалось.
		std::cout << "ERROR: open file \"data/data.json\"" << std::endl;// Сообщение об ошибки.
	} else {
		size_t size;// Размер считанного за раз.
		char buf_txt[101];// Буфер куда считываем.
		buf_txt[100] = '\0';// Конец строки.
		void *ptr = buf_txt;// Указатель на буфер.
		while((size = fread(ptr, 1, 100, f)) == 100)std::cout << buf_txt;// Считываем, кратно буферу и выводем как текст.
		buf_txt[size] = '\0';// устанавливаем в буфер конец строки, там до куда считали.
		std::cout << buf_txt << std::endl;// Выводим из буыера до куда считали.
		fclose(f);// Закрываем файл.
	}
	return 0;
}