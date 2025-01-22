const express = require('express');
const jwt = require("jsonwebtoken");
const dbConnection = require("./db");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
dbConnection();
const usersOnBoard = require("./routes/usersOn");
const URL = require("../backend/models/Url");
// const userAgent = require("express-useragent");
const axios = require("axios");
app.use(express.json());
// app.use(userAgent.express());
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));

const corsOptions = {
  origin: 'https://localhost:4900',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// const corsOptions = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
//   optionSuccessStatus: 200,
//   changeOrigin: true,
// };

// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });



app.use("/usersOn", usersOnBoard);




// app.get('/:shortId', async (req, res) => {
  
//     try {
//       const ipApiResponse = await axios.get('https://ipapi.co/json/');
  
//       const shortId = req.params.shortId;
//       const ipAddress = ipApiResponse.data.ip;
//     //   const pixelCode = `
//     //   <!-- Your meta ad pixel code goes here -->
//     //   <img src="https://example.com/pixel.gif?shortId=${shortId}&ipAddress=${ipAddress}" style="display:none;" />
//     // `;
  
//       // Check if the IP address already exists in the visit history
//       const existingEntry = await URL.findOne({
//         shortId,
//         'uniqueVisitors.ipAddress': ipAddress,
//       });
  
//       if (!existingEntry) {
//         // IP address does not exist, update the document
//         const entry = await URL.findOneAndUpdate(
//           { shortId },
//           {
//             $push: {
//               uniqueVisitors: {
//                   timestamp: Date.now(),
//                   country: ipApiResponse.data.country_name,
//                   region: ipApiResponse.data.region,
//                   city: ipApiResponse.data.city,
//                   postal: ipApiResponse.data.postal,
//                   ipAddress: ipAddress,
//                 },
//               },
//             },
//             { new: true } // Return the updated document
//           );
    
//           res.redirect(entry.redirectUrl);
//         //   res.send(`
//         //   <html>
//         //     <head>
//         //       <title>Redirecting...</title>
//         //     </head>
//         //     <body>
              
//         //       <script>
//         //         window.location.href = '${entry.redirectUrl}';
//         //       </script>
//         //     </body>
//         //   </html>
//         // `);

//         } else {
//           // IP address already exists, redirect happens but visitHistory will not be updated.
      
//           const repeatentry = await URL.findOneAndUpdate(
//             { shortId },
//             {
//               $push: {
//                 repeatVisitors: {
//                     timestamp: Date.now(),
//                     country: ipApiResponse.data.country_name,
//                     region: ipApiResponse.data.region,
//                     city: ipApiResponse.data.city,
//                     postal: ipApiResponse.data.postal,
//                     ipAddress: ipAddress,
//                   },
//                 },
//               },
//               { new: true } // Return the updated document
//             );
      
//             res.redirect(repeatentry.redirectUrl);

//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal Server Error');
//       }
//     });

// app.post('/', async (req, res) => {
//   const shortId = req.body.shortId;

//   try {
//     const ipApiResponse = await axios.get('https://ipapi.co/json/');
//     const ipAddress = ipApiResponse.data.ip;
//     const deviceType = req.useragent.isMobile ? 'Mobile' : req.useragent.isDesktop ? 'Desktop' : 'Unknown';
//     const browser = req.useragent.browser || 'Unknown';
//     const referrer = req.get('referrer') || req.get('referer') || 'Direct';
    

//     const existingEntry = await URL.findOne({
//       shortId,
//       'uniqueVisitors.ipAddress': ipAddress,
//     });

//     if (existingEntry) {
//       // IP address already exists, redirect happens but visitHistory will not be updated.
//       const repeatEntry = await URL.findOneAndUpdate(
//         { shortId },
//         {
//           $push: {
//             repeatVisitors: {
//               timestamp: Date.now(),
//               country: ipApiResponse.data.country_name,
//               region: ipApiResponse.data.region,
//               city: ipApiResponse.data.city,
//               postal: ipApiResponse.data.postal,
//               ipAddress: ipAddress,
//               deviceType: deviceType,
//               browser: browser,
//               referrer: referrer,
//             },
//           },
//         },
//         { new: true } // Return the updated document
//       );

//       if (existingEntry.linkType === 'pdf' && existingEntry.passwordProtected === true) {
//         // Handle PDF case: Show the PDF to the user
//         res.setHeader('Content-Type', 'application/pdf');
//         res.status(200).send({
//           linkType: 'pdf',
//           pdfData: existingEntry.pdfFile,
//           passwordProtected: true // Include the PDF data here
//         });
        
//       }
      
//       else if (existingEntry.linkType === 'pdf' && existingEntry.passwordProtected === false) {
//         // Handle PDF case: Show the PDF to the user
//         res.setHeader('Content-Type', 'application/pdf');
//         res.status(200).send({
//           linkType: 'pdf',
//           pdfData: existingEntry.pdfFile,
//           passwordProtected: false // Include the PDF data here
//         });
        
//       }

//       else if (existingEntry.linkType === 'url' && existingEntry.hasSocialSharing) {
//         // Handle URL case: Send HTML response with OG meta tags
//         const htmlResponse = getHtmlResponse(existingEntry.socialTitle, existingEntry.socialDescription, existingEntry.socialImage, existingEntry.redirectUrl);
//         res.status(200).send({ linkType: 'url', data: htmlResponse, urlDetails : existingEntry, redirectUrl: existingEntry.redirectUrl });
 
//       }
//       else if (existingEntry.linkType === 'url' && !existingEntry.hasSocialSharing) {
//         // Handle URL case: Send HTML response with OG meta tags
//         res.status(200).send({ linkType: 'url', urlDetails : existingEntry, redirectUrl: existingEntry.redirectUrl });
 
//       }
//        else {
//         // Handle other cases if needed
//         res.status(500).send('Invalid linkType');
//       }
//     } else {
//       // IP address does not exist, update the document
//       const entry = await URL.findOneAndUpdate(
//         { shortId },
//         {
//           $push: {
//             uniqueVisitors: {
//               timestamp: Date.now(),
//               country: ipApiResponse.data.country_name,
//               region: ipApiResponse.data.region,
//               city: ipApiResponse.data.city,
//               postal: ipApiResponse.data.postal,
//               ipAddress: ipAddress,
//               deviceType: deviceType,
//               browser: browser,
//               referrer: referrer,
//             },
//           },
//         },
//         { new: true } // Return the updated document
//       );

//       if (entry && entry.linkType === 'pdf' && entry.passwordProtected === true) {
//         // Handle PDF case: Show the PDF to the user
//         res.setHeader('Content-Type', 'application/pdf');
//         res.status(200).send({
//           linkType: 'pdf',
//           pdfData: entry.pdfFile,
//           passwordProtected: true // Include the PDF data here
//         });
//       }
      
//       else if (entry && entry.linkType === 'pdf' && entry.passwordProtected === false) {
//         // Handle PDF case: Show the PDF to the user
//         res.setHeader('Content-Type', 'application/pdf');
//         res.status(200).send({
//           linkType: 'pdf',
//           pdfData: entry.pdfFile,
//           passwordProtected: false // Include the PDF data here
//         });
//       }


//       else if (entry.linkType === 'url' && entry.hasSocialSharing) {
//         // Handle URL case: Send HTML response with OG meta tags
//         const htmlResponse = getHtmlResponse(entry.socialTitle, entry.socialDescription, entry.socialImage, entry.redirectUrl);
//         res.status(200).send({ linkType: 'url', data: htmlResponse, urlDetails : entry, redirectUrl: entry.redirectUrl });
 
//       }
//       else if (entry.linkType === 'url' && !entry.hasSocialSharing) {
//         // Handle URL case: Send HTML response with OG meta tags
//         res.status(200).send({ linkType: 'url',  urlDetails : entry, redirectUrl: entry.redirectUrl });
 
//       } else {
//         // Handle other cases if needed
//         res.status(500).send('Invalid linkType');
//       }
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// function getHtmlResponse(linTitle, desccc, imageUrl, redirectUrl) {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <!-- Open Graph Protocol (OGP) Tags -->
//         <meta property="og:title" content="${linTitle || 'Default Title'}" />
//         <meta property="og:description" content="${desccc || 'Default Description'}" />
//         <meta property="og:image" content="${imageUrl || 'Default Image URL'}" />
//         <meta property="og:url" content="${redirectUrl}" />
//         <title>Redirecting...</title>
//       </head>
//       <body>
//         <!-- Your body content goes here -->
//         <!-- Google tag (gtag.js) -->
//         <script async src="https://www.googletagmanager.com/gtag/js?id=G-D0SY7XGY0L"></script>
//         <script>
//           window.dataLayer = window.dataLayer || [];
//           function gtag(){dataLayer.push(arguments);}
//           gtag('js', new Date());
        
//           gtag('config', 'G-D0SY7XGY0L');
//         </script>
//       </body>
//     </html>
//   `;
// }





// function determineSourceFromReferer(referer) {
//     // Implement your logic to extract source from the referer URL
//     // For example, you might check if the referer contains 'instagram', 'linkedin', etc.
//     if (referer.includes('localhost')) {
//       return 'localhost';
//     } else if (referer.includes('linkedin')) {
//       return 'linkedin';
//     } else {
//       // Default source if not recognized
//       return 'unknown';
//     }
//   }





//create server
const server = app.listen(8001, () => {
  console.log('Server is running on 8001');
});





