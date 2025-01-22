const express = require("express");
// const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcryptjs");
const UserOnPlatform = require("../models/User");
const TempUserOnPlatform = require("../models/TempUser");
const mongoose = require('mongoose');
const URL = require("../models/Url");
const UnverifiedSubdomain = require("../models/UnverifiedSubDomains");
const Tags = require("../models/TagsContacts");
const USER = require("../models/User");
const QueueBatch = require('../models/QueueBatch');
const BatchModel = require('../models/Batches');
const Contacts = require("../models/Contacts");
const AudioMetrics = require("../models/AudioMetrics");
const CampaignModel = require("../models/Campaigns");
const campaignQueue = require("../utils/campaignQueue");
router.use(cookieParser());
const axios = require("axios");
const { createToken } = require("../middleware/jwtToken");
const multer = require('multer');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");
const videoIntelligence = require('@google-cloud/video-intelligence');
const { Storage } = require('@google-cloud/storage');
const fs = require("fs");
const path = require("path");
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const natural = require('natural');
const math = require('mathjs');
const { ComprehendClient, DetectEntitiesCommand } = require('@aws-sdk/client-comprehend'); // Import v3 modules



const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer; // To get word stems (e.g., "running" → "run")

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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", // Add your OpenAI API key here
});

const OPENAI_API_KEY = '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';

const { createClient } = require("pexels");

const client = createClient('GFWHPQc8lHEJS9VfLmgMJyXxYwRxFQeEjV6AxNuOML01JW16N0hizyEd');

const lambda = new LambdaClient({
  region: "us-east-1",

  credentials: {
    accessKeyId: "AKIASFUIRXHCV5NCSLT4",
    secretAccessKey: "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",
  },
});

// client.videos.search({ query, size, orientation, per_page: 10 }).then((response) => {
//   const filteredVideos = response.videos.filter(video => video.duration <= max_duration);

//   console.log(`Videos under ${max_duration} seconds:`, filteredVideos);
// }).catch(error => {
//   console.error('Error fetching videos:', error);
// });

// client.videos.show({ id: 5511154 }).then(videoResponse => {

//   console.log('videoResponse : ', videoResponse);

// });




const s3 = new S3Client({
  credentials: {
    accessKeyId: 'AKIASFUIRXHCV5NCSLT4',
    secretAccessKey: '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',
  },
  region: 'ap-south-1',
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Upload files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.mp3') {
      return cb(new Error('Only .mp3 files are allowed'), false);
    }
    cb(null, true);
  },
});


const projectId = 'atomic-byway-382021'; 
const location = 'us-central1'; 




// async function generateContent(splitTranscript) {
//   const generativeModel = clientGoogle.preview.getGenerativeModel({
//     model: model,
//     generationConfig: {
//       maxOutputTokens: 8192,
//       temperature: 1,
//       topP: 0.95,
//       seed: 0,
//     },
//     safetySettings: [
//       { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'OFF' },
//       { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'OFF' },
//     ],
//   });

//   const text1 = {
//     text: `Summarize the following and give me two arrays: one named 'summary', which should have the summary of the text, and another array named 'context', which should contain the top 3 concise and meaningful context of the text and should not cross 15 words and avoid stop words as an array of items: ${splitTranscript}`,
//   };

//   const req = {
//     contents: [
//       { role: 'user', parts: [text1] },
//     ],
//   };

//   const MAX_RETRIES = 5; // Max number of retry attempts
//   let attempt = 0;

//   while (attempt < MAX_RETRIES) {
//     try {
//       const streamingResp = await generativeModel.generateContentStream(req);

//       let aggregatedText = '';

//       // Collect all chunks of the response into a single text
//       for await (const item of streamingResp.stream) {
//         if (item && item.candidates) {
//           const content = item.candidates[0]?.content?.parts?.map((part) => part.text).join(' ') || '';
//           aggregatedText += content;
//         }
//       }

//       // Initialize arrays
//       const summary = [];
//       const context = [];

//       // Parse `summary` and `context` from the aggregated text
//       if (aggregatedText) {
//         const summaryMatch = aggregatedText.match(/summary\s*=\s*\[(.*?)\]/is);
//         const contextMatch = aggregatedText.match(/context\s*=\s*\[(.*?)\]/is);

//         // Extract summary items
//         if (summaryMatch) {
//           const summaryItems = summaryMatch[1]
//             .split('",') // Split by closing quote and comma
//             .map((item) => item.replace(/["']/g, '').trim()) // Remove quotes and extra whitespace
//             .filter(Boolean); // Filter out empty items
//           summary.push(...summaryItems);
//         }

//         // Extract context items
//         if (contextMatch) {
//           const contextItems = contextMatch[1]
//             .split('",') // Split by closing quote and comma
//             .map((item) => item.replace(/["']/g, '').trim()) // Remove quotes and extra whitespace
//             .filter(Boolean); // Filter out empty items
//           context.push(...contextItems);
//         }
//       }

//       // Log the final response
//       const aggregatedResponse = {
//         summary,
//         context,
//       };

//       console.log('Aggregated Response:', aggregatedResponse);
//       return aggregatedResponse; // Success: exit loop and return response
//     } catch (error) {
//       attempt++;

//       console.error(`Error during content generation (Attempt ${attempt}/${MAX_RETRIES}):`, error);

//       if (attempt >= MAX_RETRIES) {
//         throw new Error(`Failed to generate content after ${MAX_RETRIES} attempts.`);
//       }

//       // Exponential backoff with jitter
//       const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1500; // Delay in ms
//       console.log(`Retrying after ${backoffTime.toFixed(0)} ms...`);
//       await new Promise((resolve) => setTimeout(resolve, backoffTime));
//     }
//   }
// }

async function generateContentHuggingFace(splitTranscript) {

  // Hugging Face Inference API details
  const HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"; // Replace with your chosen model
  const HF_API_TOKEN = "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"; // Get this from Hugging Face dashboard

  // Define retry parameters
  const MAX_RETRIES = 5;
  let attempt = 0;

  // Create the input payload for the model
  const requestPayload = {
    inputs: splitTranscript,
    options: { wait_for_model: true },
  };

  while (attempt < MAX_RETRIES) {
    try {
      console.log(`Attempt ${attempt + 1}: Sending request to Hugging Face API...`);

      // Send the request to Hugging Face Inference API
      const response = await axios.post(HF_API_URL, requestPayload, {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Generated response:", response);


      // Parse the response text
      const generatedText = response.data[0]?.generated_text || "";
      console.log("Generated Text:", generatedText);

      // Extract summary and context using regular expressions
      const summaryMatch = generatedText.match(/summary\s*=\s*\[(.*?)\]/is);
      const contextMatch = generatedText.match(/context\s*=\s*\[(.*?)\]/is);

      const summary = summaryMatch
        ? summaryMatch[1]
            .split('",')
            .map((item) => item.replace(/["']/g, "").trim())
            .filter(Boolean)
        : [];

      const context = contextMatch
        ? contextMatch[1]
            .split('",')
            .map((item) => item.replace(/["']/g, "").trim())
            .filter(Boolean)
        : [];

      // Return the aggregated response
      const aggregatedResponse = {
        summary,
        context,
      };

      console.log("Aggregated Response:", aggregatedResponse);

      if (summary.length === 0 || context.length === 0) {
        throw new Error("Empty summary or context received, retrying...");
      }

      return aggregatedResponse; // Return valid response
    } catch (error) {
      attempt++;
      console.error(
        `Error during Hugging Face content generation (Attempt ${attempt}/${MAX_RETRIES}):`,
        error.message
      );

      if (attempt >= MAX_RETRIES) {
        throw new Error(`Failed to generate content after ${MAX_RETRIES} attempts.`);
      }

      // Exponential backoff with jitter
      const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1500;
      console.log(`Retrying after ${backoffTime.toFixed(0)} ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }
}



const transcription = {
  task: 'transcribe',
  language: 'english',
  duration: 107.52999877929688,
  text: "of generations to free a continent and heal a nation, what led young women and young men to sit at lunch counters and brave fire hoses and march through Selma and Montgomery for freedom's cause. Hope, hope is what led me here today with a father from Kenya, a mother from Kansas Hope is the bedrock of this nation, the belief that our destiny will not be written for us but by us, by all those men and women who are not content to settle for the world as it is, who have the courage to remake the world as it should be. That is what we started here in Iowa, and that is the message we can now carry to New York, the one that can change this country, brick by brick, block by block, callous hand by callous hand, that together, ordinary people can do extraordinary things, because we are not a collection of red states and blue states, we are the United States of America, and in this moment, in this election, we are ready to believe again. Thank you, Iowa.",
  words: [
    { word: 'of', start: 0, end: 0.20000000298023224 },
    {
      word: 'generations',
      start: 0.20000000298023224,
      end: 0.8199999928474426
    },
    { word: 'to', start: 0.8199999928474426, end: 1.3600000143051147 },
    {
      word: 'free',
      start: 1.3600000143051147,
      end: 1.5199999809265137
    },
    { word: 'a', start: 1.5199999809265137, end: 2.0999999046325684 },
    {
      word: 'continent',
      start: 2.0999999046325684,
      end: 2.0999999046325684
    },
    { word: 'and', start: 2.0999999046325684, end: 2.619999885559082 },
    { word: 'heal', start: 2.619999885559082, end: 2.859999895095825 },
    { word: 'a', start: 2.859999895095825, end: 3.4600000381469727 },
    {
      word: 'nation',
      start: 3.4600000381469727,
      end: 3.4600000381469727
    },
    { word: 'what', start: 3.880000114440918, end: 3.9200000762939453 },
    { word: 'led', start: 3.9200000762939453, end: 4.179999828338623 },
    { word: 'young', start: 4.179999828338623, end: 4.460000038146973 },
    { word: 'women', start: 4.460000038146973, end: 4.78000020980835 },
    { word: 'and', start: 4.78000020980835, end: 5.400000095367432 },
    { word: 'young', start: 5.400000095367432, end: 5.800000190734863 },
    { word: 'men', start: 5.800000190734863, end: 5.860000133514404 },
    { word: 'to', start: 5.860000133514404, end: 6.099999904632568 },
    { word: 'sit', start: 6.099999904632568, end: 6.28000020980835 },
    { word: 'at', start: 6.28000020980835, end: 6.460000038146973 },
    { word: 'lunch', start: 6.460000038146973, end: 6.679999828338623 },
    {
      word: 'counters',
      start: 6.679999828338623,
      end: 7.039999961853027
    },
    { word: 'and', start: 7.039999961853027, end: 7.539999961853027 },
    { word: 'brave', start: 7.539999961853027, end: 7.800000190734863 },
    { word: 'fire', start: 7.800000190734863, end: 8.319999694824219 },
    { word: 'hoses', start: 8.319999694824219, end: 8.4399995803833 },
    { word: 'and', start: 8.4399995803833, end: 8.960000038146973 },
    { word: 'march', start: 8.960000038146973, end: 9.260000228881836 },
    {
      word: 'through',
      start: 9.260000228881836,
      end: 10.300000190734863
    },
    {
      word: 'Selma',
      start: 10.300000190734863,
      end: 10.300000190734863
    },
    { word: 'and', start: 10.300000190734863, end: 11.079999923706055 },
    {
      word: 'Montgomery',
      start: 11.079999923706055,
      end: 11.079999923706055
    },
    { word: 'for', start: 11.079999923706055, end: 11.640000343322754 },
    {
      word: "freedom's",
      start: 11.640000343322754,
      end: 12.279999732971191
    },
    {
      word: 'cause',
      start: 12.279999732971191,
      end: 12.460000038146973
    },
    { word: 'Hope', start: 22.81999969482422, end: 23.739999771118164 },
    {
      word: 'hope',
      start: 25.299999237060547,
      end: 25.299999237060547
    },
    { word: 'is', start: 25.299999237060547, end: 25.920000076293945 },
    { word: 'what', start: 25.920000076293945, end: 26.18000030517578 },
    { word: 'led', start: 26.18000030517578, end: 26.360000610351562 },
    { word: 'me', start: 26.360000610351562, end: 26.540000915527344 },
    {
      word: 'here',
      start: 26.540000915527344,
      end: 26.760000228881836
    },
    {
      word: 'today',
      start: 26.760000228881836,
      end: 27.079999923706055
    },
    {
      word: 'with',
      start: 27.079999923706055,
      end: 28.200000762939453
    },
    { word: 'a', start: 28.200000762939453, end: 28.65999984741211 },
    {
      word: 'father',
      start: 28.65999984741211,
      end: 28.65999984741211
    },
    { word: 'from', start: 28.65999984741211, end: 29.200000762939453 },
    {
      word: 'Kenya',
      start: 29.200000762939453,
      end: 29.200000762939453
    },
    { word: 'a', start: 29.520000457763672, end: 29.520000457763672 },
    {
      word: 'mother',
      start: 29.520000457763672,
      end: 29.520000457763672
    },
    { word: 'from', start: 29.520000457763672, end: 42.08000183105469 },
    {
      word: 'Kansas',
      start: 42.08000183105469,
      end: 42.08000183105469
    },
    { word: 'Hope', start: 44.2400016784668, end: 44.84000015258789 },
    { word: 'is', start: 44.84000015258789, end: 45.2400016784668 },
    { word: 'the', start: 45.2400016784668, end: 45.459999084472656 },
    {
      word: 'bedrock',
      start: 45.459999084472656,
      end: 45.939998626708984
    },
    { word: 'of', start: 45.939998626708984, end: 46.29999923706055 },
    { word: 'this', start: 46.29999923706055, end: 46.540000915527344 },
    {
      word: 'nation',
      start: 46.540000915527344,
      end: 46.91999816894531
    },
    { word: 'the', start: 47.68000030517578, end: 47.900001525878906 },
    {
      word: 'belief',
      start: 47.900001525878906,
      end: 48.20000076293945
    },
    { word: 'that', start: 48.20000076293945, end: 48.439998626708984 },
    { word: 'our', start: 48.439998626708984, end: 49.08000183105469 },
    {
      word: 'destiny',
      start: 49.08000183105469,
      end: 49.08000183105469
    },
    { word: 'will', start: 49.08000183105469, end: 49.400001525878906 },
    { word: 'not', start: 49.400001525878906, end: 49.68000030517578 },
    { word: 'be', start: 49.68000030517578, end: 50.2400016784668 },
    { word: 'written', start: 50.2400016784668, end: 50.2400016784668 },
    { word: 'for', start: 50.2400016784668, end: 50.65999984741211 },
    { word: 'us', start: 50.65999984741211, end: 50.97999954223633 },
    { word: 'but', start: 50.97999954223633, end: 51.400001525878906 },
    { word: 'by', start: 51.400001525878906, end: 51.7400016784668 },
    { word: 'us', start: 51.7400016784668, end: 52.18000030517578 },
    { word: 'by', start: 52.380001068115234, end: 52.52000045776367 },
    { word: 'all', start: 52.52000045776367, end: 52.939998626708984 },
    {
      word: 'those',
      start: 52.939998626708984,
      end: 53.29999923706055
    },
    { word: 'men', start: 53.29999923706055, end: 53.58000183105469 },
    { word: 'and', start: 53.58000183105469, end: 54.2599983215332 },
    { word: 'women', start: 54.2599983215332, end: 54.2599983215332 },
    { word: 'who', start: 54.2599983215332, end: 54.47999954223633 },
    { word: 'are', start: 54.47999954223633, end: 54.63999938964844 },
    { word: 'not', start: 54.63999938964844, end: 55 },
    { word: 'content', start: 55, end: 55.459999084472656 },
    { word: 'to', start: 55.459999084472656, end: 56.220001220703125 },
    {
      word: 'settle',
      start: 56.220001220703125,
      end: 56.220001220703125
    },
    { word: 'for', start: 56.220001220703125, end: 56.400001525878906 },
    { word: 'the', start: 56.400001525878906, end: 56.68000030517578 },
    {
      word: 'world',
      start: 56.68000030517578,
      end: 56.779998779296875
    },
    { word: 'as', start: 56.779998779296875, end: 56.959999084472656 },
    { word: 'it', start: 56.959999084472656, end: 57.099998474121094 },
    { word: 'is', start: 57.099998474121094, end: 57.31999969482422 },
    { word: 'who', start: 57.58000183105469, end: 57.720001220703125 },
    {
      word: 'have',
      start: 57.720001220703125,
      end: 57.939998626708984
    },
    { word: 'the', start: 57.939998626708984, end: 58.560001373291016 },
    {
      word: 'courage',
      start: 58.560001373291016,
      end: 58.560001373291016
    },
    { word: 'to', start: 58.560001373291016, end: 59.13999938964844 },
    {
      word: 'remake',
      start: 59.13999938964844,
      end: 59.36000061035156
    },
    { word: 'the', start: 59.36000061035156, end: 59.81999969482422 },
    {
      word: 'world',
      start: 59.81999969482422,
      end: 59.939998626708984
    },
    { word: 'as', start: 59.939998626708984, end: 60.380001068115234 },
  ]
}



async function extractDescriptionFromUrl(url) {
  const match = url.match(/\/([^\/]+)(?=\/?$)/);
  if (match) {
    return match[1]
      .split('-')
      .slice(0, -1)
      .join(' '); // Replaces dashes with spaces
  }
  return null; // Return null if no match is found
}

async function getRelevance(query, ccArray) {
  const MAX_RETRIES = 5; // Maximum number of retry attempts
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      // Make the API request
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          inputs: {
            source_sentence: query, // The query sentence
            sentences: ccArray,     // List of sentences to compare
          },
        },
        {
          headers: {
            Authorization: `Bearer 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`, // Your Hugging Face API token
            'Content-Type': 'application/json',
          },
          timeout: 30000, // Set a generous timeout (e.g., 30 seconds)
        }
      );

      // Check if the API response is valid
      if (response.data && Array.isArray(response.data)) {
        // Combine each cc with its corresponding relevance score
        const result = ccArray.map((cc, index) => ({
          query,
          cc,
          relevance: response.data[index], // Match relevance score to each cc
        }));

        console.log('Hugging Face API Response:', JSON.stringify(result, null, 2));
        return result; // Return the formatted result on success
      } else {
        throw new Error('Unexpected response format from Hugging Face API');
      }
    } catch (error) {
      attempt++;
      console.error(`Error fetching relevance scores (Attempt ${attempt}/${MAX_RETRIES}):`, error.response?.data || error.message);

      if (attempt >= MAX_RETRIES) {
        console.error('Max retry attempts reached. Failing gracefully...');
        throw new Error(`Failed to fetch relevance scores after ${MAX_RETRIES} attempts.`);
      }

      // Exponential backoff with jitter
      const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // Delay in ms
      console.log(`Retrying in ${backoffTime.toFixed(0)} ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }
}

const transcription1 = {
  task: 'transcribe',
  language: 'english',
  duration: 49.009,
  text: "You ask yourself why me? Instead ask yourself now what am I going to do about it? What are you going to do about it? Ask yourself that question and then figure it out. Figure out what you're going to do. Say to yourself I am going to detach. I am going to assess the situation. I am going to come up with a plan and I am going to execute and then start moving. It's not going to be a perfect plan but take action. ",
  words: [
    { word: 'You', start: 5.179999828338623, end: 5.820000171661377 },
    { word: 'ask', start: 5.820000171661377, end: 6.139999866485596 },
    {
      word: 'yourself',
      start: 6.139999866485596,
      end: 6.739999771118164
    },
    { word: 'why', start: 6.739999771118164, end: 8.180000305175781 },
    { word: 'me', start: 8.180000305175781, end: 8.539999961853027 },
    {
      word: 'Instead',
      start: 11.220000267028809,
      end: 11.460000038146973
    },
    { word: 'ask', start: 11.460000038146973, end: 11.899999618530273 },
    {
      word: 'yourself',
      start: 11.899999618530273,
      end: 12.300000190734863
    },
    { word: 'now', start: 12.300000190734863, end: 12.819999694824219 },
    {
      word: 'what',
      start: 12.819999694824219,
      end: 13.100000381469727
    },
    { word: 'am', start: 13.100000381469727, end: 13.5 },
    { word: 'I', start: 13.5, end: 13.640000343322754 },
    {
      word: 'going',
      start: 13.640000343322754,
      end: 13.880000114440918
    },
    { word: 'to', start: 13.880000114440918, end: 14.319999694824219 },
    { word: 'do', start: 14.319999694824219, end: 14.460000038146973 },
    {
      word: 'about',
      start: 14.460000038146973,
      end: 14.760000228881836
    },
    { word: 'it', start: 16.239999771118164, end: 16.8799991607666 },
    { word: 'What', start: 16.8799991607666, end: 17.520000457763672 },
    { word: 'are', start: 17.520000457763672, end: 17.65999984741211 },
    { word: 'you', start: 17.65999984741211, end: 17.700000762939453 },
    {
      word: 'going',
      start: 17.700000762939453,
      end: 17.84000015258789
    },
    { word: 'to', start: 17.84000015258789, end: 18 },
    { word: 'do', start: 18, end: 18.15999984741211 },
    {
      word: 'about',
      start: 18.15999984741211,
      end: 18.360000610351562
    },
    { word: 'it', start: 18.360000610351562, end: 18.65999984741211 },
    { word: 'Ask', start: 18.65999984741211, end: 18.68000030517578 },
    {
      word: 'yourself',
      start: 18.68000030517578,
      end: 18.920000076293945
    },
    {
      word: 'that',
      start: 18.920000076293945,
      end: 19.299999237060547
    },
    {
      word: 'question',
      start: 19.299999237060547,
      end: 19.760000228881836
    },
    { word: 'and', start: 19.760000228881836, end: 22.1200008392334 },
    { word: 'then', start: 22.1200008392334, end: 22.84000015258789 },
    {
      word: 'figure',
      start: 22.84000015258789,
      end: 24.360000610351562
    },
    { word: 'it', start: 24.360000610351562, end: 24.600000381469727 },
    { word: 'out', start: 24.600000381469727, end: 25.540000915527344 },
    {
      word: 'Figure',
      start: 26.540000915527344,
      end: 26.559999465942383
    },
    { word: 'out', start: 26.559999465942383, end: 26.780000686645508 },
    { word: 'what', start: 26.780000686645508, end: 27.18000030517578 },
    {
      word: "you're",
      start: 27.18000030517578,
      end: 27.600000381469727
    },
    {
      word: 'going',
      start: 27.600000381469727,
      end: 27.600000381469727
    },
    { word: 'to', start: 27.600000381469727, end: 27.84000015258789 },
    { word: 'do', start: 27.84000015258789, end: 27.979999542236328 },
    { word: 'Say', start: 28.31999969482422, end: 28.34000015258789 },
    { word: 'to', start: 28.34000015258789, end: 28.719999313354492 },
    {
      word: 'yourself',
      start: 28.719999313354492,
      end: 28.719999313354492
    },
    { word: 'I', start: 28.719999313354492, end: 28.979999542236328 },
    { word: 'am', start: 28.979999542236328, end: 29.15999984741211 },
    {
      word: 'going',
      start: 29.15999984741211,
      end: 29.299999237060547
    },
    { word: 'to', start: 29.299999237060547, end: 29.860000610351562 },
    {
      word: 'detach',
      start: 29.860000610351562,
      end: 30.459999084472656
    },
    { word: 'I', start: 31.059999465942383, end: 31.059999465942383 },
    { word: 'am', start: 31.059999465942383, end: 31.260000228881836 },
    {
      word: 'going',
      start: 31.260000228881836,
      end: 31.440000534057617
    },
    { word: 'to', start: 31.440000534057617, end: 32.68000030517578 },
    {
      word: 'assess',
      start: 32.68000030517578,
      end: 32.959999084472656
    },
    { word: 'the', start: 32.959999084472656, end: 33.400001525878906 },
    {
      word: 'situation',
      start: 33.400001525878906,
      end: 33.7599983215332
    },
    { word: 'I', start: 34.2400016784668, end: 34.2599983215332 },
    { word: 'am', start: 34.2599983215332, end: 34.5 },
    { word: 'going', start: 34.5, end: 34.5 },
    { word: 'to', start: 34.5, end: 34.7400016784668 },
    { word: 'come', start: 34.7400016784668, end: 34.91999816894531 },
    { word: 'up', start: 34.91999816894531, end: 35.08000183105469 },
    { word: 'with', start: 35.08000183105469, end: 35.20000076293945 },
    { word: 'a', start: 35.20000076293945, end: 35.540000915527344 },
    {
      word: 'plan',
      start: 35.779998779296875,
      end: 35.779998779296875
    },
    { word: 'and', start: 35.779998779296875, end: 36.08000183105469 },
    { word: 'I', start: 36.08000183105469, end: 36.41999816894531 },
    { word: 'am', start: 36.41999816894531, end: 36.63999938964844 },
    {
      word: 'going',
      start: 36.63999938964844,
      end: 36.880001068115234
    },
    { word: 'to', start: 36.880001068115234, end: 37.86000061035156 },
    {
      word: 'execute',
      start: 37.86000061035156,
      end: 37.86000061035156
    },
    { word: 'and', start: 37.86000061035156, end: 41.36000061035156 },
    { word: 'then', start: 41.36000061035156, end: 41.86000061035156 },
    {
      word: 'start',
      start: 41.86000061035156,
      end: 43.060001373291016
    },
    {
      word: 'moving',
      start: 43.060001373291016,
      end: 44.099998474121094
    },
    { word: "It's", start: 45.2400016784668, end: 45.880001068115234 },
    { word: 'not', start: 45.880001068115234, end: 46.119998931884766 },
    {
      word: 'going',
      start: 46.119998931884766,
      end: 46.29999923706055
    },
    { word: 'to', start: 46.29999923706055, end: 46.400001525878906 },
    { word: 'be', start: 46.400001525878906, end: 46.47999954223633 },
    { word: 'a', start: 46.47999954223633, end: 46.7599983215332 },
    {
      word: 'perfect',
      start: 46.7599983215332,
      end: 46.900001525878906
    },
    { word: 'plan', start: 46.900001525878906, end: 47.29999923706055 },
    { word: 'but', start: 47.29999923706055, end: 47.81999969482422 },
    { word: 'take', start: 47.81999969482422, end: 48.47999954223633 },
    {
      word: 'action',
      start: 48.47999954223633,
      end: 49.08000183105469
    },
    
  ]
}

async function splitTranscript(transcription) {
  const { text, words } = transcription;

  // Split the text into sentences based on punctuation
  const sentences = text.match(/[^.!?]+[.!?]/g) || [];
  const sentenceSegments = [];
  
  let currentWordIndex = 0;
  let chunkStartTime = null;
  let chunkEndTime = null;
  let chunkWords = [];
  let chunkText = "";

  for (const sentence of sentences) {
    // Get words corresponding to the current sentence
    const sentenceWords = [];
    while (
      currentWordIndex < words.length &&
      sentence.includes(words[currentWordIndex].word)
    ) {
      sentenceWords.push(words[currentWordIndex]);
      currentWordIndex++;
    }

    for (const wordInfo of sentenceWords) {
      const { word, start, end } = wordInfo;

      if (!chunkStartTime) chunkStartTime = start; // Set chunk start time
      chunkEndTime = end; // Update chunk end time
      chunkWords.push(wordInfo);
      chunkText += word + " ";

      // Check if the chunk duration exceeds 10 seconds
      if (chunkEndTime - chunkStartTime > 10) {
        // Finalize the current chunk
        sentenceSegments.push({
          text: chunkText.trim(),
          start: chunkStartTime.toFixed(2),
          end: chunkWords[chunkWords.length - 2].end.toFixed(2), // Ensure the last word ends within 10 seconds
        });

        // Reset for the next chunk
        chunkStartTime = chunkWords[chunkWords.length - 1].start;
        chunkWords = [chunkWords[chunkWords.length - 1]];
        chunkText = word + " ";
      }
    }

    // Finalize the last chunk of the sentence if it doesn't exceed 10 seconds
    if (chunkWords.length > 0) {
      sentenceSegments.push({
        text: chunkText.trim(),
        start: chunkStartTime.toFixed(2),
        end: chunkEndTime.toFixed(2),
      });

      // Reset chunk variables
      chunkWords = [];
      chunkText = "";
      chunkStartTime = null;
      chunkEndTime = null;
    }
  }

  return sentenceSegments;
}

async function getContextAsKeywords(inputText) {
  const apiKey = OPENAI_API_KEY; // Replace with your OpenAI API key
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const prompt = `
You are an AI assistant. Analyze the text and return top 3 relevant topics(what is it about?). Return the extracted topics an array format like ['topic 1', 'topic 2', 'topic 3'].

Text: "${inputText}"

Keywords:
`;

  try {
    const response = await axios.post(
      apiUrl,
      {
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the response text
    const gptResponse = response.data.choices[0].message.content.trim();
    const cleanResponse = gptResponse
      // .replace(/[\[\]']+/g, '')  // Remove square brackets and single quotes
      .replace(/-/g, ' ').replace(/[\[\]']+/g, '')
      .split(",")                 // Split the remaining string into an array of keywords
      .map((item) => item.trim()); // Trim any extra spaces

    return cleanResponse;  // Return the cleaned-up array

  } catch (error) {
    console.error("Error fetching keywords from GPT-4:", error.message);
    return [];
  }
}


// (async () => {
//   const size = 'small';
//   const orientation = "portrait";
//   const max_duration = 30;
//   const finalArray = [];

//   const split10secondsEach = await splitTranscript(transcription1);

//   // Function to retry an async operation
//   async function retryAsyncOperation(operation, maxRetries, delay) {
//     let retries = 0;
//     while (retries < maxRetries) {
//       try {
//         return await operation(); // Try the operation
//       } catch (error) {
//         retries++;
//         if (retries === maxRetries) {
//           throw error; // Throw the error if max retries reached
//         }
//         console.warn(`Retrying... Attempt ${retries}/${maxRetries}`);
//         await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
//       }
//     }
//   }

//   for (const textToLambda of split10secondsEach) {
//     const splitTranscript = textToLambda.text;

//     const processSplitTranscript = async () => {
//       let generateResponse = [ ];
//       let attempt = 0;

//       // Retry logic for generating content until summary and context are not empty
//       while (attempt < 3) {
//         attempt++;
//         generateResponse = await getContextAsKeywords(splitTranscript);
//         console.log('generateResponse : ', generateResponse);

//         if (
//           generateResponse.length > 0
          
//         ) {
//           break; // Exit the retry loop if response is valid
//         }

//         console.warn(
//           `Empty response detected. Retrying generateContent... Attempt ${attempt}/3`
//         );

//         // Wait for 5 seconds before retrying
//         if (attempt < 3) {
//           await new Promise((resolve) => setTimeout(resolve, 5000));
//         }
//       }

//       if (
//         generateResponse.length === 0
//       ) {
//         throw new Error(
//           `Failed to generate valid content after 3 attempts for: ${splitTranscript}`
//         );
//       }

//       const sentences = generateResponse;


//       const timeSlotObj = {
//         timeSlot: `${textToLambda.start}-${textToLambda.end}`,
//         queries: [],
//       };

//       let highestRelevance = -1; // Track highest relevance across all queries
//       let bestQuery = null; // Store the best query object with highest relevance

//       for (const query of sentences) {
//         console.log('query : ', query);
//         try {
//           let page = 1;
//           let queryBestVideo = null; // Track best video for this query
//           let queryHighestRelevance = -1; // Track the highest relevance for this query

//           // Limit to 2 pages of search results
//           while (page <= 2) {
//             const pexelsResponse = await client.videos.search({
//               query,
//               size,
//               orientation,
//               max_duration,
//               per_page: 25,
//               page,
//             });

//             if (pexelsResponse.videos.length === 0) {
//               break; // Stop if no more videos are found
//             }

//             // Extract descriptions (cc) for all videos
//             const descriptions = await Promise.all(
//               pexelsResponse.videos.map((video) =>
//                 extractDescriptionFromUrl(video.url)
//               )
//             );

//             // Calculate relevance for all videos
//             const relevances = await getRelevance(query, descriptions);

//             // Find the video with the highest relevance for this query
//             relevances.forEach((relevance, index) => {
//               if (relevance.relevance > queryHighestRelevance) {
//                 queryHighestRelevance = relevance.relevance;
//                 queryBestVideo = {
//                   video_id: pexelsResponse.videos[index].id,
//                   url: pexelsResponse.videos[index].url,
//                   cc: relevance.cc,
//                   relevance: relevance.relevance,
//                 };
//               }
//             });

//             page += 1;
//           }

//           // Update the best query if this query's highest relevance is the highest overall
//           if (queryBestVideo && queryHighestRelevance > highestRelevance) {
//             highestRelevance = queryHighestRelevance;
//             bestQuery = {
//               Query: query,
//               BestVideo: queryBestVideo,
//             };
//           }
//         } catch (pexelsError) {
//           console.error(`Error fetching videos for query "${query}":`, pexelsError);
//         }
//       }

//       // Add the query with the highest relevance for this time slot
//       if (bestQuery) {
//         timeSlotObj.queries.push(bestQuery);
//       }

//       finalArray.push(timeSlotObj);
//     };

//     // Retry the processing of the splitTranscript
//     try {
//       await retryAsyncOperation(processSplitTranscript, 3, 5000); // Retry 3 times with a 5-second delay
//     } catch (error) {
//       console.error(`Failed to process segment [${textToLambda.start}-${textToLambda.end}] after retries:`, error);
//     }
//   }

//   console.log("Final Array:", JSON.stringify(finalArray, null, 2));

//   const newAudioRecord = new AudioMetrics({
//     user_id: '6755af8e399ae624909a65b6',
//     transcript: transcription.text,
//     transcriptWithTimeStamp: transcription.words,
//     videoUrls: finalArray,
//   });

//   await newAudioRecord.save();
// })();



(async () => {
  const size = 'small';
  const orientation = "portrait";
  const max_duration = 30;
  const finalArray = [];

  const split10secondsEach = await splitTranscript(transcription1);

  // Function to retry an async operation
  async function retryAsyncOperation(operation, maxRetries, delay) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        return await operation(); // Try the operation
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw error; // Throw the error if max retries reached
        }
        console.warn(`Retrying... Attempt ${retries}/${maxRetries}`);
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
      }
    }
  }

  for (const textToLambda of split10secondsEach) {
    const splitTranscript = textToLambda.text;

    const processSplitTranscript = async () => {
      let generateResponse = [];
      let attempt = 0;

      // Retry logic for generating content until summary and context are not empty
      while (attempt < 3) {
        attempt++;
        generateResponse = await getContextAsKeywords(splitTranscript);
        console.log('generateResponse : ', generateResponse);

        if (generateResponse.length > 0) {
          break; // Exit the retry loop if response is valid
        }

        console.warn(
          `Empty response detected. Retrying generateContent... Attempt ${attempt}/3`
        );

        // Wait for 5 seconds before retrying
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      if (generateResponse.length === 0) {
        throw new Error(
          `Failed to generate valid content after 3 attempts for: ${splitTranscript}`
        );
      }

      const sentences = generateResponse;

      const timeSlotObj = {
        timeSlot: `${textToLambda.start}-${textToLambda.end}`,
        queries: [],
      };

      let highestRelevance = -1; // Track highest relevance across all queries
      let bestQuery = null; // Store the best query object with highest relevance

      for (const query of sentences) {
        console.log('query : ', query);
        try {
          let page = 1;
          let queryBestVideo = null; // Track best video for this query
          let queryHighestRelevance = -1; // Track the highest relevance for this query

          // Limit to 2 pages of search results
          while (page <= 2) {
            const pexelsResponse = await client.videos.search({
              query,
              size,
              orientation,
              max_duration,
              per_page: 75,
              page,
            });

            if (pexelsResponse.videos.length === 0) {
              break; // Stop if no more videos are found
            }

            // Extract descriptions (cc) for all videos
            const descriptions = await Promise.all(
              pexelsResponse.videos.map((video) =>
                extractDescriptionFromUrl(video.url)
              )
            );

            // Calculate relevance for all videos
            const relevances = await getRelevance(query, descriptions);

            // Find the video with the highest relevance for this query
            relevances.forEach((relevance, index) => {
              if (relevance.relevance > queryHighestRelevance) {
                queryHighestRelevance = relevance.relevance;
                queryBestVideo = {
                  video_id: pexelsResponse.videos[index].id,
                  url: pexelsResponse.videos[index].url,
                  cc: relevance.cc,
                  relevance: relevance.relevance,
                };
              }
            });

            page += 1;
          }

          // Update the best query if this query's highest relevance is the highest overall
          if (queryBestVideo && queryHighestRelevance > highestRelevance) {
            // Check if the video is already used in finalArray
            const isVideoUsed = finalArray.some((timeSlot) =>
              timeSlot.queries.some(
                (query) => query.BestVideo.video_id === queryBestVideo.video_id
              )
            );

            if (!isVideoUsed) {
              highestRelevance = queryHighestRelevance;
              bestQuery = {
                Query: query,
                BestVideo: queryBestVideo,
              };
            }
          }
        } catch (pexelsError) {
          console.error(`Error fetching videos for query "${query}":`, pexelsError);
        }
      }

      // Add the query with the highest relevance for this time slot if it passes the duplicate check
      if (bestQuery) {
        timeSlotObj.queries.push(bestQuery);
        finalArray.push(timeSlotObj);
      }
    };

    // Retry the processing of the splitTranscript
    try {
      await retryAsyncOperation(processSplitTranscript, 3, 5000); // Retry 3 times with a 5-second delay
    } catch (error) {
      console.error(`Failed to process segment [${textToLambda.start}-${textToLambda.end}] after retries:`, error);
    }
  }

  console.log("Final Array:", JSON.stringify(finalArray, null, 2));

  const newAudioRecord = new AudioMetrics({
    user_id: '6755af8e399ae624909a65b6',
    transcript: transcription.text,
    transcriptWithTimeStamp: transcription.words,
    videoUrls: finalArray,
  });

  await newAudioRecord.save();
})();








// Example usage
// const inputText =
//   "ask yourself why me? Instead ask yourself now what am I going to do about it? What are you going to do about it?";

// getContextAsKeywords(inputText).then((keywords) =>
//   console.log("Extracted Keywords:", keywords)
// );








router.post('/uploadMp3', upload.single('file'), async (req, res) => {
  
  try {
    // Step 1: Check if the file was uploaded


    if (!req.file) {
      return res.status(400).send({ error: 'No file uploaded' });
    }

    console.log('File path:', req.file.path);

    // Step 2: Ensure the file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).send({ error: 'Uploaded file not found on server' });
    }

    // Step 3: Send the file to OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: 'whisper-1',
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });

    console.log('Transcription:', transcription);

    // Step 4: Send the transcription text back to the client
    res.send({ message: 'File uploaded successfully', transcription });
  } catch (error) {
    console.error('Error:', error.message || error);
    res.status(500).send({ error: 'An error occurred during transcription' });
  } finally {
    // Step 5: Clean up uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
});


router.post("/signup-user", async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const lowerCaseEmail = email.toLowerCase();
    const pin = generatePin();


    const options = {
      to: email,
      subject: "Verify Account - EmailSender",
      text: `Your 6-digit PIN: ${pin}`,
  }


    const existingUser = await UserOnPlatform.findOne({ email: lowerCaseEmail });
    const existingUserInTemp = await TempUserOnPlatform.findOne({ email : lowerCaseEmail});

   
    if (!lowerCaseEmail || !password ) {
      return res.status(400).send({
         error: "All fields are mandatory",
         data: null,
         message: "Please provide all fields",
       });
     }

    else if (existingUser) {
      return res.status(400).send({
        error: "User already exists",
        data: null,
        message: "User already exists with the same email address. Please login to continue.",
      });
    }

    else if(existingUserInTemp){

      existingUserInTemp.password = hashedPassword;
      existingUserInTemp.brand_name = brand;
      existingUserInTemp.reset_pin = pin;
      existingUserInTemp.save();
      await sendMail(options);

     return res.status(200).send({ success: true });

    }

    else{

    await TempUserOnPlatform.create({
      email: lowerCaseEmail,
      password: hashedPassword,
      reset_pin : pin
    });
    await sendMail(options);

    return res.status(200).send({ success: true });
  }
  } catch (error) {
    // return next(new ErrorHandler(error.message, 500));
  }
});

router.post("/signup-user-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;
    const name = firstName + " " + lastName;
    const user = await UserOnPlatform.findOne({ email });

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


router.post("/check-resetPin-withDb-brandTemps", async function (req, res) {

  const { email, pin } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  const pinAsInt = parseInt(pin);
  
  TempUserOnPlatform.findOne({ email : lowerCaseEmail}).then(async (result)=>{

    if(result.reset_pin === pinAsInt){

      await UserOnPlatform.create({
        email: lowerCaseEmail,
        password: result.password,
        reset_pin : pin,
      });

      await TempUserOnPlatform.deleteOne({ email: lowerCaseEmail  });


  res.status(200).send({ matching: true, email: email});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post("/user-login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        error: "All fields are mandatory",
        data: null,
        message: "Please provide all fields",
      });
    }

    const user = await UserOnPlatform.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).send({
        error: "User does not exist!",
        data: null,
        message: "User does not exist!",
      });
    }

    // Compare passwords
    bcrypt.compare(password, user.password, async function (err1, result) {
      if (err1) {
        return res.status(500).send({
          error: "Internal error",
          message: "Error during password verification",
          data: null,
        });
      }

      if (result) {
        const tokenResponse = await createToken(user, res);
        return res.status(200).send({
          success: true,
          message: "Login successful",
          data: tokenResponse,
        });
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid email or password",
          data: null,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Internal server error. Please try again.",
      data: null,
    });
  }
});


router.post("/user-login-gmail", async (req, res, next) => {


  try {
    const { email, firstName, lastName, picture } = req.body;

    const user = await UserOnPlatform.findOne({ email });

    const name = firstName + " " + lastName;

    if (!user) {

      await UserOnPlatform.create({
        email: email,
        name: name,
        picture: picture,
        is_google_user : true
      });

    const createdUser = await UserOnPlatform.findOne({ email });

      createToken(createdUser, res);

    }

    else{

      createToken(user, res);

    }

  
  } catch (error) {
    return res.status(500).send({
      error: "Internal server error",
      data: null,
      message: "An error occurred",
    });
  }
});


  
  router.post('/get-user-details', async function (req, res){

    const userId = req.body.userId;
  
    USER.findById(userId).then((result)=>{
  
      if(result){
  
      res.status(200).send({ data: result});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: null });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });

  router.post("/change-password", async function (req, res) {

    const { userId, password, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
  
    USER.findById(userId).select("+hashPassword").then((result)=>{
  
      if(result){
  
        bcrypt.compare(password, result.password, async function (err1, ress) {
          if (ress === true) {
  
            await USER.findByIdAndUpdate(result._id, { password: hashedPassword,  updated_at: Date.now() });
            res.status(200).send({ success: true});
            res.end();
          
    
          } else {
            return res.status(400).send({
              error: "Wrong current password",
              data: null,
              message: "Wrong current password",
            });
          }
    
        });
  
      }
  
      else{
  
        res.status(200).send({ success: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  });

  router.post("/check-email-exists-sendMail", async function (req, res) {

    const { email } = req.body;
    const pin = generatePin();
  
    
    USER.findOne({ email : email}).then( async (result)=>{
  
      if(result){
  
        const options = {
          to: email,
          subject: "Password Reset PIN - BroadReach",
          text: `Your 6-digit PIN: ${pin}`,
      }
  
      await USER.findByIdAndUpdate(result._id, { reset_pin: pin });
      await sendMail(options);
  
      res.status(200).send({ exists : true, emailSent: true});
      res.end();
  
  
      }
  
      else{
  
        res.status(200).send({ exists: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  
  });

  router.post("/check-resetPin-withDb", async function (req, res) {

    const { email, pin } = req.body;
    const pinAsInt = parseInt(pin);
    
    USER.findOne({ email : email}).then(async (result)=>{
  
      if(result.reset_pin === pinAsInt){
  
    res.status(200).send({ matching: true, email: email});
    res.end();
  
      }
  
      else{
  
        res.status(200).send({ matching: false});
        res.end();
  
      }
  
    }).catch((err) =>{
  
    })
  
  });

  router.post("/update-password", async function (req, res) {

    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    
    USER.findOne({ email : email}).then(async (result)=>{
  
      if(result){
  
        await USER.findByIdAndUpdate(result._id, { password: hashedPassword });
   
    res.status(200).send({ success: true});
    res.end();
  
  
      }
  
      else{
  
        res.status(200).send({ success: false});
        res.end();
  
  
      }
  
    }).catch((err) =>{
  
    })
  
  });


  




module.exports = router;
