package rx200.open_gl;


import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.content.Context;
import android.opengl.GLES30;
import android.opengl.GLSurfaceView;
import android.util.Log;

public class TestLine implements GLSurfaceView.Renderer
{
    private Context context;
    // Member variables
    private int mProgramObject;
    private int mWidth;
    private int mHeight;
    private FloatBuffer mVertices;

    private final float[] mVerticesData =
            { 0.0f, 0.5f, 0.0f, -0.5f, -0.5f, 0.0f, 0.5f, -0.5f, 0.0f };

    // Test
    private int i_lines = 40;
    //private FloatBuffer mColor;
    private float[][] arr_color = new float[i_lines][4];
    private int id_color;

    ///
    // Constructor
    //
    public TestLine ( Context context )
    {
        this.context = context;

        // TEST Lines

        float[] vertices = new float[i_lines * 2 * 4];
        //float[] arr_color = new float[i_lines * 4];

        double v_min = 10;
        double v_max = 1;
        double v_size_r, a, x, y;

        double[] l_start_end = new double[4];

        double width = 480 / 2;

        double m = 1;
        for(int i = 0; i < vertices.length; i += 8){

            for(int j = 0; j < l_start_end.length; j++){
                l_start_end[j] = Math.random() * 2 * m - m;
            }

            v_size_r = (Math.random() * (v_max - v_min) + v_min) / 2 / width;
            a = Math.atan2(l_start_end[2] - l_start_end[0], l_start_end[1] - l_start_end[3]) + Math.PI / 2;

            x = Math.sin(a) * v_size_r;
            y = Math.cos(a) * v_size_r;

            /*
            vertices[i] = (float) (l_start_end[0] - x);
            vertices[i + 1] = (float) (l_start_end[1] + y);

            vertices[i + 2] = (float) (l_start_end[0] + x);
            vertices[i + 3] = (float) (l_start_end[1] - y);

            vertices[i + 4] = (float) (l_start_end[2] - x);
            vertices[i + 5] = (float) (l_start_end[3] + y);

            vertices[i + 6] = (float) (l_start_end[2] + x);
            vertices[i + 7] = (float) (l_start_end[3] - y);
            //*/

            vertices[i] = (float) (l_start_end[0] + x);
            vertices[i + 1] = (float) (l_start_end[1] - y);

            vertices[i + 2] = (float) (l_start_end[0] - x);
            vertices[i + 3] = (float) (l_start_end[1] + y);

            vertices[i + 4] = (float) (l_start_end[2] + x);
            vertices[i + 5] = (float) (l_start_end[3] - y);

            vertices[i + 6] = (float) (l_start_end[2] - x);
            vertices[i + 7] = (float) (l_start_end[3] + y);


            /*
            for(int j = 0; j < l_start_end.length; j++){
                l_start_end[j] = (l_start_end[j] + 1) * width;
            }
            //*/
            //Log.d ( G.TAG, "vertices "+(i / 8)+": x1 = "+(l_start_end[0])+", y1 = "+(l_start_end[1])+", x2 = "+(l_start_end[2])+", y2 = "+(l_start_end[3]));

        }
        for(int i = 0; i < i_lines; i++){
            arr_color[i][0] = (float) Math.random();
            arr_color[i][1] = (float) Math.random();
            arr_color[i][2] = (float) Math.random();
            arr_color[i][3] = 1.0f;
        }

        mVertices = ByteBuffer.allocateDirect ( vertices.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asFloatBuffer();
        mVertices.put ( vertices ).position ( 0 );

        /*
        mColor = ByteBuffer.allocateDirect ( arr_color.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asFloatBuffer();
        mColor.put ( arr_color ).position ( 0 );
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


        String vShaderStr = FileUtils.readTextFromRaw(context, R.raw.vertex_shader);

        String fShaderStr = FileUtils.readTextFromRaw(context, R.raw.fragment_shader);

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
        mProgramObject = programObject;

        GLES30.glClearColor ( 1.0f, 1.0f, 0.0f, 0.0f );

        GLES30.glUseProgram ( mProgramObject );

        // Сообщаем компелятнору что нам больше не придется компелировать шейдеры и можно освободить память.
        //GLES30.glReleaseShaderCompiler();


        // TEST COLOR
        id_color = GLES30.glGetUniformLocation(mProgramObject, "a_color");
        Log.d ( G.TAG, "id_color: "+id_color);

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
        GLES30.glEnable(GLES30.GL_CULL_FACE);// GLES30.glDisable(GLES30.GL_CULL_FACE);
        //GLES30.glFrontFace(GLES30.GL_CCW);// GLES30.GL_CW;
        //GLES30.glCullFace(GLES30.GL_BACK);// GLES30.GL_FRONT; GLES30.GL_FRONT_AND_BACK;
        // Смещение полигонов
        //GLES30.glEnable(GLES30.GL_POLYGON_OFFSET_FILL);
        //GLES30.glPolygonOffset(-1.0f, -2.0f);//(poligonOffsetFactor, poligonOffsetUnits)
    }

    // /
    // Draw a triangle using the shader pair created in onSurfaceCreated()
    //
    public void onDrawFrame ( GL10 glUnused )
    {
        // Set the viewport

        //GLES30.glViewport ( 0, 0, mWidth, mHeight );// Перенесено в onSurfaceChanged

        // Clear the color buffer
        GLES30.glClear ( GLES30.GL_COLOR_BUFFER_BIT );

        // Use the program object
        //GLES30.glUseProgram ( mProgramObject );// Перенесено в onSurfaceCreated

        // Load the vertex data
        //GLES30.glVertexAttribPointer ( 0, 4, GLES30.GL_FLOAT, false, 16, mColor );
        //GLES30.glEnableVertexAttribArray ( 0 );




        GLES30.glVertexAttribPointer ( 1, 2, GLES30.GL_FLOAT, false, 8, mVertices );
        GLES30.glEnableVertexAttribArray ( 1 );

        for(int i = 0; i < i_lines; i++ ) {
            GLES30.glUniform4fv(id_color, 1, arr_color[i], 0);
            //GLES30.glVertexAttrib4fv(0, arr_color[i], 0);
            //GLES30.glEnableVertexAttribArray ( 0);
            //GLES30.glDisableVertexAttribArray ( 0);
            //GLES30.glEnableVertexAttribArray ( 1 );
            GLES30.glDrawArrays(GLES30.GL_TRIANGLE_STRIP, i * 4, 4);
            //GLES30.glDisableVertexAttribArray ( 1);

        }
        //GLES30.glDisableVertexAttribArray ( 1);
    }

    // /
    // Handle surface changes
    //
    @Override // добавленно мной явное указание на переопределение метода
    public void onSurfaceChanged ( GL10 glUnused, int width, int height )
    {
        //mWidth = width;
        //mHeight = height;

        if (width > height) {
            mHeight = mWidth = height;
        } else {
            mHeight = mWidth = width;
        }

        Log.d ( G.TAG, "onSurfaceChanged: "+mWidth );

        GLES30.glViewport ( 0, 0, mWidth, mHeight );
    }
    /*
    private void bindMatrix(int width, int height) {
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
        glUniformMatrix4fv(uMatrixLocation, 1, false, mProjectionMatrix, 0);
    }//*/


}
