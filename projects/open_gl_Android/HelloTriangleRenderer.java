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

public class HelloTriangleRenderer implements GLSurfaceView.Renderer
{
    private Context context;
    // Member variables
    private int mProgramObject;
    private int mWidth;
    private int mHeight;
    private FloatBuffer mVertices;

    private final float[] mVerticesData =
            { 0.0f, 0.5f, 0.0f, -0.5f, -0.5f, 0.0f, 0.5f, -0.5f, 0.0f };

    ///
    // Constructor
    //
    public HelloTriangleRenderer ( Context context )
    {
        this.context = context;
        mVertices = ByteBuffer.allocateDirect ( mVerticesData.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asFloatBuffer();
        mVertices.put ( mVerticesData ).position ( 0 );
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
        GLES30.glBindAttribLocation ( programObject, 0, "vPosition" );

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
        GLES30.glVertexAttribPointer ( 0, 3, GLES30.GL_FLOAT, false, 0, mVertices );
        GLES30.glEnableVertexAttribArray ( 0 );

        GLES30.glDrawArrays ( GLES30.GL_TRIANGLES, 0, 3 );
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
