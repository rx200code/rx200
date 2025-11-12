package rx200.open_gl;


import android.content.Context;
import android.opengl.GLES30;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.util.Log;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

public class TestSun implements GLSurfaceView.Renderer
{
    private Context context;
    // Member variables
    private int idProg;
    private int width;
    private int height;
    private FloatBuffer bufferShape;

    private int uMatrixLocation;
    private float[] mProjectionMatrix = new float[16];
    private float[] mViewMatrix = new float[16];
    private float[] mMatrix = new float[16];


    private float[] arr_color = new float[4];
    private int id_color;
    private int id_lightPos;

    private float[] coorShape;
    private int[] tindices;
    private IntBuffer bufferIndex;
    private void createSphere (){
        /*
        float X = .525731112119133606f;
        float Z = .850650808352039932f;

        coorShape = new float[]{
                -X, 0.0f, Z, X, 0.0f, Z, -X, 0.0f, -Z, X, 0.0f, -Z,
                0.0f, Z, X, 0.0f, Z, -X, 0.0f, -Z, X, 0.0f, -Z, -X,
                Z, X, 0.0f, -Z, X, 0.0f, Z, -X, 0.0f, -Z, -X, 0.0f
        };
        tindices = new int[]{
            0,4,1, 0,9,4, 9,5,4, 4,5,8, 4,8,1,
            8,10,1, 8,3,10, 5,3,8, 5,2,3, 2,7,3,
            7,10,3, 7,6,10, 7,11,6, 11,0,6, 0,1,6,
            6,1,10, 9,0,11, 9,11,2, 9,2,5, 7,2,11
        };
        //*/
        Sphere sphere = new Sphere();
        coorShape = sphere.getVertexs();
        tindices = sphere.getIndices();
    }

    public TestSun(Context context )
    {
        this.context = context;

        // Создаем вершины фигур. сфера квадрат конус.
        createSphere();

        arr_color[0] = (float) Math.random();
        arr_color[1] = (float) Math.random();
        arr_color[2] = (float) Math.random();
        arr_color[3] = 1.0f;

        //*
        bufferShape = ByteBuffer.allocateDirect ( coorShape.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asFloatBuffer();
        bufferShape.put ( coorShape ).position ( 0 );
        bufferIndex = ByteBuffer.allocateDirect ( tindices.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asIntBuffer();
        bufferIndex.put ( tindices ).position ( 0 );
        //*/
    }

    ///
    // Create a shader object, load the shader source, and
    // compile the shader.
    //
    private int LoadShader ( int type, String shaderSrc )
    {
        int shader;
        int[] compiled = new int[1];

        // Create the shader object
        // Создаем шейдер объеки
        shader = GLES30.glCreateShader ( type );

        if ( shader == GLES30.GL_FALSE )
        {
            return 0;
        }

        // Load the shader source
        // Загружаем объект шейдера
        GLES30.glShaderSource ( shader, shaderSrc );

        // Compile the shader
        // компилируем шейдер
        GLES30.glCompileShader ( shader );

        // Check the compile status
        // Смотрем результат компиляции шейдера, и выводим ошибки компиляции если есть
        GLES30.glGetShaderiv ( shader, GLES30.GL_COMPILE_STATUS, compiled, 0 );

        if ( compiled[0] != GLES30.GL_TRUE )
        {
            Log.e ( G.TAG, GLES30.glGetShaderInfoLog ( shader ) );
            GLES30.glDeleteShader ( shader );
            return 0;
        }

        return shader;
    }

    ///
    // Initialize the shader and program object
    //
    public void onSurfaceCreated ( GL10 glUnused, EGLConfig config )
    {


        String vShaderStr = FileUtils.readTextFromRaw(context, R.raw.v_sun);

        String fShaderStr = FileUtils.readTextFromRaw(context, R.raw.f_sun);

        int vertexShader;
        int fragmentShader;
        int programObject;
        int[] linked = new int[1];

        // Load the vertex/fragment shaders
        // создаем, загружаем компилируем шейдеры
        vertexShader = LoadShader ( GLES30.GL_VERTEX_SHADER, vShaderStr );
        fragmentShader = LoadShader ( GLES30.GL_FRAGMENT_SHADER, fShaderStr );

        // Create the program object
        // Создаем объект программы OpenGL
        programObject = GLES30.glCreateProgram();

        if ( programObject == 0 )
        {
            return;
        }

        // Прикрепляем шейдеры к программе OpenGL
        GLES30.glAttachShader ( programObject, vertexShader );
        GLES30.glAttachShader ( programObject, fragmentShader );

        // Bind vPosition to attribute 0
        // Привязываем атрибут шейдера vPosition к положению атрибута 0 который будет использован в onDrawFrame / GLES30.glVertexAttribPointer
        //GLES30.glBindAttribLocation ( programObject, 0, "vPosition" );

        // Link the program
        // собираем программу
        GLES30.glLinkProgram ( programObject );

        // Check the link status
        // проверяем программу на наличее ошибок
        GLES30.glGetProgramiv ( programObject, GLES30.GL_LINK_STATUS, linked, 0 );

        if ( linked[0] == 0 )
        {
            Log.e ( G.TAG, "Error linking program:" );
            Log.e ( G.TAG, GLES30.glGetProgramInfoLog ( programObject ) );
            GLES30.glDeleteProgram ( programObject );
            return;
        }

        // Store the program object
        idProg = programObject;

        GLES30.glClearColor ( 0.5f, 0.5f, 0.5f, 0.0f );

        GLES30.glUseProgram ( idProg );

        id_color = GLES30.glGetUniformLocation(programObject, "a_color");

        id_lightPos = GLES30.glGetUniformLocation(programObject, "lightPos");

        uMatrixLocation = GLES30.glGetUniformLocation(programObject, "u_Matrix");

        // Сообщаем компелятнору что нам больше не придется компелировать шейдеры и можно освободить память.
        //GLES30.glReleaseShaderCompiler();


        // TEST
        int[] params = new int[1];
        GLES30.glGetIntegerv(GLES30.GL_MAX_VERTEX_ATTRIBS, params, 0);
        Log.d ( G.TAG, "GL_MAX_VERTEX_ATTRIBS: "+params[0]);

        // TEST 2
        float[] params_w = new float[2];
        GLES30.glGetFloatv(GLES30.GL_ALIASED_LINE_WIDTH_RANGE, params_w, 0);
        Log.d ( G.TAG, "from: "+params_w[0]+" to: "+params_w[1]);

        // TEST 3
        float[] params_r = new float[2];
        GLES30.glGetFloatv(GLES30.GL_ALIASED_POINT_SIZE_RANGE, params_r, 0);
        Log.d ( G.TAG, "from: "+params_r[0]+" to: "+params_r[1]);

        // Отбрасывание.
        //GLES30.glEnable(GLES30.GL_CULL_FACE);// GLES30.glDisable(GLES30.GL_CULL_FACE);
        //GLES30.glFrontFace(GLES30.GL_CCW);// GLES30.GL_CW;
        //GLES30.glCullFace(GLES30.GL_BACK);// GLES30.GL_FRONT; GLES30.GL_FRONT_AND_BACK;
        // Смещение полигонов
        //GLES30.glEnable(GLES30.GL_POLYGON_OFFSET_FILL);
        //GLES30.glPolygonOffset(-1.0f, -2.0f);//(poligonOffsetFactor, poligonOffsetUnits)
        bindData();
    }
    private void bindData() {
        // координаты
        //*
        GLES30.glVertexAttribPointer ( 1, 3, GLES30.GL_FLOAT, false, 12, bufferShape );
        GLES30.glEnableVertexAttribArray ( 1 );
        //*/
        // нормали
        //*
        bufferShape.position(0);
        GLES30.glVertexAttribPointer ( 2, 3, GLES30.GL_FLOAT, false, 12, bufferShape );
        GLES30.glEnableVertexAttribArray ( 2 );
        //*/
    }

    // /
    // Draw a triangle using the shader pair created in onSurfaceCreated()
    //
    public void onDrawFrame ( GL10 glUnused )
    {
        // Set the viewport

        //GLES30.glViewport ( 0, 0, mWidth, mHeight );// Перенесено в onSurfaceChanged

        // Clear the color buffer
        GLES30.glClear ( GLES30.GL_COLOR_BUFFER_BIT | GLES30.GL_DEPTH_BUFFER_BIT );

        // Use the program object
        //GLES30.glUseProgram ( mProgramObject );// Перенесено в onSurfaceCreated

        // Load the vertex data
        //GLES30.glVertexAttribPointer ( 0, 4, GLES30.GL_FLOAT, false, 16, mColor );
        //GLES30.glEnableVertexAttribArray ( 0 );


        //GLES30.glVertexAttrib4fv(0, arr_color, 0);

        //GLES30.glDrawArrays(GLES30.GL_TRIANGLES, 0, 6 * 2 * 3);

        GLES30.glDrawElements(GLES30.GL_TRIANGLES, tindices.length, GLES30.GL_UNSIGNED_INT, bufferIndex);


        GLES30.glUniform4fv(id_color, 1, arr_color, 0);

        GLES30.glUniform3fv(id_lightPos, 1, new float[]{1.0f, 1.2f, 1.0f}, 0);




        /*
        for(int i = 0; i < i_lines; i++ ) {
            GLES30.glUniform4fv(id_color, 1, arr_color[i], 0);
            //GLES30.glVertexAttrib4fv(0, arr_color[i], 0);
            //GLES30.glEnableVertexAttribArray ( 0);
            //GLES30.glDisableVertexAttribArray ( 0);
            //GLES30.glEnableVertexAttribArray ( 1 );
            GLES30.glDrawArrays(GLES30.GL_TRIANGLE_STRIP, i * 4, 4);
            //GLES30.glDisableVertexAttribArray ( 1);

        }
        //*/

        //GLES30.glDisableVertexAttribArray ( 1);
    }

    // /
    // Handle surface changes
    //
    @Override // добавленно мной явное указание на переопределение метода
    public void onSurfaceChanged ( GL10 glUnused, int width, int height )
    {
        this.width = width;
        this.height = height;

        GLES30.glEnable(GLES30.GL_DEPTH_TEST);
        GLES30.glViewport(0, 0, width, height);

        float ratio = 1.0f;
        float left = -1.0f;
        float right = 1.0f;
        float bottom = -1.0f;
        float top = 1.0f;
        float near = 1.0f;
        float far = 8.0f;
        if (width > height) {
            ratio = (float) width / height;
            left *= ratio;
            right *= ratio;
        } else {
            ratio = (float) height / width;
            bottom *= ratio;
            top *= ratio;
        }

        Matrix.frustumM(mProjectionMatrix, 0, left, right, bottom, top, near, far);

        // точка положения камеры
        float eyeX = 0.9f;
        float eyeY = 1.5f;
        //float eyeZ = 1.5f;
        float eyeZ = 2.0f;// 2

        // точка направления камеры
        float centerX = 0;
        float centerY = 0;
        float centerZ = 0;

        // up-вектор
        float upX = 0;
        float upY = 1;
        float upZ = 0;

        Matrix.setLookAtM(mViewMatrix, 0, eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ);

        Matrix.multiplyMM(mMatrix, 0, mProjectionMatrix, 0, mViewMatrix, 0);

        GLES30.glUniformMatrix4fv(uMatrixLocation, 1, false, mMatrix, 0);


        //GLES30.glUniformMatrix4fv(uMatrixLocation, 1, false, mProjectionMatrix, 0);

        Log.d ( G.TAG, "onSurfaceChanged: "+this.width );
        //mWidth = width;
        //mHeight = height;
        /*
        if (width > height) {
            this.height = this.width = height;
        } else {
            this.height = this.width = width;
        }

        GLES30.glViewport ( 0, 0, this.width, this.height );
        //*/
    }

}
