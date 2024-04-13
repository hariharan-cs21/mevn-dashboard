<template>
  <div class="container">
    <input type="file" @change="handleFileUpload" accept=".csv,.xlsx" class="file-input">
    <button @click="uploadFile" class="upload-button">Upload</button>
    <div class="filters">
      <div class="filter-container">
        <label for="nameFilter" class="filter-label">Filter by Name:</label>
        <input type="text" id="nameFilter" v-model="nameFilter" class="filter-input">
      </div>
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>
      <div class="filter-container">
        <label for="departmentFilter" class="filter-label">Filter by Department:</label>
        <select id="departmentFilter" v-model="departmentFilter" class="filter-input">
          <option value="">All</option>
          <option value="AD">AD</option>
          <option value="AG">AG</option>

          <option value="AL">AL</option>
          <option value="BM">BM</option>
          <option value="BT">BT</option>
          <option value="CB">CB</option>
          <option value="CS">CS</option>
          <option value="CT">CT</option>
          <option value="EC">EC</option>
          <option value="EE">EE</option>
          <option value="EI">EI</option>
          <option value="IS">IS</option>
          <option value="IT">IT</option>
          <option value="MC">MC</option>
          <option value="ME">ME</option>

        </select>
      </div>
      <!-- <div class="filter-container">
        <label for="hostellerFilter" class="filter-label">Filter by Hosteller:</label>
        <select id="hostellerFilter" v-model="hostellerFilter" class="filter-input">
          <option value="">All</option>
          <option value="HOSTELLER">Hosteller</option>
          <option value="DAYSCHOLAR">Dayscholar</option>
        </select>
      </div> -->
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Register Number</th>
            <th>Student Name</th>
            <th>Batch</th>
            <th>Contact</th>
            <th>Department</th>
            <th>Student Email</th>
            <th>Undertaking</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rowIndex) in filteredTableData" :key="rowIndex">
            <td>{{ rowIndex + 1 }}</td>
            <td>{{ row.registerNumber }}</td>
            <td>{{ row.studentname }}</td>
            <td>{{ row.batch }}</td>
            <td>{{ row.contact }}</td>
            <td>{{ row.department }}</td>
            <td>{{ row.studentEmail }}</td>
            <td>{{ row.undertaking }}</td>
            <td>
              <button class="view" @click="viewPerformance(row._id)">View Performance</button>
              <button class="add-performance" @click="addPerformance(row._id)">Add Performance</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p id="last"></p>
    <button class="bottom-button" @click="scrollToBottom">⬇&nbsp;scroll</button>

    <div v-if="showUploadPopup" class="popup">
      <div class="popup-content">
        <p>File uploaded successfully!</p>
        <button @click="hideUploadPopup" class="popup-button">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const tableData = ref([]);
const tableHeaders = ref([]);
const showUploadPopup = ref(false);
const nameFilter = ref('');
const departmentFilter = ref('');
// const hostellerFilter = ref('');
const isLoading = ref(false);

const router = useRouter();

const scrollToBottom = () => {
  const lastElement = document.getElementById('last');
  if (lastElement) {
    lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
};

const viewPerformance = async (id) => {
  axios.defaults.withCredentials = true;

  try {
    const response = await axios.get(`http://localhost:4000/performance/${id}`);
    const performanceData = response.data;

    router.push({
      name: 'studentperformance',
      params: { studentId: id },
      query: {
        performanceData: JSON.stringify(performanceData)
      }
    });

  } catch (error) {
    console.error('Error fetching performance data:', error);
  }
};


const addPerformance = async (id) => {
  try {
    router.push({ name: 'AddPerformance', query: { studentId: id } });
  } catch (error) {
    console.error('Error navigating to AddPerformance:', error);
  }
};



const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    import('xlsx').then((XLSX) => {
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (jsonData.length > 0) {
        tableHeaders.value = jsonData[0];
        tableData.value = jsonData.slice(1);
      }
    });
  };

  reader.readAsArrayBuffer(file);
};
// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   const reader = new FileReader();

//   reader.onload = (e) => {
//     const csvData = e.target.result;
//     const jsonData = CSVtoJSON(csvData);

//     if (jsonData.length > 0) {
//       tableHeaders.value = Object.keys(jsonData[0]);
//       tableData.value = jsonData;
//     }
//   };

//   reader.readAsText(file);
// };

// const CSVtoJSON = (csvData) => {
//   const lines = csvData.split("\n");
//   const result = [];
//   const headers = lines[0].split(",");

//   for (let i = 1; i < lines.length; i++) {
//     const obj = {};
//     const currentLine = lines[i].split(",");

//     for (let j = 0; j < headers.length; j++) {
//       obj[headers[j]] = currentLine[j];
//     }

//     result.push(obj);
//   }

//   return result;
// };
const uploadFile = async () => {
  axios.defaults.withCredentials = true;


  const formData = new FormData();
  formData.append('file', document.querySelector('input[type="file"]').files[0]);

  try {
    await axios.post('http://localhost:4000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('File uploaded successfully.');
    showUploadPopup.value = true;
  } catch (error) {
    console.error('An error occurred while uploading the file:', error);
  }
};

const hideUploadPopup = () => {
  showUploadPopup.value = false;
};

const fetchData = async () => {
  axios.defaults.withCredentials = true;
  isLoading.value = true;
  try {
    const response = await axios.get('http://localhost:4000/studentData');
    const data = response.data;

    if (data.length > 0) {
      tableHeaders.value = Object.keys(data[0]);
      tableData.value = data;
    }
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
  }
  finally {
    isLoading.value = false;
  }
};
fetchData()
onMounted(async () => {
  axios.defaults.withCredentials = true;

  try {
    const response = await axios.get('http://localhost:4000/checkSession');
    const sessionData = response.data;
    console.log(sessionData);

    if (!sessionData.loggedIn) {
      router.push('/login');
    }
    if (sessionData.user_type === 'admin') {
      localStorage.setItem("userType", "admin")

    }
    if (sessionData.user_type === 'student') {
      router.push('/404notfound');
      localStorage.setItem("userType", "student")
    }
  } catch (error) {
    console.error('Error checking session:', error);
  }
});

const filteredTableData = computed(() => {
  let filteredData = tableData.value;

  if (nameFilter.value.trim() !== '') {
    filteredData = filteredData.filter(row => row.studentname.toLowerCase().includes(nameFilter.value.trim().toLowerCase()));
  }

  if (departmentFilter.value.trim() !== '') {
    filteredData = filteredData.filter(row => row.department.toLowerCase().includes(departmentFilter.value.trim().toLowerCase()));
  }

  // if (hostellerFilter.value !== '') {
  //   filteredData = filteredData.filter(row => row.hostellerOrDayscholar === hostellerFilter.value);
  // }

  return filteredData;
});

</script>


<style scoped>
.container {
  padding: 20px;
}


.table-container {
  overflow-x: auto;
}

.upload-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view {
  padding: 8px 20px;
  background-color: gray;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-style: normal;
}

.upload-button:hover {
  background-color: #0056b3;
}

.loading-container {
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

.loading-spinner {
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-left: 8px solid #3498db;
  width: 50px;
  height: 50px;
  animation: load 1s linear infinite;
}

@keyframes load {
  0% {
    transform: rotate(360deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
}

.filter-container {
  flex: 1;
  margin-right: 20px;
}

.filter-label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.filter-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #e0e0e0;
  padding: 12px;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #fafafa;
}

tr:hover {
  background-color: #f0f0f0;
}

@media only screen and (max-width: 768px) {
  th {
    display: none;
  }

  td {
    display: block;
    padding: 10px 12px;
    border: none;
    border-bottom: 1px solid #e0e0e0;
  }
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

.bottom-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.bottom-button:hover {
  background-color: #0056b3;
}
</style>
