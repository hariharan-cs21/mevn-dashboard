<template>
  <div class="performance">
    <div class="card performance-card">
      <h2>Performance Overview</h2>
      <div class="metrics">
        <div class="metric">
          <div class="label">Name</div>
          <div class="value">{{ studentname }}</div>
        </div>

        <div class="metric">
          <div class="label">Current Batch</div>
          <div class="value">{{ currentBatch }}</div>
        </div>

      </div>
    </div>

    <div class="card placements-card">
      <h2>Past Placements</h2>
      <div style="max-height: 80vh; overflow: auto;" class="placements">
        <div v-for="(prev, index) in previousPlacements" :key="index" class="placement">
          <h3>{{ index + 1 }}. {{ prev.name }}</h3>
          <p>{{ prev.role }}</p>
        </div>
      </div>
    </div>

    <div class="card marks-card">
      <h2>Assessments</h2>
      <table class="marks-table">
        <thead>
          <tr>
            <th>Assessment Name</th>
            <th>Mark</th>
            <th>Attended Time</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(assessment, index) in assessmentsCompleted" :key="index">
            <td>{{ assessment.assessmentName }}</td>
            <td>{{ assessment.marks }}</td>
            <td>{{ new Date(assessment.dateCompleted).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Performance',
  data() {
    return {
      currentLevel: null,
      currentBatch: null,
      studentname: null,
      previousPlacements: [],
      assessmentsCompleted: []
    };
  },
  created() {
    this.fetchPerformanceData();
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
        const { studentname, batch, assessmentsCompleted } = response.data;

        this.studentname = studentname;
        this.currentBatch = batch;
        this.assessmentsCompleted = assessmentsCompleted;
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
    }
  }
};
</script>
<style>
.performance {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  gap: 20px;
  padding: 20px;
}

.card {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: calc(33.33% - 40px);
  max-width: 300px;
  min-width: 250px;
  text-align: left;
}

.card h2 {
  margin-top: 0;
  font-size: 1.5rem;
  color: #333;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.metric {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #666;
}

.projects,
.placements {
  margin-top: 15px;
}

.project,
.placement {
  background-color: #f2f2f2;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}

.project h3,
.placement h3 {
  margin: 0;
  font-size: 1.1rem;
}

.project p,
.placement p {
  margin: 5px 0;
  color: #666;
}

.marks-table {
  width: 100%;
  border-collapse: collapse;
}

.marks-table th,
.marks-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.marks-table th {
  background-color: #f2f2f2;
  color: #333;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.btn-primary {
  background-color: #007bff;
  margin-top: 2px;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
