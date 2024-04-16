<template>
    <div class="add-performance">
        <h2>Add Performance Data</h2>
        <form @submit.prevent="addPerformance">
            <div class="form-group">
                <label for="levelName">Level Name:</label>
                <input type="text" id="levelName" v-model="levelName" required>
            </div>
            <div class="form-group">
                <label for="attempts">Attempts:</label>
                <input type="number" id="attempts" v-model="attempts" required>
            </div>
            <div class="form-group">
                <label for="dateCompleted">Date:</label>
                <input type="date" id="dateCompleted" v-model="dateCompleted" required>
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

const levelName = ref('');
const attempts = ref('');
const dateCompleted = ref('');


const addPerformance = async () => {
    axios.defaults.withCredentials = true;

    try {
        const performanceData = {
            studentId,
            problemSolving: [{
                levelName: levelName.value,
                date: new Date(dateCompleted.value),
                attempts: parseInt(attempts.value)
            }]
        };

        const response = await axios.post('http://localhost:4000/addPerformance/problemsolving', performanceData);

        console.log('Server response:', response.data);

        levelName.value = '';
        attempts.value = '';
        data.value = ''

    } catch (error) {
        console.error('Error adding problem-solving data:', error);
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
