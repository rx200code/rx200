#include <Windows.h>
#include <iostream>
#include <fstream>
//#include <iomanip>
#include <string>
#include <vector>
#include <cstdio>

using std::string;
using std::vector;

HANDLE hConsole;

int main(){
	
	hConsole = GetStdHandle(STD_OUTPUT_HANDLE);
	
	string path = "options.ini";
	vector <string> path_files;
	
	string line;
	std::ifstream in(path);
	if (in.is_open()){
		while (std::getline(in, line)){
			if(!line.empty())path_files.push_back(line);
		}
	}
	in.close();
	
	std::cout << path << std::endl;
	
	for(string &str: path_files)std::cout << str << std::endl;
	
	
	//unsigned char byte;
	for(string &str: path_files){
		std::ifstream ifile(str, std::ifstream::binary);
		
		ifile.seekg(0, ifile.end);
		int size_file = ifile.tellg();
		ifile.seekg(0, ifile.beg);
		
		//char * buffer = new char[size_file];
		//ifile.read(buffer, size_file);
		
		unsigned char buffer[size_file];
		ifile.read((char*)( &buffer[0]), size_file);
		
		std::cout << std::endl << "size_file = " << size_file << std::endl;
		
		//system("color 20");// от 00 до FF первая цифра фон, вторая текст.
		
		
		SetConsoleTextAttribute(hConsole, 3);
		//*
		for(int i = 0; i < size_file; ++i){
			//std::cout << static_cast<unsigned short>(buffer[i]) << " ";
			//std::cout << (int)buffer[i] << " ";
			//std::cout << std::setw(2) << std::setfill('0') << std::hex << (int)buffer[i] << " ";
			//std::cout << std::hex << (int)buffer[i] << " ";
			if(i % 8 == 0)printf("\n%04X | ", i);
			printf("%02X ", buffer[i]);
			//std::cout << buffer[i] << " ";
		}//*/
		SetConsoleTextAttribute(hConsole, 0x07);
		
		
		ifile.close();
	}
	
	std::cout << std::endl << "END" << std::endl;
	//system("pause");
	return 0;
}