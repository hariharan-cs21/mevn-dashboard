<template>
  <div class="performance-container">
    <div class="card performance-card">
      <h2>Performance Overview</h2>
      <div class="metrics">
        <div class="metric">
          <span class="label">Name:</span>
          <span class="value">{{ studentname }}</span>
        </div>
        <div class="metric">
          <span class="label">Batch:</span>
          <span class="value">{{ batch }}</span>
        </div>
        <div class="metric">
          <span class="label">Contact:</span>
          <span class="value">{{ contact }}</span>
        </div>
        <div class="metric">
          <span class="label">Email:</span>
          <span class="value">{{ studentEmail }}</span>
        </div>
        <div class="metric">
          <span class="label">Undertaking:</span>
          <span class="value">{{ undertaking }}</span>
        </div>
      </div>
    </div>

    <div class="card assessments-card">
      <h2>Assessments</h2>
      <table class="marks-table">
        <thead>
          <tr>
            <th>Assessment Name</th>
            <th>Mark</th>
            <th>Attendance</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assessment, index) in assessmentsCompleted" :key="index">
            <td>{{ assessment.assessmentName }}</td>
            <td>{{ assessment.marks }} / {{ assessment.totalMarks }}</td>
            <td>{{ assessment.attendancePercentage }}%</td>
            <td>{{ assessment.comments }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showUploadPopup" class="popup">
      <div class="popup-content">
        <p>{{ popupMessage }}</p>

        <button @click="hideUploadPopup" class="popup-button">OK</button>
      </div>
    </div>
    <div class="card chart-card">
      <h2>Assessment Scores</h2>
      <canvas id="assessmentChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import { ref } from 'vue';

export default {
  name: 'Performance',
  setup() {
    const studentname = ref('');
    const batch = ref('');
    const contact = ref('');
    const studentEmail = ref('');
    const undertaking = ref('');
    const assessmentsCompleted = ref([]);
    const popupMessage = ref('');
    const showUploadPopup = ref(false);
    const chartInstance = ref(null);

    const fetchPerformanceData = async () => {
      axios.defaults.withCredentials = true;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        await logout();
        return;
      }

      try {
        const response = await axios.post('http://localhost:4000/performance', { studentId: userId });
        const { studentname: sName, batch: bBatch, contact: cContact, studentEmail: sEmail, undertaking: uUndertaking, assessmentsCompleted: aAssessmentsCompleted } = response.data;

        if (aAssessmentsCompleted && aAssessmentsCompleted.length > 0) {
          studentname.value = sName;
          batch.value = bBatch;
          contact.value = cContact;
          studentEmail.value = sEmail;
          undertaking.value = uUndertaking;
          assessmentsCompleted.value = aAssessmentsCompleted;

          renderChart();
        } else {
          console.warn('No assessments data found');
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
        showUploadPopup.value = true;
        popupMessage.value = error.response ? error.response.data.message : 'Unknown error occurred';
      }
    };

    const logout = async () => {
      try {
        await axios.post('http://localhost:4000/logout');
        localStorage.removeItem('email');
        localStorage.removeItem('userType');
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        this.$router.push('/login');
      }
    };

    const hideUploadPopup = () => {
      showUploadPopup.value = false;
    };

    const renderChart = () => {
      const ctx = document.getElementById('assessmentChart').getContext('2d');

      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      const labels = assessmentsCompleted.value.map(assessment => assessment.assessmentName);
      const marks = assessmentsCompleted.value.map(assessment => assessment.marks);
      const totalMarks = assessmentsCompleted.value.map(assessment => assessment.totalMarks);
      const averageMarks = assessmentsCompleted.value.map(assessment => assessment.averageMarks);

      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Marks',
              data: marks,
              backgroundColor: '#4CAF50',
              borderColor: '#45A049',
              borderWidth: 2,
              borderRadius: 4
            },
            {
              label: 'Total Marks',
              data: totalMarks,
              backgroundColor: '#FFC107',
              borderColor: '#FFA000',
              borderWidth: 2,
              borderRadius: 4
            },
            {
              label: 'Average Marks',
              data: averageMarks,
              backgroundColor: '#2196F3',
              borderColor: '#1E88E5',
              borderWidth: 2,
              borderRadius: 4
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }
      });
    };

    return {
      studentname,
      batch,
      contact,
      studentEmail,
      undertaking,
      assessmentsCompleted,
      popupMessage,
      showUploadPopup,
      hideUploadPopup,
      fetchPerformanceData,
      chartInstance
    };
  },

  mounted() {
    this.fetchPerformanceData();
  }
};
</script>


<style>
.performance-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px;
}

.card h2 {
  border-bottom: 2px solid #333;
  color: #333;
  font-size: 1.8rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.metrics,
.marks-table {
  width: 100%;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.label {
  color: #666;
  font-weight: bold;
}

.value {
  color: #333;
}

.marks-table {
  border-collapse: collapse;
  width: 100%;
}

.marks-table th,
.marks-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.marks-table th {
  background-color: #f2f2f2;
  color: #333;
}

.marks-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.marks-table tr:hover {
  background-color: #f5f5f5;
}

.chart-card {
  width: 100%;
  max-width: 800px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.popup-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.popup-button:hover {
  background-color: #0056b3;
}
</style>
