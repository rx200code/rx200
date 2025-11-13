#include <iostream>
#include <cmath>


int main(){
	const int end_n1h = 24;
	const int end_n2v = 24;
	const int n1h = 13;
	const int n2v = 13;
	//double p = .05;
	double p_005 = -1.6448;
	double p_001 = -2.3263;
	double p_0005 = -2.5758;
	double p_0001 = -3.0902;
	double p_test = p_0001;
	int u1 = 1;
	int u2 = 380;
	int dilimiter = 21;
	
	std::cout << std::endl;
	std::cout << "n1 \\ n2 :";
	for(int n2 = n2v; n2 <= end_n2v; ++n2)std::cout << "  " << n2 << " |";
	std::cout << std::endl;
	std::cout << "____\\___|";
	for(int n2 = n2v; n2 <= end_n2v; ++n2)std::cout << "_____|";
	std::cout << std::endl;
	for(int n1 = n1h; n1 <= end_n1h; ++n1){
		if(n1 == dilimiter){
			/*
			std::cout << "_______||";
			for(int n2 = n2v; n2 <= end_n2v; ++n2)std::cout << "_____|";
			std::cout << std::endl;
			//*/
			std::cout << "=======||";
			for(int n2 = n2v; n2 <= end_n2v; ++n2)std::cout << "=====|";
			std::cout << std::endl;
		}
		std::cout << "n1: " << n1 << " ||";
		for(int n2 = n2v; n2 <= end_n2v; ++n2){
			if(n2 > n1){
				std::cout << "     |";
				continue;
			}
			double min_d = 100;
			int min_u = u1;
			for(int u = u1; u <= u2; ++u){
				double _u = (u - (double)(n1 * n2) / 2 + .5) / std::sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
				//std::cout << "U: " << u << " = " << _u << " = " << std::abs(-1.6448/*p_005*/ - _u) << std::endl;
				if(p_test < _u)continue;
				double temp_p = std::abs(p_test - _u);
				if(min_d > temp_p){
					min_d = temp_p;
					min_u = u;
				}
			}
			if(min_u < 100)std::cout << " ";
			std::cout << " " << min_u << " |";
		}
		std::cout << std::endl;
	}
	
	
	
	
	//double z_u = std::abs(u_obt - (n1 * n2 / 2)) / std::sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
	
	std::cout << "END" << std::endl;
	return 0;
}