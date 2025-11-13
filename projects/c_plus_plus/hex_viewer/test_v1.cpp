#include <iostream>
#include <fstream>
#include <string>
#include <vector>

using std::string;
using std::vector;

int main(){
	
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
	
	
	unsigned char byte;
	for(string &str: path_files){
		std::ifstream ifile(str, std::ios::binary);
		if (ifile.is_open()){
			std::cout << std::endl << std::endl;
			while(ifile.read((char *)&byte, sizeof(char))){
				std::cout << byte << " ";
			}
			std::cout << std::endl << std::endl;
		}
		ifile.close();
	}
	
	std::cout << std::endl << "END" << std::endl;
	
	return 0;
}