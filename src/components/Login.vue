<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submitForm">
      <div>
        <label for="user_email">Email:</label>
        <input type="email" id="user_email" v-model="user.user_email" required>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="user.password" required>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
  <div v-if="showUploadPopup" class="popup">
    <div class="popup-content">
      <p>{{ popupMessage }}</p>

      <button @click="hideUploadPopup" class="popup-button">OK</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
const showUploadPopup = ref(false);
const popupMessage = ref('');

const user = ref({
  user_email: '',
  password: '',
});

const router = useRouter();


async function submitForm() {
  axios.defaults.withCredentials = true;

  try {
    const response = await axios.post('http://localhost:4000/login', {
      user_email: user.value.user_email,
      password: user.value.password
    });

    if (response.status === 200) {
      const userData = response.data.user;

      localStorage.setItem("email", userData.user_email);

      if (userData.userType === "student") {
        localStorage.setItem("userId", userData.studentId._id);
      }
      else if (userData.userType === "admin") {
        localStorage.setItem("userId", userData._id);
      }
      else {
        console.error("User ID not found in response");
        showUploadPopup.value = true;
        popupMessage.value = "User ID not found in response";
        return;
      }

      if (userData.userType === 'admin') {
        localStorage.setItem("userType", "admin");
        router.push('/studentData');
      } else if (userData.userType === 'student') {
        localStorage.setItem("userType", "student");
        router.push('/performance');
      }
    } else {
      showUploadPopup.value = true;
      popupMessage.value = error.message;
    }
  } catch (error) {
    console.error(error);
    showUploadPopup.value = true;
    console.log(error);
    popupMessage.value = error.response.data.message;
  }
}

const hideUploadPopup = () => {
  showUploadPopup.value = false;
};
// onMounted(async () => {
//   axios.defaults.withCredentials = true;


//   try {
//     const response = await axios.get('http://localhost:4000/checkSession');

//     if (response) {
//       const sessionData = await response.data;
//       console.log(sessionData);
//       if (sessionData.loggedIn) {
//         if (sessionData.user_type === 'admin') {
//           localStorage.setItem("userType", "admin")
//           router.push('/studentData');
//           alert("Logging in with previous session")
//         } else if (sessionData.user_type === 'student') {
//           localStorage.setItem("userType", "student")
//           router.push('/performance');
//           alert("Logging in with previous session")
//         }
//       } else {

//       }
//     } else {
//       console.error('Failed to check session:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error checking session:', error);
//   }
// });
</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  margin-top: 5px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
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
