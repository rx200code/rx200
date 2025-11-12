package rx200.open_gl;


import static android.opengl.GLES20.GL_COLOR_BUFFER_BIT;
import static android.opengl.GLES20.glClear;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import android.content.Context;
import android.opengl.GLES30;
import android.opengl.GLSurfaceView;
import android.opengl.Matrix;
import android.util.Log;

public class Test_01 implements GLSurfaceView.Renderer
{
    private Context context;
    // Member variables
    private int idProg;
    private int width;
    private int height;
    private FloatBuffer bufferShape;

    private int uMatrixLocation;
    private float[] mProjectionMatrix = new float[16];


    private float[] arr_color = new float[]{1.0f, 1.0f, 1.0f, 1.0f};
    private int id_color;

    private int i_points = 10000;
    private float[] coor_point;

    private int[] buf_name = new int[2];



    public Test_01 ( Context context )
    {
        this.context = context;

        coor_point = new float[i_points * 2];
        double m = 1;
        for(int i = 0; i < coor_point.length; i++){
            coor_point[i] = (float) (Math.random() * 2 - 1);
        }


        bufferShape = ByteBuffer.allocateDirect ( coor_point.length * 4 )
                .order ( ByteOrder.nativeOrder() ).asFloatBuffer();
        bufferShape.put ( coor_point ).position ( 0 );

        G.out ("Test_01:");
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
            G.out(GLES30.glGetShaderInfoLog ( shader ) );
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


        String vShaderStr = FileUtils.readTextFromRaw(context, R.raw.vertex_01);

        String fShaderStr = FileUtils.readTextFromRaw(context, R.raw.fragment_01);

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

        // TEST Создаём обратную связь, через переменную outPosition.
        String[] varyings = new String[]{"outPosition"};
        GLES30.glTransformFeedbackVaryings(programObject, varyings, GLES30.GL_INTERLEAVED_ATTRIBS);

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

        GLES30.glClearColor ( 0.0f, 0.0f, 0.0f, 0.0f );

        GLES30.glUseProgram ( idProg );

        id_color = GLES30.glGetUniformLocation(programObject, "a_color");

        uMatrixLocation = GLES30.glGetUniformLocation(programObject, "u_Matrix");

        // Сообщаем компелятнору что нам больше не придется компелировать шейдеры и можно освободить память.
        //GLES30.glReleaseShaderCompiler();






        // TEST
        G.out("onSurfaceCreated");
        // Запрашиваем два имени int для буферов.
        GLES30.glGenBuffers(2, buf_name, 0);
        // привязываем буфер к обратной связи.
        GLES30.glBindBuffer(GLES30.GL_TRANSFORM_FEEDBACK_BUFFER, buf_name[0]);
        // выделяем место для буфера.
        GLES30.glBufferData(GLES30.GL_TRANSFORM_FEEDBACK_BUFFER, coor_point.length * 4, null, GLES30.GL_DYNAMIC_COPY);

        // привязываем буфер к вершинному буферу для вывода вершин.
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, buf_name[1]);
        // выделяем место и заполняем буфер вершин.
        GLES30.glBufferData(GLES30.GL_ARRAY_BUFFER, coor_point.length * 4, bufferShape, GLES30.GL_DYNAMIC_COPY);


        int[] params = new int[1];
        GLES30.glGetBufferParameteriv(GLES30.GL_ARRAY_BUFFER, GLES30.GL_BUFFER_SIZE, params, 0);
        G.out ("GL_BUFFER_SIZE: "+params[0]);
        GLES30.glGetBufferParameteriv(GLES30.GL_ARRAY_BUFFER, GLES30.GL_BUFFER_USAGE, params, 0);
        G.out ("GL_BUFFER_USAGE: "+params[0]);

    }

    // /
    // Draw a triangle using the shader pair created in onSurfaceCreated()
    //
    private int count = 0;
    public void onDrawFrame ( GL10 glUnused )
    {
        // Меняем буфера местами, вершинный и обратной связи.
        //GLES30.glBindBuffer(GLES30.GL_TRANSFORM_FEEDBACK_BUFFER, buf_name[count]);
        GLES30.glBindBufferBase (GLES30.GL_TRANSFORM_FEEDBACK_BUFFER, 0, buf_name[count]);
        GLES30.glBindBuffer(GLES30.GL_ARRAY_BUFFER, buf_name[count ^= 1]);


        GLES30.glClear(GL_COLOR_BUFFER_BIT);


        GLES30.glVertexAttribPointer ( 1, 2, GLES30.GL_FLOAT, false, 0, 0 );
        GLES30.glEnableVertexAttribArray ( 1 );
        GLES30.glUniform4fv(id_color, 1, arr_color, 0);
        //GLES30.glUniform4f(id_color, 1.0f, 1.0f, 1.0f, 1.0f);


        GLES30.glBeginTransformFeedback(GLES30.GL_POINTS);
            GLES30.glDrawArrays(GLES30.GL_POINTS, 0, i_points);
        GLES30.glEndTransformFeedback();



    }

    // /
    // Handle surface changes
    //
    @Override // добавленно мной явное указание на переопределение метода
    public void onSurfaceChanged ( GL10 glUnused, int width, int height )
    {
        this.width = width;
        this.height = height;

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
        GLES30.glUniformMatrix4fv(uMatrixLocation, 1, false, mProjectionMatrix, 0);

        G.out ( "onSurfaceChanged: w "+this.width+", h "+this.height);

    }

}
