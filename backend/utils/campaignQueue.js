// const Queue = require('bull');
// const mongoose = require('mongoose');
// const ContactModel = require('../models/Contacts'); // Contact schema
// const BatchModel = require('../models/Batches');    // Batch schema

// // Initialize Redis-backed Bull queue
// const campaignQueue = new Queue('campaignQueue', {
//   redis: {
//     host: '127.0.0.1',
//     port: 6379 
//   }
// });

// // Helper function to generate a random time delay between 1 and 30 minutes
// const getRandomDelay = (min = 1, max = 3) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };

// // Process job function
// campaignQueue.process(async (job, done) => {
//   try {
//     const { userId, campaignId, tags } = job.data;

//     // Batch size (configurable)
//     const batchSize = 1;

//     let processedContacts = new Set(); // To avoid duplicates
//     let lastId = null; // For pagination
//     let currentTime = Date.now();
//     let batchIndex = 0; // For batch tracking
//     const usedTimestamps = new Set(); // Avoid conflicting batch start times

//     while (true) {
//       // Query for contacts, handling pagination and filtering by tags
//       const query = lastId
//         ? { user_id: userId, tags: { $in: tags }, _id: { $gt: lastId } }
//         : { user_id: userId, tags: { $in: tags } };

//       // Fetch contacts in chunks
//       const contacts = await ContactModel.find(query).limit(batchSize);

//       if (contacts.length === 0) break; // Exit if no more contacts

//       let batch = [];
//       for (const contact of contacts) {
//         if (!processedContacts.has(contact._id.toString())) {
//           batch.push(contact._id);
//           processedContacts.add(contact._id.toString());
//         }
//       }

//       // Assign random unique delay for batch start time
//       let randomDelay, batchWillStartAt;
//       do {
//         randomDelay = getRandomDelay(); // Generate random delay
//         batchWillStartAt = new Date(currentTime + randomDelay * 60 * 1000); // Convert minutes to milliseconds
//       } while (usedTimestamps.has(batchWillStartAt.getTime()));

//       usedTimestamps.add(batchWillStartAt.getTime()); // Mark the timestamp as used

//       // Save batch to the Batches collection
//       if (batch.length > 0) {
//         await BatchModel.create({
//           user_id: userId,
//           campaign_id: campaignId,
//           tag: tags.join(', '),
//           contacts: batch,
//           batch_will_starts_at: batchWillStartAt,
//         });

//         console.log(`Batch ${batchIndex + 1} created with start time: ${batchWillStartAt}`);
//       }

//       // Update lastId for pagination
//       lastId = contacts[contacts.length - 1]._id;
//       batchIndex++;
//     }

//     console.log(`Campaign job completed for campaign ID: ${campaignId}`);
//     done(); // Mark the job as complete
//   } catch (error) {
//     console.error('Error processing campaign job:', error);
//     done(error); // Mark the job as failed
//   }
// });

// module.exports = campaignQueue;
