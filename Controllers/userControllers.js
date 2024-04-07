import { set } from 'firebase/database';
import firebase from '../firebase.js';
import User from '../Models/userModel.js';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
} from 'firebase/firestore';

const db = getFirestore(firebase);

// check if username is unique
const isItUniqueUsername = async (username) => {
    const q = query(collection(db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };


export const createUser = async (req, res) => {
    try {
      const data = req.body;
        //   generate username if exists in db
        if (!data.username) {
            data.username = data.firstName + data.lastName;
        }
        //   test if username is unique and generate new one if not
        while (!await isItUniqueUsername(data.username)) {
            data.username = data.username + Math.floor(Math.random() * 100);
        }
        // using setDoc instead of addDoc 
        await addDoc(collection(db, 'users'), data);
        res.status(201).send('user created successfully');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

export const getUsers = async (req, res) => {
    try {
      const users = [];
      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
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
        users.push({"doc_id": doc.id ,"user":user});
        }
    );
    res.status(200).send(users);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

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
export const getUser = async (req, res) => {
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

export const updateUser = async (req, res) => {
    try {
        // if (req.body.username) {
        //     if (req.body.username !== req.params.username) {
        //     if (await isItUniqueUsername(req.body.username)) {
        //         const q = query(collection(db, 'users'), where('username', '==', req.params.username));
        //         const querySnapshot = await getDocs(q); 
        //         if (!querySnapshot.empty) {
        //             const doc = querySnapshot.docs[0];
        //             // update using set docs method
        //             await setDoc(doc.ref, req.body, { merge: true });
        //         } else {
        //             res.status(404).send('user not found');
        //         }
        //         res.status(200).send('user updated successfully');
        //     } else {
        //         res.status(400).send('username already exists');
        //     }
        // }

        // }

        if (req.body.username) {
            if (req.body.username !== req.params.username) {
                if (!await isItUniqueUsername(req.body.username)) {
                    res.status(400).send('username already exists');
                    return;
                }
            }
            
        }
        const q = query(collection(db, 'users'), where('username', '==', req.params.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            // update using set docs method
            await setDoc(doc.ref, req.body, { merge: true });
        } else {
            res.status(404).send('user not found');
        }
      res.status(200).send('user updated successfully');
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

export const deleteUser = async (req, res) => {
    try {
        // find doc by username and delete document with a random id
        const q = query(collection(db, 'users'), where('username', '==', req.params.username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            await deleteDoc(doc.ref);
            res.status(200).send('user deleted successfully');
        } else {
            res.status(404).send('user not found');
        }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };


