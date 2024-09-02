<template>
  <div id="app">
    <div class="timer">{{ formattedTime }}</div>
    <div class="controls">
      <button
        @click="toggleTimer"
        :disabled="isCustomizing"
        class="btn primary"
      >
        {{ isRunning ? "暂停" : "开始" }}
      </button>
      <button
        @click="resetTimer"
        :disabled="isRunning || isCustomizing"
        class="btn secondary"
      >
        重置
      </button>
      <button
        @click="toggleCustomize"
        :disabled="isRunning"
        class="btn secondary"
      >
        {{ isCustomizing ? "确认" : "自定义时间" }}
      </button>
    </div>
    <div v-if="isCustomizing" class="customize">
      <input
        type="number"
        v-model.number="customMinutes"
        min="1"
        max="60"
        @keypress="validateNumber"
      />
      <span>分钟</span>
    </div>
    <div class="history">
      <h3>完成历史</h3>
      <ul>
        <li v-for="(record, index) in history" :key="index">
          {{ formatDate(record) }}
        </li>
      </ul>
    </div>
    <audio ref="alarmSound" src="a.wav" loop></audio>
  </div>
</template>

<script>
export default {
  // script 部分保持不变
  data() {
    return {
      time: 1500, // 25 minutes in seconds
      initialTime: 1500,
      timer: null,
      isRunning: false,
      isCustomizing: false,
      customMinutes: 25,
      history: [],
      isAlarmPlaying: false,
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    },
  },
  methods: {
    toggleTimer() {
      if (this.isRunning) {
        this.pauseTimer();
      } else {
        if (this.isAlarmPlaying) {
          this.stopAlarm();
          this.resetTimer();
        }
        this.startTimer();
      }
    },
    startTimer() {
      this.isRunning = true;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          this.completeTimer();
        }
      }, 1000);
    },
    pauseTimer() {
      clearInterval(this.timer);
      this.isRunning = false;
    },
    resetTimer() {
      this.pauseTimer();
      this.stopAlarm();
      this.time = this.initialTime;
    },
    completeTimer() {
      this.pauseTimer();
      this.playAlarm();
      this.addToHistory();
    },
    playAlarm() {
      const alarm = this.$refs.alarmSound;
      alarm.currentTime = 0;
      alarm.play().catch((e) => console.error("播放音频失败:", e));
      this.isAlarmPlaying = true;
    },
    stopAlarm() {
      if (this.isAlarmPlaying) {
        const alarm = this.$refs.alarmSound;
        alarm.pause();
        alarm.currentTime = 0;
        this.isAlarmPlaying = false;
      }
    },
    toggleCustomize() {
      if (this.isCustomizing) {
        this.setCustomTime();
      }
      this.isCustomizing = !this.isCustomizing;
    },
    setCustomTime() {
      if (this.customMinutes >= 1 && this.customMinutes <= 60) {
        this.initialTime = this.customMinutes * 60;
        this.time = this.initialTime;
      } else {
        alert("请输入1到60之间的数字");
      }
    },
    validateNumber(event) {
      const keyCode = event.keyCode;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    },
    addToHistory() {
      this.history.unshift(new Date());
      if (this.history.length > 5) {
        this.history.pop();
      }
      this.saveHistory();
    },
    saveHistory() {
      localStorage.setItem("pomodoroHistory", JSON.stringify(this.history));
    },
    loadHistory() {
      const saved = localStorage.getItem("pomodoroHistory");
      if (saved) {
        this.history = JSON.parse(saved);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
  mounted() {
    this.loadHistory();
  },
};
</script>

<style>
body {
  background: linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: "Arial", sans-serif;
  color: #ecf0f1;
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

#app {
  position: relative;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 300px;
  height: 400px;
}

.timer {
  font-size: 60px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.controls {
  position: absolute;
  bottom: 100px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.btn {
  width: 80px;
  padding: 10px 0;
  font-size: 14px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn.primary {
  background-color: #e74c3c;
  color: white;
}

.btn.secondary {
  background-color: #3498db;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.history {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  text-align: left;
  height: 70px;
  overflow-y: auto;
}

.history h3 {
  font-size: 16px;
  margin-bottom: 5px;
}

.history li {
  font-size: 12px;
  margin-bottom: 3px;
}

/* 其他样式保持不变 */
</style>
