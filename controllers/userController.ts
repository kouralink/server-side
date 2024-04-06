import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { testIfIsItUniqueUsername } from '../lib/utils.js';
import { is } from 'express/lib/request.js';

const isItUniqueUsername = async (req, res) => {
    const { username } = req.body;
    const isIt = await testIfIsItUniqueUsername(username);
    res.json({ isIt });
}

// add user to firestore (username as Id, Firstname, Lastname, bio , phone numbers, emails, sex,birthday,country and profilePic)
const addUser = async (req, res) => {
    const { username, firstname, lastname, bio, phoneNumbers,
        emails,sex,birthday,country,profilePic } = req.body;
    const usersRef = collection(db, 'users');
    // isItUniqueUsername function is called to check if the username is unique
    await addDoc(usersRef, {
        username,
        firstname,
        lastname,
        bio,
        phoneNumbers,
        emails,
        sex,
        birthday,
        country,
        profilePic
    });
    res.json({ message: "User added successfully" });
}
