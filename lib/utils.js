import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const testIfIsItUniqueUsername = async (username) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const user = await getDocs(q);
    if (user.empty) {
        return true
    } else {
        return false
    }
}
export { testIfIsItUniqueUsername }