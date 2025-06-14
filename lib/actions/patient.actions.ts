'use server';

import { ID, Query } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

import { parseStringify } from '../utils';
import {
  BUCKET_ID,
  DATABASE_ID,
  databases,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  storage,
  users,
} from '../appwrite.config';
import { patientSchema } from '@/schema';
import { ensureAttributesExist } from '../createAttr';

export const createUser = async (user: CreateUserParams) => {
  try {
    console.log(user.email);
    console.log(user.phone);
    console.log(user.name);
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    console.log('New user created:', newUser);

    return newUser;
  } catch (error: any) {
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal('email', [user.email]),
      ]);

      return parseStringify(existingUser.users[0]);
    }
    console.error('An error occurred while creating a new user:', error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error('An error occurred while fetching user:', error);
  }
};

export const registerPatient = async ({
  ...patient
}: RegisterUserParams) => {
  try {
    //await ensureAttributesExist(DATABASE_ID!, PATIENT_COLLECTION_ID!, patientSchema)
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error('An error occurred while registering patient:', error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal('userId', userId)]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error('An error occurred while fetching patient:', error);
  }
};
