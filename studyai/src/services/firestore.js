


import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'


export async function getUserProfile(uid) {
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function setUserProfile(uid, data) {
  const ref = doc(db, 'users', uid)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}


export async function getSubjects(uid) {
  const q = query(collection(db, 'subjects'), where('uid', '==', uid))
  const snap = await getDocs(q)
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
}

export async function addSubject(uid, data) {
  return addDoc(collection(db, 'subjects'), {
    ...data,
    uid,
    topics: [],
    createdAt: serverTimestamp(),
  })
}

export async function updateSubject(id, data) {
  await updateDoc(doc(db, 'subjects', id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteSubject(id) {
  await deleteDoc(doc(db, 'subjects', id))
}


export async function getSchedule(uid) {
  const q = query(collection(db, 'schedule'), where('uid', '==', uid))
  const snap = await getDocs(q)
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
}

export async function addScheduleItem(uid, data) {
  return addDoc(collection(db, 'schedule'), { ...data, uid, createdAt: serverTimestamp() })
}

export async function updateScheduleItem(id, data) {
  await updateDoc(doc(db, 'schedule', id), data)
}

export async function deleteScheduleItem(id) {
  await deleteDoc(doc(db, 'schedule', id))
}


export async function logStudySession(uid, date, hours) {
  const id = `${uid}_${date}`
  await setDoc(doc(db, 'sessions', id), { uid, date, hours, updatedAt: serverTimestamp() }, { merge: true })
}

export async function getStudySessions(uid) {
  const q = query(collection(db, 'sessions'), where('uid', '==', uid))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data())
}
