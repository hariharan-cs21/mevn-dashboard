<template>
  <div class="container">
    <header class="header">
      <h1 class="header-title">{{ collegeName }}</h1>
      <div class="header-details">
        <h2>{{ performanceData.studentname }}</h2>
        <p>{{ performanceData.registerNumber }}</p>
      </div>
    </header>

    <div class="main-content">
      <div class="student-info">
        <div class="column">
          <p><strong>Batch:</strong> {{ performanceData.batch }}</p>
          <p><strong>Department:</strong> {{ performanceData.department }}</p>
          <p><strong>Contact: </strong><a href="tel:{{ performanceData.contact }}">{{ performanceData.contact }}</a></p>
        </div>
        <div class="column">
          <p><strong>Email:</strong> {{ performanceData.studentEmail }}</p>
          <p><strong>Undertaking:</strong> {{ performanceData.undertaking }}</p>
        </div>
      </div>

      <div class="assessment-data">
        <h3>Assessments Completed</h3>
        <table class="assessment-table">
          <thead>
            <tr>
              <th>Assessment Name</th>
              <th>Date Completed</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assessment in performanceData.assessmentsCompleted" :key="assessment._id">
              <td>{{ assessment.assessmentName }}</td>
              <td>{{ new Date(assessment.dateCompleted).toLocaleDateString() }}</td>
              <td>{{ assessment.marks }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="chart-container">
        <canvas id="progressChart" width="600" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  mounted() {
    const performanceData = JSON.parse(this.$route.query.performanceData);
    if (performanceData) {
      this.performanceData = performanceData;
      this.renderProgressChart();
    } else {
      console.warn('Performance Data is undefined');
    }
  },
  data() {
    return {
      performanceData: {},
      collegeName: "Bannari Amman Institute of Technology"
    };
  },
  methods: {
    renderProgressChart() {
      const ctx = document.getElementById('progressChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.performanceData.assessmentsCompleted.map(a => a.assessmentName),
          datasets: [{
            label: 'Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.marks),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Total Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.totalMarks), // Total Marks
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Average Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.averageMarks), // Average Marks
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
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
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  background-color: #f8f9fa;
  padding: 20px 40px;
  border-bottom: 1px solid #e2e6ea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  margin: 0;
  font-size: 28px;
  color: #333;
}

.header-details {
  text-align: right;
}

.main-content {
  padding: 40px;
}

.student-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  margin-bottom: 5px;
}

.column {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.column p {
  margin: 5px 0;
}

.column p strong {
  font-weight: bold;
  color: #555555;
}

.assessment-data {
  margin-top: 40px;
  margin-bottom: 20px;
}

.assessment-table {
  width: 100%;
  border-collapse: collapse;
}

.assessment-table th,
.assessment-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.assessment-table th {
  background-color: #f0f0f0;
}

.chart-container {
  width: 100%;
  max-width: 600px;
  height: auto;
  margin: 0 auto;
}

canvas {
  width: 100% !important;
  height: auto !important;
}
</style>
