<template>
  <div class="navbar">
    <p v-if="userType !== null">Logged in as </p>
    <p style="margin-left: 10px; font-size: 12px;font-weight: bold;">{{ email }}</p>

    <RouterLink to="/login" class="navbar-link">Login</RouterLink>
    <RouterLink v-if="userType !== 'student'" to="/register" class="navbar-link">Register</RouterLink>
    <RouterLink v-if="userType === 'student'" to="/performance" class="navbar-link">Dashboard</RouterLink>

    <RouterLink v-if="userType === 'admin'" to="/studentData" class="navbar-link">Student List</RouterLink>
    <p v-if="userType !== null" style="cursor: pointer;" @click="logout" class="navbar-link">Logout</p>
  </div>
  <RouterView></RouterView>
</template>

<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router';
export default {
  name: 'App',
  data() {
    return {
      userType: localStorage.getItem("userType"),
      email: localStorage.getItem("email")
    }
  },
  methods: {
    async logout() {
      try {
        const response = await axios.post("http://localhost:4000/logout");

        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("userType");
          this.$router.push('/login');
        } else {
          console.log("Failed to logout");
        }
      } catch (err) {
        console.log(err);
      }
    }

  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #dcdbdb;
  padding: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.navbar-link {
  color: #333;
  font-size: 18px;
  margin-left: 20px;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.navbar-link:hover {
  color: #007bff;
}
</style>
checksession if not loggedout show logout button else hide it