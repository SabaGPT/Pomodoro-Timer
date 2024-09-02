<template>
  <div id="app" class="container">
    <div class="timer">{{ minutes }}:{{ seconds }}</div>
    <button @click="toggleTimer" class="stylish-button">
      {{ buttonText }}
    </button>
    <button
      v-if="isAlarmPlaying"
      @click="stopAlarm"
      class="stylish-button stop-alarm"
    >
      停止闹铃
    </button>
    <audio ref="alarmSound" src="a.wav" loop></audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 1500, // 25 minutes in seconds
      timer: null,
      isRunning: false,
      isAlarmPlaying: false,
      resetTimeout: null,
    };
  },
  computed: {
    minutes() {
      return String(Math.floor(this.time / 60)).padStart(2, "0");
    },
    seconds() {
      return String(this.time % 60).padStart(2, "0");
    },
    buttonText() {
      if (this.isRunning) {
        return "暂停";
      } else if (this.time === 1500 && !this.isAlarmPlaying) {
        return "开始";
      } else if (!this.isAlarmPlaying) {
        return "继续";
      } else {
        return "等待中";
      }
    },
  },
  methods: {
    toggleTimer() {
      if (this.isAlarmPlaying) {
        return; // 如果闹铃正在响，不允许操作计时器
      }
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },
    startTimer() {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          this.timerComplete();
        }
      }, 1000);
    },
    pauseTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
    },
    resetTimer() {
      this.pauseTimer();
      this.time = 1500;
    },
    timerComplete() {
      this.pauseTimer();
      this.playAlarmSound();
      // 设置一个延迟来重置计时器，给足够时间让用户听到和停止闹铃
      this.resetTimeout = setTimeout(() => {
        if (this.isAlarmPlaying) {
          this.stopAlarm();
        }
        this.resetTimer();
      }, 30000); // 30秒后自动停止闹铃并重置
    },
    playAlarmSound() {
      const alarm = this.$refs.alarmSound;
      alarm.currentTime = 0;
      alarm.play().catch((e) => console.error("播放音频失败:", e));
      this.isAlarmPlaying = true;
    },
    stopAlarm() {
      const alarm = this.$refs.alarmSound;
      alarm.pause();
      alarm.currentTime = 0;
      this.isAlarmPlaying = false;
      clearTimeout(this.resetTimeout);
      this.resetTimer();
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  font-family: Arial, sans-serif;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.timer {
  font-size: 64px;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stylish-button {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  outline: none;
  margin: 10px 0;
}

.stylish-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #ff8e8e, #ffd779);
}

.stylish-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stop-alarm {
  background: linear-gradient(45deg, #ff4757, #ff6b6b);
}

.stop-alarm:hover {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
}
</style>
