package rx200.mapprototype;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;

// Класс статических методов и переменных для преобразования систем координат.
public class CRS {
	/// Переменные вывода функций.
	static double x, y, lat, lon, s, a, wmm_a = 0;
	/// Основные переменные.
	static final double wgs_84_a = 6378137;
	static final double _f = 298.257223563;
	static final double f = 1 / _f;
	static final double e_2 = 2 * f - Math.pow(f, 2);
	static final double b_div_a = Math.sqrt(1 - CRS.e_2);
	static final double r_1 = Math.PI / 180.0;
	static final double r_90 = Math.PI / 2;
	static final double r_360 = Math.PI * 2;
	static final double r_1_WM = r_1 * wgs_84_a;
	static final double width_WM_180_deg = Math.PI * wgs_84_a;
	// доп. Гауса.
	static final double[] g_R = new double[]{.0856622462, .1803807865, .2339569673, .2339569673, .1803807865, .0856622462};
	static final double[] g_ip = new double[]{.0337652429, .1693953068, .380690407, .619309593, .8306046932, .9662347571};
	/// Основные методы.
	static void rad_wgs_84_to_WM(double lat, double lon){// EPSG:1024 (lat, lon), (f, l), (широта, долгота) (y, x).
		double n = Math.tan(lat);
		x = (lon + Math.PI) * wgs_84_a;
		y = width_WM_180_deg - Math.log(n + Math.sqrt(n * n + 1)) * wgs_84_a;
	};
	static void deg_wgs_84_to_WM(double lat, double lon){
		//rad_wgs_84_to_WM(toRad(lat), toRad(lon));
		double n = Math.tan(lat * r_1);
		x = (lon + 180.0) * r_1_WM;
		y = width_WM_180_deg - Math.log(n + Math.sqrt(n * n + 1)) * wgs_84_a;
	};

	static void WM_to_wgs_84_rad(double x, double y){// EPSG:1024
		lat = r_90 - 2 * Math.atan(Math.pow(Math.E, ((y - width_WM_180_deg) / wgs_84_a)));
		lon = x / wgs_84_a - Math.PI;
	}
	static void WM_to_wgs_84_deg(double x, double y){// EPSG:1024
		lat = (r_90 - 2 * Math.atan(Math.pow(Math.E, ((y - width_WM_180_deg) / wgs_84_a)))) / r_1;
		lon = (x / wgs_84_a - Math.PI) / r_1;
	}
	/// Методы расчета дистанции.
	// Упрощённый вариант.

	//* Точный вариант
	// Функция расчета расстояния, формула Бесселя, решение обратной геодезической задачи. (Морозов "Курс сфероидической геодезии")
	// Версия для треков. Принимает координаты в системе WGS 84
	// Возвращает в метрах.
	static void get_dist(double lat_1, double lon_1, double lat_2, double lon_2){
		/* Переводим в радианы.
		lat_1 *= r_1;//c1[1];
		lon_1 *= r_1;//c1[0];
		lat_2 *= r_1;//c2[1];
		lon_2 *= r_1;//c2[0];
		//*/
		// Подготовительные переменные.

		double W_1 = Math.sqrt(1 - e_2 * Math.pow(Math.sin(lat_1), 2));
		double W_2 = Math.sqrt(1 - e_2 * Math.pow(Math.sin(lat_2), 2));
		double sin_u_1 = (Math.sin(lat_1) * b_div_a) / W_1;
		double sin_u_2 = (Math.sin(lat_2) * b_div_a) / W_2;
		double cos_u_1 = Math.cos(lat_1) / W_1;
		double cos_u_2 = Math.cos(lat_2) / W_2;
		double l = lon_2 - lon_1;
		double a_1 = sin_u_1 * sin_u_2;
		double a_2 = cos_u_1 * cos_u_2;
		double b_1 = cos_u_1 * sin_u_2;
		double b_2 = sin_u_1 * cos_u_2;
		// А
		double de = 0;
		double[] cos_2_u_i = new double[6];
		double si = 0, A_1 = 0, la;
		for(int i = 0; i < 5; i++){
			la = l + de;
			double p = cos_u_2 * Math.sin(la);
			double q = b_1 - b_2 * Math.cos(la);
			A_1 = Math.atan2(p, q);// Для правильной обрадтнке когда координаты равны, и q = 0 используется функция atan2 вместо Math.atan(p / q);
			if(A_1 < 0)A_1 += r_360;
			// Б
			double sin_si = p * Math.sin(A_1) + q * Math.cos(A_1);
			double cos_si = a_1 + a_2 * Math.cos(la);
			//si = Math.atan2(sin_si, cos_si);
			si = Math.abs(Math.atan(sin_si / cos_si));
			// В
			double E_la = 0;
			for(int j = 0; j < 6; j++){
				double ip_i_si = g_ip[j] * si;
				cos_2_u_i[j] = 1 - Math.pow((sin_u_1 * Math.cos(ip_i_si) + cos_u_1 * Math.cos(A_1) * Math.sin(ip_i_si)), 2);
				E_la += g_R[j] / (1 + Math.sqrt(1 - e_2 * cos_2_u_i[j]));
			}
			de = e_2 * si * cos_u_1 * Math.sin(A_1) * E_la;
		}
		double E_si = 0;
		for(int j = 0; j < 6; j++)E_si += g_R[j] * Math.sqrt(1 - e_2 * cos_2_u_i[j]);
		s = wgs_84_a * si * E_si;// s - дистанция
		a = A_1;// Азимут
		//let A_2 = Math.atan((cos_u_1 * Math.sin(la)) / (b_1 * Math.cos(la) - b_2));// Обратный азимут.
	}
	// Методы преобразования градусов, радианов.
	static double toRad(double deg){ return deg * r_1; }
	static double toDeg(double rad){ return rad / r_1; }

	/// wmm Коэффиценты 2020 - 2025 и данные.
	// Пример данных в массиве {g:-1450.7, h:4652.9, g_dot:7.7, h_dot:-25.1}
	static double get_wmm_time(){
		//int year = Calendar.getInstance(TimeZone.getTimeZone("GMT")).get(Calendar.YEAR);
		Calendar calendar = new GregorianCalendar(TimeZone.getTimeZone("GMT+00"));
		long current_time = calendar.getTimeInMillis();
		int year = calendar.get(Calendar.YEAR);
		calendar.set(year, 0, 0, 0, 0, 0);
		long date_year_1 = calendar.getTimeInMillis();
		calendar.set(year + 1, 0, 0, 0, 0, 0);
		long date_year_2 = calendar.getTimeInMillis();
		return (((double) year) + ((double) (current_time - date_year_1)) / ((double) (date_year_2 - date_year_1))) - 2020;// год 2020
	}
	static final double[][][] wmm_cof = new double[][][]{
			{{get_wmm_time()}},
			{{-29404.5, 0.0, 6.7, 0.0},{-1450.7, 4652.9, 7.7, -25.1}},
			{{-2500.0, 0.0, -11.5, 0.0},{2982.0, -2991.6, -7.1, -30.2},{1676.8, -734.8, -2.2, -23.9}},
			{{1363.9, 0.0, 2.8, 0.0},{-2381.0, -82.2, -6.2, 5.7},{1236.2, 241.8, 3.4, -1.0},{525.7, -542.9, -12.2, 1.1}},
			{{903.1, 0.0, -1.1, 0.0},{809.4, 282.0, -1.6, 0.2},{86.2, -158.4, -6.0, 6.9},{-309.4, 199.8, 5.4, 3.7},{47.9, -350.1, -5.5, -5.6}},
			{{-234.4, 0.0, -0.3, 0.0},{363.1, 47.7, 0.6, 0.1},{187.8, 208.4, -0.7, 2.5},{-140.7, -121.3, 0.1, -0.9},{-151.2, 32.2, 1.2, 3.0},{13.7, 99.1, 1.0, 0.5}},
			{{65.9, 0.0, -0.6, 0.0},{65.6, -19.1, -0.4, 0.1},{73.0, 25.0, 0.5, -1.8},{-121.5, 52.7, 1.4, -1.4},{-36.2, -64.4, -1.4, 0.9},{13.5, 9.0, -0.0, 0.1},{-64.7, 68.1, 0.8, 1.0}},
			{{80.6, 0.0, -0.1, 0.0},{-76.8, -51.4, -0.3, 0.5},{-8.3, -16.8, -0.1, 0.6},{56.5, 2.3, 0.7, -0.7},{15.8, 23.5, 0.2, -0.2},{6.4, -2.2, -0.5, -1.2},{-7.2, -27.2, -0.8, 0.2},{9.8, -1.9, 1.0, 0.3}},
			{{23.6, 0.0, -0.1, 0.0},{9.8, 8.4, 0.1, -0.3},{-17.5, -15.3, -0.1, 0.7},{-0.4, 12.8, 0.5, -0.2},{-21.1, -11.8, -0.1, 0.5},{15.3, 14.9, 0.4, -0.3},{13.7, 3.6, 0.5, -0.5},{-16.5, -6.9, 0.0, 0.4},{-0.3, 2.8, 0.4, 0.1}},
			{{5.0, 0.0, -0.1, 0.0},{8.2, -23.3, -0.2, -0.3},{2.9, 11.1, -0.0, 0.2},{-1.4, 9.8, 0.4, -0.4},{-1.1, -5.1, -0.3, 0.4},{-13.3, -6.2, -0.0, 0.1},{1.1, 7.8, 0.3, -0.0},{8.9, 0.4, -0.0, -0.2},{-9.3, -1.5, -0.0, 0.5},{-11.9, 9.7, -0.4, 0.2}},
			{{-1.9, 0.0, 0.0, 0.0},{-6.2, 3.4, -0.0, -0.0},{-0.1, -0.2, -0.0, 0.1},{1.7, 3.5, 0.2, -0.3},{-0.9, 4.8, -0.1, 0.1},{0.6, -8.6, -0.2, -0.2},{-0.9, -0.1, -0.0, 0.1},{1.9, -4.2, -0.1, -0.0},{1.4, -3.4, -0.2, -0.1},{-2.4, -0.1, -0.1, 0.2},{-3.9, -8.8, -0.0, -0.0}},
			{{3.0, 0.0, -0.0, 0.0},{-1.4, -0.0, -0.1, -0.0},{-2.5, 2.6, -0.0, 0.1},{2.4, -0.5, 0.0, 0.0},{-0.9, -0.4, -0.0, 0.2},{0.3, 0.6, -0.1, -0.0},{-0.7, -0.2, 0.0, 0.0},{-0.1, -1.7, -0.0, 0.1},{1.4, -1.6, -0.1, -0.0},{-0.6, -3.0, -0.1, -0.1},{0.2, -2.0, -0.1, 0.0},{3.1, -2.6, -0.1, -0.0}},
			{{-2.0, 0.0, 0.0, 0.0},{-0.1, -1.2, -0.0, -0.0},{0.5, 0.5, -0.0, 0.0},{1.3, 1.3, 0.0, -0.1},{-1.2, -1.8, -0.0, 0.1},{0.7, 0.1, -0.0, -0.0},{0.3, 0.7, 0.0, 0.0},{0.5, -0.1, -0.0, -0.0},{-0.2, 0.6, 0.0, 0.1},{-0.5, 0.2, -0.0, -0.0},{0.1, -0.9, -0.0, -0.0},{-1.1, -0.0, -0.0, 0.0},{-0.3, 0.5, -0.1, -0.1}}
	};
	static final double geomagnetic_a = 6371200;


	//let wmm_A = crs.ell.wgs_84.a;// wgs_84_a
	//let wmm_e_2 = crs.ell.wgs_84.e_2;// e_2
	/// wmm функции.
	static double factorial(int n){
		double result = 1;
		while(n > 0)result *= n--;
		return result;
	}
	static double f_g(int n, int m){return wmm_cof[n][m][0] + wmm_cof[0][0][0] * wmm_cof[n][m][2];}
	static double f_h(int n, int m){return wmm_cof[n][m][1] + wmm_cof[0][0][0] * wmm_cof[n][m][3];}
	static double f_p_n_m_2(int n, int m, double u){// Формула из  Heiskanen and Moritz, 1967 НО не та что в докумментации к wmm указана а (1 - 62) которая как указано у Heiskanen and Moritz более пригодна для программирования.
		double sum_k_r = 0;
		double r_2 = ((double) (n - m)) / 2;
		for(int k = 0; k <= r_2; k++)sum_k_r += Math.pow(-1, k) * (factorial(2 * n - 2 * k) / (factorial(k) * factorial(n - k) * factorial(n - m - 2 * k))) * Math.pow(u, n - m - 2 * k);
		return Math.pow(2, -n) * Math.pow((1 - Math.pow(u, 2)), ((double) m) / 2) * sum_k_r;
	}
	static double f_p_n_m(int n, int m, double u){
		double out_p;
		if(m == 0)out_p = f_p_n_m_2(n, m, u);
		else out_p = Math.sqrt(2 * (factorial(n - m) / factorial(n + m))) * f_p_n_m_2(n, m, u);
		return out_p;
	}
	static double f_x_prime(double lambda, double fi_prime, double r){
		double sum_n = 0;
		for(int n = 1; n <= 12; n++){
			double sum_m = 0;
			for(int m = 0; m <= n; m++)sum_m += (f_g(n, m) * Math.cos(m * lambda) + f_h(n, m) * Math.sin(m * lambda)) * ((n + 1) * Math.tan(fi_prime) * f_p_n_m(n, m, Math.sin(fi_prime)) - Math.sqrt(Math.pow(n + 1, 2) - Math.pow(m, 2)) * (1 / Math.cos(fi_prime)) * f_p_n_m(n + 1, m, Math.sin(fi_prime)));// доделать. с производной.
			sum_n += Math.pow(geomagnetic_a / r, n + 2) * sum_m;
		}
		return -sum_n;
	}
	static double f_y_prime(double lambda, double fi_prime, double r){
		double sum_n = 0;
		for(int n = 1; n <= 12; n++){
			double sum_m = 0;
			for(int m = 0; m <= n; m++)sum_m += m * (f_g(n, m) * Math.sin(m * lambda) - f_h(n, m) * Math.cos(m * lambda)) * f_p_n_m(n, m, Math.sin(fi_prime));
			sum_n += Math.pow(geomagnetic_a / r, n + 2) * sum_m;
		}
		return (1 / Math.cos(fi_prime)) * sum_n;
	}
	static double f_z_prime(double lambda, double fi_prime, double r){
		double sum_n = 0;
		for(int n = 1; n <= 12; n++){
			double sum_m = 0;
			for(int m = 0; m <= n; m++)sum_m += (f_g(n, m) * Math.cos(m * lambda) + f_h(n, m) * Math.sin(m * lambda)) * f_p_n_m(n, m, Math.sin(fi_prime));
			sum_n += (n + 1) * Math.pow(geomagnetic_a / r, n + 2) * sum_m;
		}
		return -sum_n;
	}
	static void compass_angle(double lat, double lon){// Возвращает магнитное склонение в радианах. lon c[0] lat c[1]
		//double h = 0;// Судя по всему высота.
		double R_c = wgs_84_a / Math.sqrt(1 - e_2 * Math.pow(Math.sin(lat), 2));
		//double p = (R_c + h) * Math.cos(lat);
		//double z = (R_c * (1 - e_2) + h) * Math.sin(lat);
		double p = R_c * Math.cos(lat);
		double z = R_c * (1 - e_2) * Math.sin(lat);
		double r = Math.sqrt(Math.pow(p, 2) + Math.pow(z, 2));
		double fi_prime = Math.asin(z / r);
		double x_big = f_x_prime(lon, fi_prime, r) * Math.cos(fi_prime - lat) - f_z_prime(lon, fi_prime, r) * Math.sin(fi_prime - lat);
		double y_big = f_y_prime(lon, fi_prime, r);
		wmm_a = Math.atan2(y_big, x_big);
	}
}
