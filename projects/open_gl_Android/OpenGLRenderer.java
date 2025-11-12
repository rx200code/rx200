package rx200.open_gl;

import android.content.Context;
import android.opengl.GLSurfaceView.Renderer;
import android.widget.Toast;

import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;

import javax.microedition.khronos.egl.EGLConfig;
import javax.microedition.khronos.opengles.GL10;

import static android.opengl.GLES30.glLineWidth;
import static android.opengl.GLES30.GL_COLOR_BUFFER_BIT;
import static android.opengl.GLES30.GL_FLOAT;
import static android.opengl.GLES30.GL_FRAGMENT_SHADER;
import static android.opengl.GLES30.GL_POINTS;
import static android.opengl.GLES30.GL_LINES;
import static android.opengl.GLES30.GL_VERTEX_SHADER;
import static android.opengl.GLES30.glClear;
import static android.opengl.GLES30.glClearColor;
import static android.opengl.GLES30.glDrawArrays;
import static android.opengl.GLES30.glEnableVertexAttribArray;
import static android.opengl.GLES30.glGetAttribLocation;
import static android.opengl.GLES30.glGetUniformLocation;
import static android.opengl.GLES30.glUniform4f;
import static android.opengl.GLES30.glUseProgram;
import static android.opengl.GLES30.glVertexAttribPointer;
import static android.opengl.GLES30.glViewport;

public class OpenGLRenderer implements Renderer {
    private Context context;
    private int programId;
    private FloatBuffer vertexData;
    //private int uColorLocation;
    private int aColorLocation;
    private int aPositionLocation;

    private int i_lines = 3;
    private int i_points = 0;

    public OpenGLRenderer(Context context) {
        this.context = context;
        prepareData();
    }

    @Override
    public void onSurfaceCreated(GL10 arg0, EGLConfig arg1) {
        glClearColor(0f, 0f, 0f, 1f);
        int vertexShaderId = ShaderUtils.createShader(context, GL_VERTEX_SHADER, R.raw.vertex_shader);
        int fragmentShaderId = ShaderUtils.createShader(context, GL_FRAGMENT_SHADER, R.raw.fragment_shader);
        programId = ShaderUtils.createProgram(vertexShaderId, fragmentShaderId);
        glUseProgram(programId);
        bindData();
    }

    @Override
    public void onSurfaceChanged(GL10 arg0, int width, int height) {
        glViewport(0, 0, width, height);
    }

    private void prepareData() {
        /*
        float x = 0.9f;
        float x2 = 5_000_000_000.0f;
        float[] vertices = {
                -x, 0.0f, 1.0f, 1.0f, 0.0f,
                x2, 0.0f, 0.0f, 1.0f, 1.0f,
        };
        //*/
        //*
        float[] vertices = new float[i_lines * (4 + 3 * 2) + i_points * (2 + 3)];

        double m = 1;
        for(int i = 0; i < vertices.length; i += 5){
            vertices[i] = (float) (Math.random() * 2 * m - m);
            vertices[i + 1] = (float) (Math.random() * 2 * m - m);
            vertices[i + 2] = (float) Math.random();
            vertices[i + 3] = (float) Math.random();
            vertices[i + 4] = (float) Math.random();
        }
        //*/

        vertexData = ByteBuffer.allocateDirect(vertices.length * 5).order(ByteOrder.nativeOrder()).asFloatBuffer();
        vertexData.put(vertices);
    }
    /*
    private void bindData() {
        //uColorLocation = glGetUniformLocation(programId, "u_Color");
        //glUniform4f(uColorLocation, 0.0f, 0.0f, 1.0f, 1.0f);
        aPositionLocation = glGetAttribLocation(programId, "a_Position");
        vertexData.position(0);
        glVertexAttribPointer(aPositionLocation, 2, GL_FLOAT, false, 0, vertexData);
        glEnableVertexAttribArray(aPositionLocation);
    }
    //*/
    private void bindData() {
        // координаты
        aPositionLocation = glGetAttribLocation(programId, "vPosition");
        vertexData.position(0);
        glVertexAttribPointer(aPositionLocation, 2, GL_FLOAT, false, 20, vertexData);
        glEnableVertexAttribArray(aPositionLocation);

        // цвет
        aColorLocation = glGetAttribLocation(programId, "a_Color");
        vertexData.position(2);
        glVertexAttribPointer(aColorLocation, 3, GL_FLOAT, false, 20, vertexData);
        glEnableVertexAttribArray(aColorLocation);

    }

    @Override
    public void onDrawFrame(GL10 arg0) {
        glClear(GL_COLOR_BUFFER_BIT);
        glLineWidth(5);
        //glDrawArrays(GL_LINES, 0, 4);
        //*
        glDrawArrays(GL_LINES, 0, i_lines * 2);
        //glLineWidth(3);
        //glDrawArrays(GL_LINES, 0, 4);
        /*
        glDrawArrays(GL_LINES, 0, i_lines * 2);
        glDrawArrays(GL_POINTS, i_lines * 2, i_points);
        //*/
    }
}