<template>
    <div class="add-performance">
        <h2>Add Performance Data</h2>
        <form @submit.prevent="addPerformance">
            <div class="form-group">
                <label for="assessmentName">Assessment Name:</label>
                <input type="text" id="assessmentName" v-model="assessmentName" required>
            </div>
            <div class="form-group">
                <label for="dateCompleted">Date Completed:</label>
                <input type="date" id="dateCompleted" v-model="dateCompleted" required>
            </div>
            <div class="form-group">
                <label for="marks">Marks:</label>
                <input type="number" id="marks" v-model="marks" required>
            </div>
            <div class="form-group">
                <label for="totalMarks">Total Marks:</label>
                <input type="number" id="totalMarks" v-model="totalMarks" required>
            </div>
            <div class="form-group">
                <label for="averageMarks">Average Marks:</label>
                <input type="number" id="averageMarks" v-model="averageMarks" required>
            </div>
            <div class="form-group">
                <label for="attendancePercentage">Attendance Percentage:</label>
                <input type="number" id="attendancePercentage" v-model="attendancePercentage" required>
            </div>
            <div class="form-group">
                <label for="comments">Comments:</label>
                <textarea id="comments" v-model="comments"></textarea>
            </div>
            <button type="submit">Add</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const studentId = route.query.studentId;

const assessmentName = ref('');
const dateCompleted = ref('');
const marks = ref('');
const totalMarks = ref('');
const averageMarks = ref('');
const attendancePercentage = ref('');
const comments = ref('');

const addPerformance = async () => {
    axios.defaults.withCredentials = true;

    try {
        const performanceData = {
            studentId,
            assessmentsCompleted: [{
                assessmentName: assessmentName.value,
                dateCompleted: new Date(dateCompleted.value),
                marks: parseInt(marks.value),
                totalMarks: parseInt(totalMarks.value),
                averageMarks: parseInt(averageMarks.value),
                attendancePercentage: parseInt(attendancePercentage.value),
                comments: comments.value
            }]
        };

        const response = await axios.post('http://localhost:4000/addPerformance', performanceData);

        console.log('Server response:', response.data);

        assessmentName.value = '';
        dateCompleted.value = '';
        marks.value = '';
        totalMarks.value = '';
        averageMarks.value = '';
        attendancePercentage.value = '';
        comments.value = '';

    } catch (error) {
        console.error('Error adding performance data:', error);
    }
};


</script>

<style scoped>
.add-performance {
    margin: 100px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
}

input,
textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>
