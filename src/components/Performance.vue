<template>
  <div class="performance">
    <div class="card performance-card">
      <h2>Performance Overview</h2>
      <div style="max-height: 80vh; overflow: auto;" class="metrics">
        <div class="metric">
          <div class="label">Name</div>
          <div class="value">{{ name }}</div>
        </div>
        <div class="metric">
          <div class="label">Current Level</div>
          <div class="value">{{ currentLevel }}</div>
        </div>
        <div class="metric">
          <div class="label">Current Batch</div>
          <div class="value">{{ currentBatch }}</div>

        </div>
        <div class="metric">
          <div class="label">Total companies attended</div>
          <div class="value">{{ previousPlacements.length }}</div>
        </div>

      </div>
      <button class="btn btn-primary">View Details</button>


    </div>

    <div class="card placements-card">
      <h2>Past Placements</h2>
      <div style="max-height: 80vh; overflow: auto;" class="placements">
        <div v-for="(prev, index) in previousPlacements" :key="index" class="placement">
          <h3>{{ index + 1 }}. {{ prev.name }}</h3>
          <p>{{ prev.role }}</p>
        </div>

      </div>
      <button class="btn btn-primary">View Placements</button>
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
          <tr v-for="(assessment, index) in previousMarks" :key="index">
            <td>{{ assessment.name }}</td>
            <td>{{ assessment.mark }}</td>
            <td>{{ assessment.attendedTime }}</td>
          </tr>
        </tbody>
      </table>
      <button class="btn btn-primary">View All Marks</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Performance',
  data() {
    return {
      currentLevel: 3,
      currentBatch: 'Batch 2025',
      previousPlacements: [
        { name: 'Soliton', role: "Software Developer" },
        { name: 'Mini Cooper', role: "Full Stack developer", }
      ],
      name: 'Hari',
      previousMarks: [
        { name: 'Level-1', mark: 85, attendedTime: '2023-01-15' },
        { name: 'Level-2', mark: 90, attendedTime: '2023-02-20' },
      ]
    }
  }
}
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