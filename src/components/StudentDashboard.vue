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
          <p><strong>Contact: </strong><a href="tel:{{ performanceData.contact }}" class="contact-link">{{
            performanceData.contact }}</a></p>
        </div>
        <div class="column">
          <p><strong>Email:</strong> <a href="mailto:{{ performanceData.studentEmail }}" class="email-link">{{
            performanceData.studentEmail }}</a></p>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="assessment in performanceData.assessmentsCompleted" :key="assessment._id">
              <td>{{ assessment.assessmentName }}</td>
              <td>{{ new Date(assessment.dateCompleted).toLocaleDateString() }}</td>
              <td>{{ assessment.marks }} / {{ assessment.totalMarks }}</td>
              <td>
                <button @click="deleteAssessment(performanceData._id, assessment._id)"
                  class=" delete-button">Delete</button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
      <div class="card problem-solving-card" style="margin-bottom: 10px;">
        <h2>Problem Solving</h2>
        <table class="problem-solving-table">
          <thead>
            <tr>
              <th>Level Name</th>
              <th>Attempts</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in performanceData.problemSolving" :key="problem._id">
              <td>{{ problem.levelName }}</td>
              <td>{{ problem.attempts }}</td>
              <td>{{ new Date(problem.date).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="chart-container">
        <canvas id="progressChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
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
    async deleteAssessment(id, assessmentId) {
      const response = await axios.delete(`http://localhost:4000/performance/${id}/${assessmentId}`)
      console.log(response.data);
      this.performanceData.assessmentsCompleted = this.performanceData.assessmentsCompleted.filter(
        assessment => assessment._id !== assessmentId
      );
    },
    renderProgressChart() {
      const ctx = document.getElementById('progressChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.performanceData.assessmentsCompleted.map(a => a.assessmentName),
          datasets: [{
            label: 'Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.marks),
            backgroundColor: '#4CAF50',
            borderColor: '#45A049',
            borderWidth: 2,
            borderRadius: 4
          },
          {
            label: 'Total Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.totalMarks),
            backgroundColor: '#FFC107',
            borderColor: '#FFA000',
            borderWidth: 2,
            borderRadius: 4
          },
          {
            label: 'Average Marks',
            data: this.performanceData.assessmentsCompleted.map(a => a.averageMarks),
            backgroundColor: '#2196F3',
            borderColor: '#1E88E5',
            borderWidth: 2,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 20px 40px;
  border-bottom: 2px solid #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.problem-solving-table {
  border-collapse: collapse;
  width: 100%;
}

.problem-solving-table th,
.problem-solving-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.problem-solving-table th {
  background-color: #f2f2f2;
  color: #333;
}

.problem-solving-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.problem-solving-table tr:hover {
  background-color: #f5f5f5;
}

.header-title {
  margin: 0;
  font-size: 36px;
  font-weight: bold;
}

.header-details {
  text-align: right;
}

.delete-button:hover {
  padding: 6px 15px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-style: normal;
}

.delete-button {
  padding: 6px 15px;
  background-color: rgba(239, 11, 11, 0.797);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-style: normal;
}

.main-content {
  padding: 40px;
}

.student-info {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 40px;
}

.column {
  flex: 1;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.column p {
  margin: 15px 0;
  font-size: 18px;
}

.column p strong {
  font-weight: bold;
  color: #555;
}

.contact-link,
.email-link {
  color: #007BFF;
  text-decoration: none;
}

.contact-link:hover,
.email-link:hover {
  text-decoration: underline;
}

.assessment-data {
  margin-bottom: 40px;
}

.assessment-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.assessment-table th,
.assessment-table td {
  border: 1px solid #e0e0e0;
  padding: 15px;
  text-align: left;
}

.assessment-table th {
  background-color: #f0f0f0;
}

.chart-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

canvas {
  border-radius: 8px;
}
</style>
