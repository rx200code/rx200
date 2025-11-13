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
	
	
	std::ifstream ifile_1(path_files[1], std::ifstream::binary);
	std::ifstream ifile_2(path_files[2], std::ifstream::binary);
	ifile_1.seekg(0, ifile_1.end);
	ifile_2.seekg(0, ifile_2.end);
	int size_file_1 = ifile_1.tellg();
	int size_file_2 = ifile_2.tellg();
	ifile_1.seekg(0, ifile_1.beg);
	ifile_2.seekg(0, ifile_2.beg);
	
	unsigned char buffer_1[size_file_1];
	unsigned char buffer_2[size_file_2];
	ifile_1.read((char*)( &buffer_1[0]), size_file_1);
	ifile_2.read((char*)( &buffer_2[0]), size_file_2);
	
	
	//*
	bool flag;
	for(int i = 0; i < size_file_1 || i < size_file_2; ++i){
		
		if(i % 8 == 0){
			SetConsoleTextAttribute(hConsole, 0xf);
			printf("\n%04X | ", i);
		}
		
		
		flag = i < size_file_1 && i < size_file_2 && buffer_1[i] == buffer_2[i];
		
		if(flag)SetConsoleTextAttribute(hConsole, 0x3);
		else SetConsoleTextAttribute(hConsole, 0x4);
		
		//if(i < size_file_1 && i < size_file_2 && (buffer_1[i] - buffer_2[i] == 36 || buffer_2[i] - buffer_1[i] == 36))SetConsoleTextAttribute(hConsole, 0xf);
		
		if(i < size_file_1){
			printf("%02X |", buffer_1[i]);
		}else printf("   |");
		
		if(flag)SetConsoleTextAttribute(hConsole, 0x2);
		else SetConsoleTextAttribute(hConsole, 0x5);
		
		if(i < size_file_2)printf(" %02X | ", buffer_2[i]);
		else printf("    | ");
		//std::cout << buffer[i] << " ";
	}//*/
	SetConsoleTextAttribute(hConsole, 0x7);
	
	
	ifile_1.close();
	ifile_2.close();
	
	
	std::cout << std::endl << "END" << std::endl;
	//system("pause");
	return 0;
}