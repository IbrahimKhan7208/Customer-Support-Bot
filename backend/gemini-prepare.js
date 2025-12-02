import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexDocument(filePath) {
  // const isIndexed = await checkIfIndexed(filePath);

  // if (isIndexed) {
  //   return {
  //     success: true,
  //     skipped: true,
  //     filePath: filePath,
  //   };
  // }

  const loader = new PDFLoader(filePath, { splitPages: false });
  const doc = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });
  const texts = await splitter.splitText(doc[0].pageContent);

  const documents = texts.map((chunks) => {
    return {
      pageContent: chunks,
      metadata: doc[0].metadata,
    };
  });

  await vectorStore.addDocuments(documents);

//   return {
//     success: true,
//     skipped: false,
//     filePath: filePath,
//   };
}

const filePath = "./docs/customer-support-data.pdf"

await indexDocument(filePath)

// async function checkIfIndexed(filePath) {
//   const result = await vectorStore.similaritySearch("check", 1, { filePath });

//   return result.length > 0;
// }
