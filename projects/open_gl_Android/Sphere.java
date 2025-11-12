package rx200.open_gl;

public class Sphere {
    final static float X = .525731112119133606f;
    final static float Z = .850650808352039932f;

    final static float[] shape = new float[]{
        -X,   0.0f,  Z,
         X,   0.0f,  Z,
        -X,   0.0f, -Z,
         X,   0.0f, -Z,
        0.0f,  Z,    X,
        0.0f,  Z,   -X,
        0.0f, -Z,    X,
        0.0f, -Z,   -X,
         Z,    X,   0.0f,
        -Z,    X,   0.0f,
         Z,   -X,   0.0f,
        -Z,   -X,   0.0f
    };
    final static int[] ids = new int[]{//indexes
        0,4,1,  0,9,4,  9,5,4,  4,5,8,  4,8,1,
        8,10,1, 8,3,10, 5,3,8,  5,2,3,  2,7,3,
        7,10,3, 7,6,10, 7,11,6, 11,0,6, 0,1,6,
        6,1,10, 9,0,11, 9,11,2, 9,2,5,  7,2,11
    };
    // Другая основа.
    final static float[] shape_2 = new float[]{
            -1.0f, 0.0f, 0.0f,
            0.0f, 0.0f, -1.0f,
            1.0f, 0.0f, 0.0f,
            0.0f, 0.0f, 1.0f,
            0.0f, 1.0f, 0.0f,
            0.0f, -1.0f, 0.0f
    };
    final static int[] ids_2 = new int[]{//indexes
            0,1,4,  1,2,4,  2,3,4,  3,0,4,
            1,0,5,  2,1,5,  3,2,5,  0,3,5
    };

    //private int iVertexs = 12;
    private int iVertexs = 6;// 2
    //private int iEdges = 30;
    private int iEdges = 12;// 2
    //private int iFaces = 20;
    private int iFaces = 8;// 2

    private float[] vertexs;
    private int[] indices;

    public Sphere(){
        vertexs = shape_2;
        indices = ids_2;

        int depth = 4;
        G.out("depth "+depth);
        for(int i = 0; i < depth; i++){
            addDepth();
        }
    }
    private void addDepth(){
        float[] newShape = new float[vertexs.length + iEdges * 3];
        int[] newIndexes = new int[indices.length * 4];
        int i_index = 0;
        int i = 0;
        for(; i < vertexs.length; i++)newShape[i] = vertexs[i];
        //for(int i = 0; i < vertexs.length; i++)newShape[i] = vertexs[i];
        //for(int i = vertexs.length, j = 0; i < newShape.length; j += 3){
        for(int j = 0; j < indices.length; j += 3){
            // Берём первый триугольник.
            float x1 = vertexs[indices[j] * 3];
            float y1 = vertexs[indices[j] * 3 + 1];
            float z1 = vertexs[indices[j] * 3 + 2];

            float x2 = vertexs[indices[j + 1] * 3];
            float y2 = vertexs[indices[j + 1] * 3 + 1];
            float z2 = vertexs[indices[j + 1] * 3 + 2];

            float x3 = vertexs[indices[j + 2] * 3];
            float y3 = vertexs[indices[j + 2] * 3 + 1];
            float z3 = vertexs[indices[j + 2] * 3 + 2];

            // Находим новые вершины.
            float x1n = (x1 + x2) / 2;
            float y1n = (y1 + y2) / 2;
            float z1n = (z1 + z2) / 2;

            float x2n = (x2 + x3) / 2;
            float y2n = (y2 + y3) / 2;
            float z2n = (z2 + z3) / 2;

            float x3n = (x3 + x1) / 2;
            float y3n = (y3 + y1) / 2;
            float z3n = (z3 + z1) / 2;

            // Если вершины нет добавляем, и записываем индекс.
            // Если есть записываем индекс.
            int i1, i2, i3;
            int k;
            for(k = vertexs.length; k < i; k += 3)if(x1n == newShape[k] && y1n == newShape[k + 1] && z1n == newShape[k + 2])break;
            if(k == i){
                newShape[k] = x1n;
                newShape[k + 1] = y1n;
                newShape[k + 2] = z1n;
                i += 3;
            }
            i1 = k / 3;

            for(k = vertexs.length; k < i; k += 3)if(x2n == newShape[k] && y2n == newShape[k + 1] && z2n == newShape[k + 2])break;
            if(k == i){
                newShape[k] = x2n;
                newShape[k + 1] = y2n;
                newShape[k + 2] = z2n;
                i += 3;
            }
            i2 = k / 3;

            for(k = vertexs.length; k < i; k += 3)if(x3n == newShape[k] && y3n == newShape[k + 1] && z3n == newShape[k + 2])break;
            if(k == i){
                newShape[k] = x3n;
                newShape[k + 1] = y3n;
                newShape[k + 2] = z3n;
                i += 3;
            }
            i3 = k / 3;

            // добавляем индексы четырёх треугольников.
            newIndexes[i_index++] = indices[j];
            newIndexes[i_index++] = i1;
            newIndexes[i_index++] = i3;

            newIndexes[i_index++] = indices[j + 1];
            newIndexes[i_index++] = i2;
            newIndexes[i_index++] = i1;

            newIndexes[i_index++] = indices[j + 2];
            newIndexes[i_index++] = i3;
            newIndexes[i_index++] = i2;

            newIndexes[i_index++] = i1;
            newIndexes[i_index++] = i2;
            newIndexes[i_index++] = i3;
        }

        // отдаляем вершины на одинаковое расстояние от центра.
        /*
        i = vertexs.length;
        double x = (double) newShape[i];
        double y = (double) newShape[i + 1];
        double z = (double) newShape[i + 2];
        float kof = (float) (1 / Math.sqrt(x * x + y * y + z * z));
        for(; i < newShape.length; i++)newShape[i] *= kof;
        // 1 */
        //*
        for(i = vertexs.length; i < newShape.length;){
            double x = (double) newShape[i];
            double y = (double) newShape[i + 1];
            double z = (double) newShape[i + 2];
            float kof = (float) (1 / Math.sqrt(x * x + y * y + z * z));
            newShape[i++] *= kof;
            newShape[i++] *= kof;
            newShape[i++] *= kof;
        }
        // 2 */

        // Устанавливаем новые характеристики шара.
        this.iVertexs += iEdges;
        this.iEdges *= 4;
        this.iFaces *= 4;

        // Устанавливаем новые оснавные массивы.
        this.vertexs = newShape;
        this.indices = newIndexes;
    }
    public float[] getVertexs(){
        G.out("vertexs "+this.vertexs.length);
        //for(int i = 0; i < vertexs.length; i++)G.out("vertexs "+i+": "+this.vertexs[i]);
        return this.vertexs;
    }
    public int[] getIndices(){
        G.out("indices "+this.indices.length);
        //for(int i = 0; i < indices.length; i++)G.out("indices "+i+": "+this.indices[i]);
        return this.indices;
    }
}
