package rx200.open_gl;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.ConfigurationInfo;
import android.graphics.SurfaceTexture;
import android.media.MediaCodec;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;
import android.opengl.GLSurfaceView;
import android.os.Bundle;
import android.util.Log;

import android.opengl.EGL14;
import android.opengl.EGLConfig;

import java.io.IOException;
import android.view.Surface;
import android.view.SurfaceControl;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import javax.microedition.khronos.egl.EGL10;


public class MainActivity extends Activity {

    private final int CONTEXT_CLIENT_VERSION = 3;

    private GLSurfaceView mGLSurfaceView;


    @Override
    protected void onCreate ( Bundle savedInstanceState )
    {
        super.onCreate ( savedInstanceState );
        mGLSurfaceView = new GLSurfaceView ( this );

        if ( detectOpenGLES30() )
        {
            Log.d ( G.TAG, "OpenGL ES 3.0" );
            // Tell the surface view we want to create an OpenGL ES 3.0-compatible
            // context, and set an OpenGL ES 3.0-compatible renderer.
            mGLSurfaceView.setEGLContextClientVersion ( CONTEXT_CLIENT_VERSION );
            mGLSurfaceView.setRenderer ( new TestSun ( this ) );
            //mGLSurfaceView.setRenderer ( new OpenGLRenderer ( this ) );
        }
        else
        {
            Log.e ( G.TAG, "OpenGL ES 3.0 not supported on device.  Exiting..." );
            finish();

        }

        setContentView ( mGLSurfaceView );
    }

    private boolean detectOpenGLES30()
    {
        ActivityManager am =
                ( ActivityManager ) getSystemService ( Context.ACTIVITY_SERVICE );
        ConfigurationInfo info = am.getDeviceConfigurationInfo();
        return ( info.reqGlEsVersion >= 0x30000 );
    }

    @Override
    protected void onResume()
    {
        // Ideally a game should implement onResume() and onPause()
        // to take appropriate action when the activity looses focus
        super.onResume();
        mGLSurfaceView.onResume();
    }

    @Override
    protected void onPause()
    {
        // Ideally a game should implement onResume() and onPause()
        // to take appropriate action when the activity looses focus
        super.onPause();
        mGLSurfaceView.onPause();
    }
    private static void test()
    {
        // TESTS
        Log.d ( G.TAG, "START TESTS" );

        int[] version = new int[2];
        EGLDisplay display = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);

        if(display == EGL14.EGL_NO_DISPLAY){
            Log.d ( G.TAG, "EGL_NO_DISPLAY" );
            Log.d ( G.TAG, "Unable to open connection to local windowing system" );
        }else{
            if(!EGL14.eglInitialize(display, version, 0, version, 1)){
                Log.d ( G.TAG, "Unable to initialize EGL; handle and recover" );
            }else{
                Log.d ( G.TAG, "EGL_DISPLAY" );
                //Log.d ( G.TAG, "version[0] "+version[0]);//1
                //Log.d ( G.TAG, "version[1] "+version[1]);//0

                EGLConfig[] configs = new EGLConfig[5];
                int[] num_config = new int[1];


                if (EGL14.eglGetConfigs (
                        display,
                        configs,
                        0,
                        5,
                        num_config,
                        0
                )){
                    //infoConfig(display, configs, num_config);

                    //EGLSurface  win = GLSurfaceView(this);
                    int[] attrib_list = {EGL14.EGL_RGB_BUFFER, EGL14.EGL_BACK_BUFFER, EGL14.EGL_NONE};
                    //int[] attrib_list = {EGL14.EGL_NONE};

                    Log.d ( G.TAG, "errorSurface01");

                    try {
                        Log.d ( G.TAG, "errorSurface02");
                            /*
                            MediaCodec mEncoder = MediaCodec.createEncoderByType("video/avc");

                            Log.d ( G.TAG, "errorSurface03");
                            Surface win = mEncoder.createInputSurface();
                            //*/

                        SurfaceTexture win1 = new SurfaceTexture(0);// заменить 0 на, int: имя объекта текстуры OpenGL (например, сгенерировано с помощью glGenTextures)
                        //SurfaceView win1 = new SurfaceView(this);
                        //SurfaceHolder win = win1.getHolder();

                        //Surface win = new Surface(win1);
                        Surface win = new Surface(win1);

                        Log.d ( G.TAG, "errorSurface3");
                        EGLSurface window = EGL14.eglCreateWindowSurface(
                                display,
                                configs[2],
                                win,
                                attrib_list,
                                0
                        );

                        Log.d ( G.TAG, "errorSurface2");
                        if(window == EGL14.EGL_NO_SURFACE){
                            Log.d ( G.TAG, "errorSurface");
                        }else{
                            Log.d ( G.TAG, "Ok Surface");
                        }

                        //*
                        int[] attrib_list_c = {
                                EGL14.EGL_CONTEXT_CLIENT_VERSION, 3,
                                EGL14.EGL_NONE
                        };
                        EGLContext eglContext = EGL14.eglCreateContext(
                                display,
                                configs[2],
                                EGL14.EGL_NO_CONTEXT,
                                attrib_list_c,
                                0
                        );
                        Log.d ( G.TAG, "Ok eglContext");
                        //*/

                        if(EGL14.eglMakeCurrent(
                                display,
                                window,
                                window,
                                eglContext
                        )){
                            Log.d ( G.TAG, "Ok eglMakeCurrent");
                        }




                    }catch ( /* IOException | */ IllegalStateException e) {
                        Log.d ( G.TAG, "errorSurface4: "+e.getMessage());
                    }







                }

            }

        }
        Log.d ( G.TAG, "END TESTS" );
        // END TESTS
    }
    private static void infoConfig(EGLDisplay display, EGLConfig[] configs, int[] num_config)
    {
        Log.d(G.TAG, "#################### num_config: " + num_config[0]+" ####################");
        int[] value = new int[1];
        int attribute;
        for(int i = 0; i < num_config[0]; i++) {//int i = 0
            Log.d(G.TAG, "#################### config: "+i+" ####################");

            attribute = EGL14.EGL_BUFFER_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_BUFFER_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_RED_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_RED_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_GREEN_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_GREEN_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_BLUE_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_BLUE_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_LUMINANCE_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_LUMINANCE_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_ALPHA_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_ALPHA_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_ALPHA_MASK_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_ALPHA_MASK_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_BIND_TO_TEXTURE_RGB;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_BIND_TO_TEXTURE_RGB: " + value[0]+" ("+(value[0] == 1)+")");
            }

            attribute = EGL14.EGL_BIND_TO_TEXTURE_RGBA;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_BIND_TO_TEXTURE_RGBA: " + value[0]+" ("+(value[0] == 1)+")");
            }

            attribute = EGL14.EGL_COLOR_BUFFER_TYPE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_COLOR_BUFFER_TYPE: " + value[0]+" ("+(value[0] == EGL14.EGL_RGB_BUFFER ? "EGL_RGB_BUFFER": (value[0] == EGL14.EGL_LUMINANCE_BUFFER ? "EGL_LUMINANCE_BUFFER": "unknown value"))+")");
            }

            attribute = EGL14.EGL_CONFIG_CAVEAT;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_CONFIG_CAVEAT: " + value[0]+" ("+(value[0] == EGL14.EGL_NONE ? "EGL_NONE": "unknown value")+")");
            }

            attribute = EGL14.EGL_CONFIG_ID;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_CONFIG_ID: " + value[0]);
            }

            attribute = EGL14.EGL_CONFORMANT;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_CONFORMANT: " + value[0]+" ("+(value[0] == 1)+")");
            }

            attribute = EGL14.EGL_DEPTH_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_DEPTH_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_LEVEL;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_LEVEL: " + value[0]);
            }

            attribute = EGL14.EGL_MAX_PBUFFER_WIDTH;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_MAX_PBUFFER_WIDTH: " + value[0]);
            }

            attribute = EGL14.EGL_MAX_PBUFFER_HEIGHT;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_MAX_PBUFFER_HEIGHT: " + value[0]);
            }

            attribute = EGL14.EGL_MAX_PBUFFER_PIXELS;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_MAX_PBUFFER_PIXELS: " + value[0]);
            }

            attribute = EGL14.EGL_MAX_SWAP_INTERVAL;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_MAX_SWAP_INTERVAL: " + value[0]);
            }

            attribute = EGL14.EGL_MIN_SWAP_INTERVAL;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_MIN_SWAP_INTERVAL: " + value[0]);
            }

            attribute = EGL14.EGL_NATIVE_RENDERABLE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_NATIVE_RENDERABLE: " + value[0]+" ("+(value[0] == 1)+")");
            }

            attribute = EGL14.EGL_NATIVE_VISUAL_ID;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_NATIVE_VISUAL_ID: " + value[0]);
            }

            attribute = EGL14.EGL_NATIVE_VISUAL_TYPE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_NATIVE_VISUAL_TYPE: " + value[0]);
            }

            attribute = EGL14.EGL_RENDERABLE_TYPE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_RENDERABLE_TYPE: " + value[0]);
            }

            attribute = EGL14.EGL_SAMPLE_BUFFERS;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_SAMPLE_BUFFERS: " + value[0]);
            }

            attribute = EGL14.EGL_SAMPLES;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_SAMPLES: " + value[0]);
            }

            attribute = EGL14.EGL_STENCIL_SIZE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_STENCIL_SIZE: " + value[0]);
            }

            attribute = EGL14.EGL_SURFACE_TYPE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_SURFACE_TYPE: " + value[0]);
            }

            attribute = EGL14.EGL_TRANSPARENT_TYPE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_TRANSPARENT_TYPE: " + value[0]);
            }

            attribute = EGL14.EGL_TRANSPARENT_RED_VALUE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_TRANSPARENT_RED_VALUE: " + value[0]);
            }

            attribute = EGL14.EGL_TRANSPARENT_GREEN_VALUE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_TRANSPARENT_GREEN_VALUE: " + value[0]);
            }

            attribute = EGL14.EGL_TRANSPARENT_BLUE_VALUE;
            if (EGL14.eglGetConfigAttrib(
                    display,
                    configs[i],
                    attribute,
                    value,
                    0)) {
                Log.d(G.TAG, "EGL_TRANSPARENT_BLUE_VALUE: " + value[0]);
            }

        }
    }

}