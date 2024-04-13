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
console.log(studentId);
const assessmentName = ref('');
const dateCompleted = ref('');
const marks = ref('');

const addPerformance = async () => {
    axios.defaults.withCredentials = true;

    try {
        const performanceData = {
            studentId,
            assessmentsCompleted: [{
                assessmentName: assessmentName.value,
                dateCompleted: new Date(dateCompleted.value),
                marks: parseInt(marks.value)
            }]
        };


        const response = await axios.post('http://localhost:4000/addPerformance', performanceData);

        console.log('Server response:', response.data);

        assessmentName.value = '';
        dateCompleted.value = '';
        marks.value = '';
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

input {
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