import firebase from '../firebase.js';
import User from '../Models/userModel.js';
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
} from 'firebase/firestore';

const db = getFirestore(firebase);


//TODO: using UID that we got from firebase authentication to create user and get user and update user and delete user
// check if username is unique
const isItUniqueUsername = async (username) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

export const createUser = async (req, res) => {
    try {
      // test if user uid exists
      const data = req.body;
      // make sure that all fields are filled and make egal empty string if not expet UID and username
      if (!data.firstName) {
        data.firstName = '';
      }
      if (!data.lastName) {
        data.lastName = '';
      }
      if (!data.gender) {
        data.gender = 'male';
      }
      if (!data.birthday) {
        data.birthday = '';
      }
      if (!data.address) {
        data.address = '';
      }
      if (!data.bio) {
        data.bio = '';
      }
      if (!data.phoneNumbers) {
        data.phoneNumbers = [];
      }


      const UID = data.UID;
      if (!UID) {
        res.status(400).send('UID is required');
        return;
    }
      // test if aleady there is doc with uid
      const docRef = doc(collection(db, 'users'), req.body.UID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        res.status(400).send('user already exists');
        return;
      }
        //   generate username if exists in db
        if (!data.username) {
            data.username = data.firstName + data.lastName;
        }
        //   test if username is unique and generate new one if not
        while (!await isItUniqueUsername(data.username)) {
            data.username = data.username + Math.floor(Math.random() * 100);
        }
        delete data.UID;
        await setDoc(docRef, data);
        res.status(201).send('user created successfully');
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  
  // is username unique using get method to get user by username
export const isUsernameUnique = async (req, res) => {
    try {
      const q = query(collection(db, 'users'), where('username', '==', req.params.username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

// using get method to get user by username
export const getUserByUsername = async (req, res) => {
  try {
        
        const q = query(collection(db, 'users'), where('username', '==', req.params.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const user = new User(
                doc.data().username,
                doc.data().firstName,
                doc.data().lastName,
                doc.data().gender,
                doc.data().birthday,
                doc.data().address,
                doc.data().bio,
                doc.data().phoneNumbers
            );
            res.status(200).send(user);
        }
        else {
            res.status(404).send('user not found');
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// get user by UID
export const getUserByUID = async (req, res) => {
    try {
        const docRef = doc(collection(db, 'users'), req.params.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const user = new User(
                docSnap.data().username,
                docSnap.data().firstName,
                docSnap.data().lastName,
                docSnap.data().gender,
                docSnap.data().birthday,
                docSnap.data().address,
                docSnap.data().bio,
                docSnap.data().phoneNumbers
            );
            res.status(200).send(user);
        } else {
            res.status(404).send('user not found');
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}


// update user by UID
export const updateUser = async (req, res) => {
    try {
        const docRef = doc(collection(db, 'users'), req.params.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // test of username is unique
            if (req.body.username) {
                if (req.body.username !== docSnap.data().username) {
                    if (!await isItUniqueUsername(req.body.username)) {
                        res.status(400).send('username already exists');
                        return;
                    }
                }
            }
            await setDoc(docRef, req.body, { merge: true });
            res.status(200).send('user updated successfully');
        } else {
            res.status(404).send('user not found');
        }
    } catch (error) {
      res.status(400).send(error.message);
    }
  }

// delete by UID
export const deleteUser = async (req, res) => {
    try {
      const docRef = doc(collection(db, 'users'), req.params.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        res.status(200).send('user deleted successfully');
      } else {
        res.status(404).send('user not found');
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

