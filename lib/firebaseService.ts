import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { ListingSubmission, ClaimRequest, Chat, ChatMessage, Entity, Review } from '@/types';

export const uploadImage = async (uri: string, path: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};

export const submitListing = async (listing: Omit<ListingSubmission, 'id' | 'submittedAt'>): Promise<string> => {
  const listingsRef = collection(db, 'listingSubmissions');
  const docRef = await addDoc(listingsRef, {
    ...listing,
    submittedAt: serverTimestamp(),
    status: 'pending',
  });
  return docRef.id;
};

export const submitClaimRequest = async (claim: Omit<ClaimRequest, 'id' | 'submittedAt'>): Promise<string> => {
  const claimsRef = collection(db, 'claimRequests');
  const docRef = await addDoc(claimsRef, {
    ...claim,
    submittedAt: serverTimestamp(),
    status: 'pending',
  });
  return docRef.id;
};

export const getUserListings = async (userId: string): Promise<ListingSubmission[]> => {
  const q = query(
    collection(db, 'listingSubmissions'),
    where('userId', '==', userId),
    orderBy('submittedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    submittedAt: (doc.data().submittedAt as Timestamp).toDate().toISOString(),
    reviewedAt: doc.data().reviewedAt ? (doc.data().reviewedAt as Timestamp).toDate().toISOString() : undefined,
  } as ListingSubmission));
};

export const createChat = async (entityId: string, entityName: string, userId: string, userName: string): Promise<string> => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('entityId', '==', entityId), where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    const docRef = await addDoc(chatsRef, {
      entityId,
      entityName,
      userId,
      userName,
      unreadCount: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
  
  return snapshot.docs[0].id;
};

export const sendMessage = async (chatId: string, senderId: string, senderName: string, message: string, senderAvatar?: string): Promise<void> => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    chatId,
    senderId,
    senderName,
    senderAvatar,
    message,
    timestamp: serverTimestamp(),
    read: false,
  });

  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: message,
    lastMessageAt: serverTimestamp(),
    unreadCount: (await getDoc(chatRef)).data()?.unreadCount + 1 || 1,
  });
};

export const getChatMessages = async (chatId: string): Promise<ChatMessage[]> => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: (doc.data().timestamp as Timestamp).toDate().toISOString(),
  } as ChatMessage));
};

export const getUserChats = async (userId: string): Promise<Chat[]> => {
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', userId),
    orderBy('lastMessageAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    lastMessageAt: doc.data().lastMessageAt ? (doc.data().lastMessageAt as Timestamp).toDate().toISOString() : undefined,
  } as Chat));
};

export const getEntityChats = async (entityId: string): Promise<Chat[]> => {
  const q = query(
    collection(db, 'chats'),
    where('entityId', '==', entityId),
    orderBy('lastMessageAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate().toISOString(),
    lastMessageAt: doc.data().lastMessageAt ? (doc.data().lastMessageAt as Timestamp).toDate().toISOString() : undefined,
  } as Chat));
};

export const saveEntity = async (entity: Entity): Promise<void> => {
  const entityRef = doc(db, 'entities', entity.id);
  await setDoc(entityRef, entity);
};

export const saveReview = async (review: Review): Promise<void> => {
  const reviewRef = doc(db, 'reviews', review.id);
  await setDoc(reviewRef, review);
};

export const getEntities = async (): Promise<Entity[]> => {
  const snapshot = await getDocs(collection(db, 'entities'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Entity));
};

export const getReviews = async (entityId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('entityId', '==', entityId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};
