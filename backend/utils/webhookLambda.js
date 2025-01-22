// const { MongoClient } = require("mongodb");

// const username = "sweetcornermail";
// const password = "rL3Sn4tKuU1npsNA";
// const mongoURI = `mongodb+srv://${username}:${password}@cluster-sc.euxgt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-SC`;
// const dbName = "test";

// exports.handler = async (event) => {
//   const client = new MongoClient(mongoURI);

//   try {
//     // Parse the incoming event body
//     const body = JSON.parse(event.body);

//     // Connect to MongoDB
//     await client.connect();
//     const db = client.db(dbName);
//     const emailMetricsCollection = db.collection("email_metrics");

//     // Process each event in the body
//     for (const eventData of body) {
//       const {
//         event: eventType,
//         email,
//         timestamp,
//         sg_event_id,
//         sg_message_id: messageId,
//       } = eventData;

//       console.log(`Event Type: ${eventType}`);
//       console.log(`Email: ${email}`);
//       console.log(`Timestamp: ${timestamp}`);
//       console.log(`SendGrid Event ID: ${sg_event_id}`);
//       console.log(`SendGrid Message ID: ${messageId}`);

//       // Check if a record with the given message_id exists
//       const existingRecord = await emailMetricsCollection.findOne({ message_id: messageId });

//       const updateData = {};
//       switch (eventType) {
//         case "delivered":
//           updateData.mail_delivered = true;
//           break;
//         case "open":
//           updateData.mail_opened = true;
//           updateData.$push = { mail_opened_timestamps: timestamp };
//           break;
//         case "bounce":
//           updateData.mail_bounced = true;
//           break;
//         case "click":
//           updateData.mail_clicked = true;
//           break;
//         case "dropped":
//           updateData.mail_dropped = true;
//           break;
//         case "spamreport":
//           updateData.mail_spam_reported = true;
//           break;
//         case "unsubscribe":
//           updateData.mail_unsubscribed = true;
//           break;
//         default:
//           console.log(`Unhandled event type: ${eventType}`);
//       }

//       if (existingRecord) {
//         console.log(`Updating existing record for message_id: ${messageId}`);
      
//         // Build the update object using the aggregation pipeline
//         const pipeline = [
//           {
//             $set: {
//               mail_delivered: updateData.mail_delivered || existingRecord.mail_delivered,
//               mail_opened: updateData.mail_opened || existingRecord.mail_opened,
//               mail_clicked: updateData.mail_clicked || existingRecord.mail_clicked,
//               mail_bounced: updateData.mail_bounced || existingRecord.mail_bounced,
//               mail_dropped: updateData.mail_dropped || existingRecord.mail_dropped,
//               mail_unsubscribed: updateData.mail_unsubscribed || existingRecord.mail_unsubscribed,
//               mail_spam_reported: updateData.mail_spam_reported || existingRecord.mail_spam_reported,
//             }
//           },
//           // Only if it's an open event, push the timestamp into the array
//           ...(eventType === "open" ? [
//             {
//               $addFields: {
//                 mail_opened_timestamps: {
//                   $concatArrays: [
//                     existingRecord.mail_opened_timestamps || [],
//                     [timestamp]
//                   ]
//                 }
//               }
//             }
//           ] : []),
//         ];
      
//         // Apply the aggregation pipeline update
//         await emailMetricsCollection.updateOne(
//           { message_id: messageId },
//           pipeline
//         );
//       } else {
//         console.log(`Creating a new record for message_id: ${messageId}`);
//         await emailMetricsCollection.insertOne({
//           message_id: messageId,
//           email: email,
//           mail_delivered: eventType === "delivered",
//           mail_opened: eventType === "open",
//           mail_clicked: eventType === "click",
//           mail_bounced: eventType === "bounce",
//           mail_dropped: eventType === "dropped",
//           mail_unsubscribed: eventType === "unsubscribe",
//           mail_spam_reported: eventType === "spamreport",
//           mail_opened_timestamps: eventType === "open" ? [timestamp] : [],
//         });
//       }
      
      
      
      
//     }

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ message: "Webhook processed successfully" }),
//     };
//   } catch (error) {
//     console.error("Error processing webhook:", error);

//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal Server Error" }),
//     };
//   } finally {
//     await client.close();
//   }
// };
