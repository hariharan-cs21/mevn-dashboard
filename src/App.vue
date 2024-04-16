<template>
  <div class="navbar">
    <p v-if="userType !== null">Logged in as </p>
    <p style="margin-left: 10px; font-size: 12px;font-weight: bold;">{{ email }}</p>

    <RouterLink to="/login" class="navbar-link">Login</RouterLink>
    <RouterLink v-if="userType !== 'student'" to="/register" class="navbar-link">Register</RouterLink>
    <RouterLink v-if="userType === 'student'" to="/performance" class="navbar-link">Dashboard</RouterLink>
    <RouterLink v-if="userType !== 'student'" to="/rankList" class="navbar-link">Rank List</RouterLink>

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
          localStorage.clear()
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
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  padding: 15px 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  border-radius: 10px;
}

.navbar-link {
  color: #333;
  font-size: 18px;
  margin-left: 20px;
  text-decoration: none;
  cursor: pointer;
  padding: 10px 15px;
  transition: all 0.3s ease;
  position: relative;
}

.navbar-link::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  transition: background-color 0.3s ease;
}

.navbar-link:hover::before {
  background-color: #007bff;
}

.navbar-link.active {
  background: #007bff;
  color: #ffffff;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar-link.active::before {
  background-color: #ffffff;
}

.navbar-link:focus {
  border-radius: 10px;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
}
</style>
