const uuid = require("uuid").v4;

class ProfileService {
  profiles = {};

  createProfile(username, email, photo, password) {
    if (this.profiles[email]) {
      throw new Error(`${email} profile already exists`);
    }

    this.profiles[email] = {
      photo,
      password,
      username,
      email,
    };
    console.log(`${email} profile created`);
    console.log(this.profiles[email]);
    return this.profiles[email];
  }

  getProfile(email) {
    return this.profiles[email];
  }

  checkEmailPassword(email, password) {
    if (!this.profiles[email]) {
      throw new Error("No such email");
    }

    if (this.profiles[email].password != password) {
      throw new Error("Wrong password");
    }

    return this.profiles[email];
  }
}

module.exports = new ProfileService();
