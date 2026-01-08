import { Databases, Client, Query, ID } from 'appwrite';

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const databaseProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseTableId = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(databaseProjectId);

const database = new Databases(client);
export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(databaseId, databaseTableId, [
      Query.equal('searchTerm', searchTerm || ''),
    ]);
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      console.log(doc, 'doc?');
      await database.updateDocument(databaseId, databaseTableId, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(databaseId, databaseTableId, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (e) {
    console.log(e);
  }
};
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(databaseId, databaseTableId, [
      Query.limit(5),
      Query.orderDesc('count'),
    ]);
    return result;
  } catch (e) {
    console.log(e);
  }
};
