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

    <div class="card chart-card">
      <h2>Assessment Scores</h2>
      <canvas id="assessmentChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'Performance',
  data() {
    return {
      studentname: '',
      batch: '',
      contact: '',
      studentEmail: '',
      undertaking: '',
      assessmentsCompleted: []
    };
  },
  created() {
    this.fetchPerformanceData();
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    async fetchPerformanceData() {
      axios.defaults.withCredentials = true;

      const userId = localStorage.getItem('userId');
      if (!userId) {
        await this.logout();
        return;
      }

      try {
        const response = await axios.post('http://localhost:4000/performance', { studentId: userId });
        const { studentname, batch, contact, studentEmail, undertaking, assessmentsCompleted } = response.data;

        if (assessmentsCompleted && assessmentsCompleted.length > 0) {
          this.studentname = studentname;
          this.batch = batch;
          this.contact = contact;
          this.studentEmail = studentEmail;
          this.undertaking = undertaking;
          this.assessmentsCompleted = assessmentsCompleted;

          this.renderChart();
        } else {
          console.warn('No assessments data found');
        }
      } catch (error) {
        console.error('Error fetching performance data:', error);
      }
    },

    async logout() {
      try {
        await axios.post('http://localhost:4000/logout');
        localStorage.removeItem('email');
        localStorage.removeItem('userType');
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        this.$router.push('/login');
      }
    },
    renderChart() {
      const ctx = document.getElementById('assessmentChart').getContext('2d');

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const labels = this.assessmentsCompleted.map(assessment => assessment.assessmentName);
      const marks = this.assessmentsCompleted.map(assessment => assessment.marks);
      const totalMarks = this.assessmentsCompleted.map(assessment => assessment.totalMarks);
      const averageMarks = this.assessmentsCompleted.map(assessment => assessment.averageMarks);

      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Marks',
              data: marks,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              label: 'Total Marks',
              data: totalMarks,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Average Marks',
              data: averageMarks,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
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
    }

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
  max-width: 800px;
}
</style>
