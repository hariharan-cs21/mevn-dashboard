<template>
  <div class="registration-form">
    <h2>Registration</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="user_email">Email:</label>
        <input type="email" id="user_email" v-model="user.user_email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="user.password" required>
      </div>
      <div class="form-group">
        <label for="userType">User Type:</label>
        <select id="userType" v-model="user.userType" required>
          <option value="" disabled>Select User Type</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
      </div>
      <button type="submit" class="btn-register">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        user_email: '',
        password: '',
        userType: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await fetch('http://localhost:4000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.user)
        });
        if (response.ok) {
          console.log('Registration successful!');
          this.user.user_email = '';
          this.user.password = '';
          this.user.userType = '';
        } else {
          console.error('Registration failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error registering user:', error);
      }
    }
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="email"],
input[type="password"],
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.btn-register {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn-register:hover {
  background-color: #0056b3;
}
</style>
