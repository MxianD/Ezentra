package com.metabuilder.frontend

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil

class NavigationBarModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "NavigationBarModule"
    }

    @ReactMethod
    fun hideNavigationBar() {
        UiThreadUtil.runOnUiThread {
            val currentActivity = reactContext.currentActivity ?: return@runOnUiThread

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // For Android 11+
                currentActivity.window.setDecorFitsSystemWindows(false)
                currentActivity.window.insetsController?.let { controller ->
                    controller.hide(WindowInsets.Type.navigationBars())
                    controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                }
            } else {
                // For older Android versions
                @Suppress("DEPRECATION")
                currentActivity.window.decorView.systemUiVisibility = (
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    or View.SYSTEM_UI_FLAG_FULLSCREEN
                    or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                )
            }

            // Set the navigation bar color to black just in case it becomes visible
            currentActivity.window.navigationBarColor = android.graphics.Color.BLACK
        }
    }

    @ReactMethod
    fun setNavigationBarColor(color: String) {
        UiThreadUtil.runOnUiThread {
            try {
                val currentActivity = reactContext.currentActivity ?: return@runOnUiThread
                val colorValue = android.graphics.Color.parseColor(color)
                currentActivity.window.navigationBarColor = colorValue
            } catch (e: Exception) {
                // Color parsing might fail, fallback to black
                reactContext.currentActivity?.window?.navigationBarColor = android.graphics.Color.BLACK
            }
        }
    }
} 