// Методы по сути меняют систему счисления данных, достаточно быстрые для размеров данных до 4096 байт.
let base100Chars = String.fromCharCode(8,10,12,13);
for(let i = 32; i <= 127; i++)base100Chars += String.fromCharCode(i);
const base100cods = new Map(base100Chars.split("").map((char, i) => [char, i]));
const base_from = 256;
const base_to = base100Chars.length;
const charCod = 0xAB;
function toBase100(arrayBuffer){// max arrayBuffer size 3401 for 4096 byte VK storage
	let byteLength = arrayBuffer.byteLength + 1;
	let bufferUint8 = new Uint8Array(byteLength);
	bufferUint8.set(new Uint8Array(arrayBuffer), 1);
	bufferUint8[0] = 1;// переход 36-37 на 4097
	let arrBase100 = [];
	do{
		let n = 0;
		for (let i = 0; i < byteLength; i++){
			n = n * base_from + bufferUint8[i];
			bufferUint8[i] = n / base_to;
			n %= base_to;
		}
		arrBase100.push(base100Chars[n]);
	}while(bufferUint8.findLast(b => b > 0));
	return arrBase100.reverse().join("").replaceAll("\\t", String.fromCharCode(charCod));
}
function fromBase100(str){
	let codes = str.replaceAll(String.fromCharCode(charCod), "\\t").split("").map(char => base100cods.get(char));
	let codesLength = codes.length;
	let arrBase256 = [];
	do{
		let n = 0;
		for (let i = 0; i < codesLength; i++){
			n = n * base_to + codes[i];
			codes[i] = n / base_from | 0;
			n %= base_from;
		}
		arrBase256.push(n);
	}while(codes.findLast(b => b > 0));
	return new Uint8Array(arrBase256.reverse().slice(1)).buffer;
}