package rx200.mapprototype;


public class MapImgs {
	public int hashSum = 0;
	public MapImg[] imgs;
	public MapImgs(int size, int hashSum){
		imgs = new MapImg[size];
		this.hashSum = hashSum;
	}
}
