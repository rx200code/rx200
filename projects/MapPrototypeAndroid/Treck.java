package rx200.mapprototype;

import java.util.ArrayList;

public class Treck {
	public ArrayList<Node> nodes = new ArrayList<>();

	public void addNode(double x, double y, long time){
		nodes.add(new Node(x, y, time));
	}

	class Node{
		public double x, y;
		public long t;
		public Node(double x, double y, long time){
			this.x = x;
			this.y = y;
			t = time;
		}
	}
}
