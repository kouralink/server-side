class User {
    constructor(username,firstName,lastName, gender, birthday, address, bio, phoneNumbers) {
        (this.username = username),
        (this.firstName = firstName),
        (this.lastName = lastName),
        (this.gender = gender),
        (this.birthday = birthday),
        (this.address = address),
        (this.bio = bio),
        (this.phoneNumbers = phoneNumbers);
    }
  }
  
  export default User;


  // example

  // user obj:{"username":"ilore","firstName":"Ilore","lastName":"najdaoui","gender":"male","birthday":"1998-12-12","address":"tunis","bio":"hello","phoneNumbers":["+216 22 222 222"]}
  