package com.voicechanger

import android.media.MediaPlayer
import android.media.PlaybackParams
import android.os.Build
import androidx.annotation.RequiresApi
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class VoiceChangingModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

    private var mediaPlayer: MediaPlayer? = null

    override fun getName(): String {
        return "VoiceChangingModule"
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    @ReactMethod
    fun changeVoice(params: ReadableMap, promise: Promise) {
        try {
          val audioTrackURL: String? = params.getString("audioTrackURL")
        val pitch: Float = params.getDouble("pitch")?.safeToFloat() ?: 1.0f 
        val speed: Float = params.getDouble("speed")?.safeToFloat() ?: 1.0f
        val effectType: String? = params.getString("effectType") ?: "defaultEffectType" 

        

            if (audioTrackURL.isNullOrBlank()) {
                throw IllegalArgumentException("Audio track URL cannot be null or empty")
            }

            mediaPlayer?.stop() // Stop previous playback if it's ongoing

            val mp = MediaPlayer()
            mediaPlayer = mp

            val playbackParams = PlaybackParams().apply {
                pitch?.let { this.pitch = it }
                speed?.let { this.speed = it }
            }

            mp.setDataSource(audioTrackURL)
            mp.prepare()
            mp.playbackParams = playbackParams

            mp.setOnPreparedListener {
                mp.start()
                notifyEffectChanged("Currently playing $effectType")
                val response = mapOf(
                    "message" to "Voice has been changed successfully. Pitch: $pitch, Speed: $speed, Effect Type: $effectType",
                    "pitch" to pitch,
                    "speed" to speed,
                    "effectType" to effectType
                )
                promise.resolve(response)
            }

            mp.setOnErrorListener { _, what, extra ->
                val errorMessage = "Error during playback: $what, $extra"
                promise.reject("VOICE_PLAYBACK_ERROR", errorMessage)
                false
            }

            mp.setOnCompletionListener {
                promise.resolve("Playback completed")
            }
        } catch (e: Exception) {
            e.printStackTrace()
            promise.reject("VOICE_CHANGE_FAILED", e.message)
        }
    }

    private fun notifyEffectChanged(effect: String) {
        val reactContext = reactApplicationContext
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("VoiceEffectChanged", effect)
    }

    private fun Double?.safeToFloat(): Float? {
        return this?.toFloat()
    }
}
