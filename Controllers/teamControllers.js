import firebase from "../firebase.js";
import Team from "../Models/teamModel.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  setDoc,
  Timestamp,
  limit,
  addDoc,
} from "firebase/firestore";

const db = getFirestore(firebase);

// check if team name is unique
const isItUniqueTeamName = async (teamName) => {
  const q = query(collection(db, "teams"), where("teamName", "==", teamName));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

//TODO: return team after update success in updateTeam function
//TODO: return team after create success in createTeam function

// create team team (teamName, coatch, id) is required other fields are optional and have default value if not filled that is empty string or empty array
// blackList is array of user id
// teamLogo is string url
// description is string
// createdAt and updatedAt are date that got using firebase.firestore.Timestamp.serverTimestamp()
// return 201 if team created
// doc id is id of team
// return 400 if teamName already exists

export const createTeam = async (req, res) => {
  try {
    // test if teamName exists
    const data = req.body;
    // make sure that all fields are filled and make egal empty string if not expet teamName and coatch
    if (!data.description) {
      data.description = "";
    }
    if (!data.teamLogo) {
      data.teamLogo = "";
    }
    if (!data.blackList) {
      data.blackList = [];
    }
    const servertime = Timestamp.now();
    console.log("server time:", servertime);
    data.createdAt = servertime;
    data.updatedAt = servertime;
    
    console.log(data);
    // team name
    const teamName = data.teamName;
    if (!teamName) {
      // return obj contain error message
      res.status(400).send("teamName is required");

      return;
    }
    // test if is it unique team name
    const isUnique = await isItUniqueTeamName(teamName);
    if (!isUnique) {
      console.log("team with name: ", teamName, " already exists");
      return res.status(400).send(`team with name: ${teamName} already exists`);
    }
    // coatch
    const coach = data.coach;
    if (!coach) {
      res.status(400).send("coach is required");
      return;
    }
    // const id = teamName + coach;
    // if (!id) {
    //   res.status(400).send("id is required");
    //   return;
    // }
    // test if aleady there is doc with id
    // const docRef = doc(collection(db, "teams"), id);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   res.status(400).send(`team with id: ${id} already exists`);
    //   return;
    // }

    // create team

    await addDoc(collection(db, "teams"), {
      teamName: teamName,
      description: data.description,
      coach: coach,
      teamLogo: data.teamLogo,
      blackList: data.blackList,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: coach,
    });
    res.status(201).send(`team created with name: ${teamName}`);
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error check it ilorez");
  }
};

// update team
export const updateTeam = async (req, res) => {
  try {
    // test if id is exist
    const data = req.body;
    const id = data.id;
    // remove id from data
    delete data.id;
    if (!id) {
      res.status(400).send("id is required");
      return;
    }

    const docRef = doc(collection(db, "teams"), id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // test if teamName is unique
      if (data.teamName) {
        if (data.teamName !== docSnap.data().teamName) {
          if (!(await isItUniqueTeamName(data.teamName))) {
            res.status(400).send("teamName already exists");
            return;
          }
        }
      }
      // update updateAt
      data.updatedAt = Timestamp.now();
      await setDoc(docRef, data, { merge: true });
      res.status(200).send(`team with id: ${id} updated`);
    } else {
      res.status(404).send("team not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// delete team by id
export const deleteTeam = async (req, res) => {
  try {
    const docRef = doc(collection(db, "teams"), req.params.id);
    const docSnap = await getDoc(docRef);
    // delete

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      res.status(200).send(`team with id: ${req.params.id} deleted`);
    } else {
      res.status(404).send("team not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// get team by id
export const getTeamById = async (req, res) => {
  try {
    const docRef = doc(collection(db, "teams"), req.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      res.status(200).send(docSnap.data());
    } else {
      res.status(404).send("team not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// add user to blackList
export const addUserToBlackList = async (req, res) => {
  try {
    const tid = req.params.tid;
    const uid = req.params.uid;
    const docRef = doc(collection(db, "teams"), tid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.blackList.includes(uid)) {
        res.status(400).send("user already in blackList");
        return;
      }
      data.blackList.push(uid);
      // update updateAt
      data.updatedAt = firebase.firestore.Timestamp.serverTimestamp();

      await setDoc(docRef, data, { merge: true });
      res.status(200).send("user added to blackList");
    } else {
      res.status(404).send("team not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// remove user from blackList
export const removeUserFromBlackList = async (req, res) => {
  try {
    const tid = req.params.tid;
    const uid = req.params.uid;
    const docRef = doc(collection(db, "teams"), tid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (!data.blackList.includes(uid)) {
        res.status(400).send("user not in blackList");
        return;
      }
      data.blackList = data.blackList.filter((userId) => userId !== uid);
      // update updateAt
      data.updatedAt = firebase.firestore.Timestamp.serverTimestamp();
      await setDoc(docRef, data, { merge: true });
      res.status(200).send("user removed from blackList");
    } else {
      res.status(404).send("team not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// search team by teamName
// get all teams that have teamName like the query limit to 10
export const searchTeams = async (req, res) => {
  try {
    const q = query(
      collection(db, "teams"),
      where("name", ">=", req.params.query),
      where("name", "<=", req.params.query + "\uf8ff"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const teams = [];
    querySnapshot.forEach((doc) => {
      teams.push(doc.data());
    });
    res.status(200).send(teams);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Q and A
// Q: how to send error message in express?
// A: use res.status(400).send("error message");
// how to get this error message in the client side?
// A: use fetch api and get the response and use response.text() or response.json() to get the message
