async function setupCustomMailFrom(subdomain) {

  try {

    const customMailFromDomain = 'bounces.'+subdomain;
    // Step 1: Set the MAIL FROM domain
    const mailFromCommand = new SetIdentityMailFromDomainCommand({
      Identity: subdomain,
      MailFromDomain: customMailFromDomain,
      BehaviorOnMXFailure: "UseDefaultValue",
    });

    const mailFromResponse = await sesClient.send(mailFromCommand);
    // Step 2: Generate DNS records for MAIL FROM domain
    const mxRecordName = `${customMailFromDomain}`;
    const mxRecordValue = "10 feedback-smtp.us-east-1.amazonses.com";

    const txtRecordName = `${customMailFromDomain}`;
    const txtRecordValue = "v=spf1 include:amazonses.com -all";

 

    return {
      mailFromDomain: customMailFromDomain,
      mxRecordName,
      mxRecordValue,
      txtRecordName,
      txtRecordValue,
    };
  } catch (error) {
    console.error("Error configuring custom MAIL FROM domain:", error);
    throw error;
  }
}

async function generateDNSRecords(subdomain) {

  // const domain = subdomain.split('.').slice(-2).join('.');
  let txtName = '';
  let txtValue = '';
  let spfTxtName = '';
  let spfTxtValue = '';
  let Cname1Name = '';
  let Cname1Value = '';
  let Cname2Name = '';
  let Cname2Value = '';
  let Cname3Name = '';
  let Cname3Value = '';

  try {
    // Step 1: Initiate domain verification
    const domainVerification = await sesClient.send(
      new VerifyDomainIdentityCommand({ Domain: subdomain })
    );

    // Assign TXT record values for domain verification
    txtName = `_amazonses.${subdomain}`;
    txtValue = domainVerification.VerificationToken;

    // Step 2: Generate DKIM records
    const dkimVerification = await sesClient.send(
      new VerifyDomainDkimCommand({ Domain: subdomain })
    );

    // Dynamically assign CNAME record values based on tokens
    dkimVerification.DkimTokens.forEach((token, index) => {
      if (index === 0) {
        Cname1Name = `${token}._domainkey.${subdomain}`;
        Cname1Value = `${token}.dkim.amazonses.com`;
      } else if (index === 1) {
        Cname2Name = `${token}._domainkey.${subdomain}`;
        Cname2Value = `${token}.dkim.amazonses.com`;
      } else if (index === 2) {
        Cname3Name = `${token}._domainkey.${subdomain}`;
        Cname3Value = `${token}.dkim.amazonses.com`;
      }
    });

    // Step 3: Generate SPF TXT record for the domain
    spfTxtName = `${subdomain}`; // Root domain for SPF record
    spfTxtValue = `v=spf1 include:amazonses.com -all`;

    // Return the formatted result as an object
    return {
      txtName: txtName,
      txtValue: txtValue,
      spfTxtName: spfTxtName,
      spfTxtValue: spfTxtValue,
      Cname1Name: Cname1Name,
      Cname1Value: Cname1Value,
      Cname2Name: Cname2Name,
      Cname2Value: Cname2Value,
      Cname3Name: Cname3Name,
      Cname3Value: Cname3Value,
    };
  } catch (error) {
    console.error("Error generating DNS records:", error);
    throw error; // Propagate the error
  }
}

async function checkMailFromTxtRecordStatus(subdomain) {
    const mailFromDomain = `bounces.${subdomain}`;
    let mailFromRecordStatus = { spf: false, mx: false };
  
    try {
      // Check TXT record for SPF
      const txtRecords = await dns.resolveTxt(mailFromDomain);
      const spfRecord = txtRecords.find((record) =>
        record.join("").includes("v=spf1 include:amazonses.com")
      );
  
      if (spfRecord) {
        console.log(`SPF TXT record found for ${mailFromDomain}`);
        mailFromRecordStatus.spf = true;
      } else {
        console.log(`SPF TXT record not found for ${mailFromDomain}`);
      }
  
      // Check MX record
      const mxRecords = await dns.resolveMx(mailFromDomain);
      const mxRecordValid = mxRecords.some((record) =>
        record.exchange.endsWith("amazonses.com")
      );
  
      if (mxRecordValid) {
        console.log(`MX record found and valid for ${mailFromDomain}`);
        mailFromRecordStatus.mx = true;
      } else {
        console.log(`MX record not found or invalid for ${mailFromDomain}`);
      }
    } catch (error) {
      console.error(`Error checking DNS records for ${mailFromDomain}:`, error);
    }
  
    return mailFromRecordStatus;
  }


  
router.post('/check-spf-txt-record-status', async function (req, res){

    const user_id = req.body.user_id;
    const subdomain_id = req.body.subdomain_id;
  
     UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{
  
      if(result){
  
        const fetchedSubdomain  = result[0].subDomain;
        const txtRecordStatus = await checkTxtRecordStatus(fetchedSubdomain);
  
        console.log('txtRecordStatus : ', txtRecordStatus);
  
        if(txtRecordStatus === 'verified'){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { txtRecordStatus: true } }
          );
  
        }
  
        res.status(200).send({ txtRecordStatus});
        res.end();
  
  
      }
  
  
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });
  
  router.post('/check-mailFrom-txt-record-status', async function (req, res){
  
    const user_id = req.body.user_id;
    const subdomain_id = req.body.subdomain_id;
  
     UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{
  
      if(result){
  
        const fetchedSubdomain  = result[0].subDomain;
        const mailFromRecordStatus = await checkMailFromTxtRecordStatus(fetchedSubdomain);
  
        if(mailFromRecordStatus.spf){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { mailFromRecordStatus: true } }
          );
  
        }
  
        if(mailFromRecordStatus.mx){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { mxRecordStatus: true } }
          );
  
        }
  
        res.status(200).send({ mailFromRecordStatus});
        res.end();
  
  
      }
  
  
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });
  
  router.post('/check-spf-record-status', async function (req, res){
  
    const user_id = req.body.user_id;
    const subdomain_id = req.body.subdomain_id;
  
     UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{
  
      if(result){
  
        const fetchedSubdomain  = result[0].subDomain;
        const spfRecordStatus = await checkSpfRecordStatus(fetchedSubdomain);
  
        if(spfRecordStatus === 'verified'){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { spfRecordStatus: true } }
          );
  
        }
  
        res.status(200).send({ spfRecordStatus});
        res.end();
  
  
      }
  
  
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });
  
  router.post('/check-dmarc-record-status', async function (req, res){
  
    const user_id = req.body.user_id;
    const subdomain_id = req.body.subdomain_id;
  
     UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{
  
      if(result){
  
        const fetchedSubdomain  = result[0].subDomain;
        const dmarcRecordStatus = await checkDmarcRecordStatus(fetchedSubdomain);
  
        if(dmarcRecordStatus === 'verified'){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { dmarcRecordStatus: true } }
          );
  
        }
  
  
        res.status(200).send({ dmarcRecordStatus});
        res.end();
  
  
      }
  
  
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });
  
  router.post('/check-cname-record-status', async function (req, res){
  
    const user_id = req.body.user_id;
    const subdomain_id = req.body.subdomain_id;
  
     UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{
  
      if(result){
  
        const fetchedSubdomain  = result[0].subDomain;
        const cnameRecordsStatus = await checkDkimCnameStatus(fetchedSubdomain);
  
        if(cnameRecordsStatus === 'verified'){
  
          await UnverifiedSubdomain.updateOne(
            { user_id: user_id, _id: subdomain_id },
            { $set: { cnameRecordStatus: true } }
          );
  
        }
  
        res.status(200).send({ cnameRecordsStatus});
        res.end();
  
  
      }
  
  
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });

  
router.post('/upload-image-aws-s3', upload.single('socialImage'), async (req, res) => {
    try {
  
      const params = {
      Bucket: 'inboxemailimages',
      Key: `images/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ServerSideEncryption: 'AES256',
  };
  
  
      // Use AWS SDK's streaming Upload
      const uploadToS3 = new Upload({
        client: s3,
        params,
      });
  
      // Wait for upload to complete
      const response = await uploadToS3.done();
      const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
  
      console.log('Image :', s3Url);
  
      // Return the file URL
      res.status(200).json({ success: true, url: s3Url });
      res.end();
    } catch (error) {
      console.error('Error uploading to S3:', error);
      res.status(500).json({ success: false, error: 'File upload failed.' });
      res.end();
  
    }
  });
  
  
   router.post('/get-total-clicks', async function (req, res){
  
    const shortId = req.body.shortId;
  
    URL.findById(shortId).then((result)=>{
  
      if(result){
  
        const totalClicks = result.uniqueVisitors.length + result.repeatVisitors.length;
  
      res.status(200).send({ data: totalClicks});
      res.end();
  
      }
  
      else{
      res.status(200).send({ data: 0 });
      res.end();
  
      }
  
    }).catch(e2=>{
  
      console.log('Error2', e2);
  
    })
  });
  
  router.post('/get-total-unique-clicks', async function (req, res){
  
    const shortId = req.body.shortId;
  
    URL.findById(shortId).then((result)=>{
  
      if(result){
      
      res.status(200).send({ data: result.uniqueVisitors});
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
  
  router.post('/get-total-clicks-for-chart', async function (req, res){
  
    const shortId = req.body.shortId;
  
    URL.findById(shortId).then((result)=>{
  
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
  
  
  router.post('/get-link-details', async function (req, res){
  
    const shortId = req.body.shortId;
  
    const checkTrackingCode = await URL.findById(shortId);
  
    if(checkTrackingCode && checkTrackingCode.tracking_code_id){
  
      URL.findById(shortId).populate('tracking_code_id').then((result)=>{
  
        if(result){
    
        res.status(200).send({ data: result, trackingCode : true});
        res.end();
    
        }
    
        else{
        res.status(200).send({ data: null });
        res.end();
    
        }
    
      }).catch(e2=>{
    
        console.log('Error2', e2);
    
      })
  
    }
  
    else{
  
      URL.findById(shortId).then((result)=>{
  
        console.log('Result:::::', result);
  
        if(result){
    
        res.status(200).send({ data: result, trackingCode : false});
        res.end();
    
        }
    
        else{
        res.status(200).send({ data: null });
        res.end();
    
        }
    
      }).catch(e2=>{
    
        console.log('Error2', e2);
    
      })
        
    }
  
  
  });
  
  router.post('/get-user-tracking-codes', async function (req, res){
  
    const userId = req.body.userId;
  
    TrackingCodes.find({'user_id' : userId}).then((result)=>{
  
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
  
  
  
  router.post('/update-link-details', async function (req, res){
  
    const shortId = req.body.shortId;
    const newRedirectUrl = req.body.newRedirectUrl;
    const newLinkTitle = req.body.newLinkTitle;
    const trackingCodeId = req.body.trackingCodeId;
  
    console.log('Tracking ID::::', trackingCodeId);
  
  
    URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId })
    .then((updatedLink) => {
      if (!updatedLink) {
        return res.status(404).send({ error: 'shortUrl is not found' });
      }
      res.status(200).send({ updated: true });
    })
    .catch((err) => {
      console.error('Error:', err);
      res.status(500).send({
        error: 'Updating Link failed',
        data: null,
        message: 'Oops! Please try again',
      });
    });
    
  });
  
  router.post('/add-tracking-code', async function (req, res) {
  
    const user_id = req.body.userId;
    const tracking_code_name = req.body.tracking_code_name;
    const newCodeScript = req.body.newCodeScript;
  
  
     await TrackingCodes.create({
       user_id : user_id,
       tracking_code_name : tracking_code_name,
       tracking_script : newCodeScript
      
     })
  
     return res.json({ added: true})
   
   });
  
   router.post('/', async (req, res) => {
  
    const shortId = req.body.shortId;
  
    try {
      const ipApiResponse = await axios.get('https://ipapi.co/json/');
      const ipAddress = ipApiResponse.data.ip;
    //   const pixelCode = `
    //   <!-- Your meta ad pixel code goes here -->
    //   <img src="https://example.com/pixel.gif?shortId=${shortId}&ipAddress=${ipAddress}" style="display:none;" />
    // `;
  
      // Check if the IP address already exists in the visit history
      const existingEntry = await URL.findOne({
        shortId,
        'uniqueVisitors.ipAddress': ipAddress,
      });
  
      if (!existingEntry) {
        // IP address does not exist, update the document
        const entry = await URL.findOneAndUpdate(
          { shortId },
          {
            $push: {
              uniqueVisitors: {
                  timestamp: Date.now(),
                  country: ipApiResponse.data.country_name,
                  region: ipApiResponse.data.region,
                  city: ipApiResponse.data.city,
                  postal: ipApiResponse.data.postal,
                  ipAddress: ipAddress,
                },
              },
            },
            { new: true } // Return the updated document
          );
    
          res.redirect(entry.redirectUrl);
        //   res.send(`
        //   <html>
        //     <head>
        //       <title>Redirecting...</title>
        //     </head>
        //     <body>
              
        //       <script>
        //         window.location.href = '${entry.redirectUrl}';
        //       </script>
        //     </body>
        //   </html>
        // `);
  
        } else {
          // IP address already exists, redirect happens but visitHistory will not be updated.
      
          const repeatentry = await URL.findOneAndUpdate(
            { shortId },
            {
              $push: {
                repeatVisitors: {
                    timestamp: Date.now(),
                    country: ipApiResponse.data.country_name,
                    region: ipApiResponse.data.region,
                    city: ipApiResponse.data.city,
                    postal: ipApiResponse.data.postal,
                    ipAddress: ipAddress,
                  },
                },
              },
              { new: true } // Return the updated document
            );
      
            res.redirect(repeatentry.redirectUrl);
  
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    });
  
  
    router.post('/tracking-codes', async (req, res, next) => {
      const user_id = req.body.userId;
    
      const result = await TrackingCodes.find({ user_id: user_id, is_del : false });
    
      result.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
      
        // Compare dates in descending order
        return dateB - dateA;
      });
    
      const tableData = await Promise.all(result.map(async (data, index) => {
    
        return {
          id: index + 1,
          tracking_id: data._id,
          tracking_id_delete: data._id,
          tracking_code_name: data.tracking_code_name,
          tracking_script: data.tracking_script,
          createdDate: data.created_at,
        };
      }));
    
      res.status(200).send({ data: tableData });
    });
  
    router.post('/get-tracking-code-details', async function (req, res){
  
      const trackingCodeId = req.body.trackingCodeId;
    
      TrackingCodes.findById(trackingCodeId).then((result)=>{
    
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
  
    router.post('/update-tracking-code', async function (req, res){
  
      const trackingId = req.body.trackingCodeId;
      const tracking_code_title = req.body.tracking_code_title;
      const tracking_code_script = req.body.tracking_code_script;
    
    
      TrackingCodes.findByIdAndUpdate(trackingId, { tracking_code_name: tracking_code_title, tracking_script : tracking_code_script })
      .then((updatedLink) => {
        if (!updatedLink) {
          return res.status(404).send({ error: 'tracking Code is not found' });
        }
        res.status(200).send({ updated: true });
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).send({
          error: 'Updating Code failed',
          data: null,
          message: 'Oops! Please try again',
        });
      });
      
    });
  
  
    router.post('/delete-tracking-code', async function (req, res){
  
      const trackingId = req.body.trackingCodeId;
    
    
      TrackingCodes.findByIdAndUpdate(trackingId, { is_del: true })
      .then((updatedLink) => {
        if (!updatedLink) {
          return res.status(404).send({ error: 'tracking Code is not found' });
        }
        res.status(200).send({ updated: true });
      })
      .catch((err) => {
        console.error('Error:', err);
        res.status(500).send({
          error: 'Updating Code failed',
          data: null,
          message: 'Oops! Please try again',
        });
      });
      
    });

    
  router.post('/create-link-pdf', upload.single('pdfFile'), async function (req, res) {
      
    const shortId = shortid();
    const userId = req.body.userId;
    const fileType = req.body.fileType;
    const linkTitle = req.body.linkTitle;
    const isPasswordProtected = req.body.isPasswordProtected;
    const pdfPassword = req.body.pdfPassword;
    const pdfFile = req.file;




        const createUrlRecord = async (file, shortId, userId, fileType, linkTitle) => {
          const params = {
              Bucket: 'linckonebucket',
              Key: `pdfs/${Date.now()}_${file.originalname}`,
              Body: file.buffer,
              ContentType: file.mimetype,
              ServerSideEncryption: 'AES256',
          };
      
          try {
              // Upload the file to S3
              const upload = new Upload({
                client: s3,
                params,
            });

            await upload.done();
            
              // Construct and return the S3 URL
              const s3Url = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
      
              // Create a record in the URL model
              const createdRecord = await URL.create({
                  shortId,
                  user_id: userId,
                  pdfFile: s3Url,
                  linkType: fileType,
                  passwordProtected : isPasswordProtected === 'true' ? true : false,
                  password : pdfPassword,
                  linkTitle,
                  uniqueVisitors: [],
                  repeatedVisitors: [],
              });
      
              return createdRecord;
          } catch (error) {
              // Handle errors here if needed
              console.error(`Error uploading PDF file to S3 or creating URL record:`, error);
              throw error; // Re-throw the error to propagate it to the catch block in your route handler
          }
      };

      createUrlRecord(pdfFile, shortId, userId, fileType, linkTitle)
      .then(() => {
          // Record created successfully
          res.status(200).send({ created: true });
      })
      .catch((error) => {
          // Handle any errors that occurred during file upload and record creation
          console.error('Error creating URL record with PDF file:', error);
          res.status(500).json({ error: 'Error creating URL record with PDF file' });
      });
      
});






router.post('/update-link-details-trackingId-social', upload.single('socialImage'), async function (req, res){

const shortId = req.body.shortId;
const newRedirectUrl = req.body.newRedirectUrl;
const newLinkTitle = req.body.newLinkTitle;
const trackingCodeId = req.body.trackingCodeId;
const socialTitle = req.body.socialTitle;
const socialDescription = req.body.socialDescription;
const socialImage = req.file;

if(socialImage){

  const newImageParams = {
    Bucket: 'linckonebucket',
    Key: `images/${Date.now()}_${socialImage.originalname}`,
    Body: socialImage.buffer,
    ContentType: socialImage.mimetype,
    ServerSideEncryption: 'AES256',
  };

  const newImageUpload = new Upload({
    client: s3,
    params: newImageParams,
  });

  await newImageUpload.done();
  const s3Url = `https://${newImageParams.Bucket}.s3.amazonaws.com/${newImageParams.Key}`;

  URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId,
    socialTitle : socialTitle, socialDescription : socialDescription, socialImage : s3Url })
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });


}

else {

  URL.findByIdAndUpdate(shortId, { redirectUrl: newRedirectUrl, linkTitle : newLinkTitle, tracking_code_id : trackingCodeId,
    socialTitle : socialTitle, socialDescription : socialDescription})
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });


}



});

router.post('/update-link-details-with-social', upload.single('socialImage'), async function (req, res){

const shortId = req.body.shortId;
let finalRedirectUrl = req.body.newRedirectUrl.split('?')[0];
const newLinkTitle = req.body.newLinkTitle;
const socialTitle = req.body.socialTitle;
const socialDescription = req.body.socialDescription;
const socialImage = req.file;
const utmSource = req.body.utmSource;
const utmMedium = req.body.utmMedium;
const utmCampaign = req.body.utmCampaign;


if (utmSource) {
  finalRedirectUrl += `?&utm_source=${utmSource}`;

  if (utmMedium) {
    finalRedirectUrl += `&utm_medium=${utmMedium}`;

    if (utmCampaign) {
      finalRedirectUrl += `&utm_campaign=${utmCampaign}`;
    }
  }
}


if(socialImage){

  const newImageParams = {
    Bucket: 'linckonebucket',
    Key: `images/${Date.now()}_${socialImage.originalname}`,
    Body: socialImage.buffer,
    ContentType: socialImage.mimetype,
    ServerSideEncryption: 'AES256',
  };

  const newImageUpload = new Upload({
    client: s3,
    params: newImageParams,
  });

  await newImageUpload.done();
  const s3Url = `https://${newImageParams.Bucket}.s3.amazonaws.com/${newImageParams.Key}`;

  URL.findByIdAndUpdate(shortId, { redirectUrl: finalRedirectUrl, linkTitle : newLinkTitle,
    socialTitle : socialTitle, socialDescription : socialDescription, socialImage : s3Url, utm_source : utmSource, utm_medium : utmMedium, utm_campaign : utmCampaign })
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });


}

else {

  URL.findByIdAndUpdate(shortId, { redirectUrl: finalRedirectUrl, linkTitle : newLinkTitle,
    socialTitle : socialTitle, socialDescription : socialDescription, utm_source : utmSource, utm_medium : utmMedium, utm_campaign : utmCampaign})
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });


}



});


router.post("/check-pdf-password", async function (req, res) {

 const shortId = req.body.shortId;
 const password = req.body.password;
  
  URL.findOne({ shortId : shortId}).then(async (result)=>{

    if(result.password === password){

  res.status(200).send({ matching: true});
  res.end();

    }

    else{

      res.status(200).send({ matching: false});
      res.end();

    }

  }).catch((err) =>{

  })

});

router.post('/update-pdflink-details', async function (req, res){

  const shortId = req.body.shortId;
  const passwordProtected = req.body.passwordProtected;
  const password = req.body.password;
  const newLinkTitle = req.body.newLinkTitle;


  URL.findByIdAndUpdate(shortId, { passwordProtected: passwordProtected, linkTitle : newLinkTitle, password : password })
  .then((updatedLink) => {
    if (!updatedLink) {
      return res.status(404).send({ error: 'shortUrl is not found' });
    }
    res.status(200).send({ updated: true });
  })
  .catch((err) => {
    console.error('Error:', err);
    res.status(500).send({
      error: 'Updating Link failed',
      data: null,
      message: 'Oops! Please try again',
    });
  });
  
});

router.post('/check-dns-records-status', async function (req, res){

  const user_id = req.body.user_id;
  const subdomain_id = req.body.subdomain_id;

   UnverifiedSubdomain.find({'user_id': user_id, '_id' : subdomain_id }).then(async (result)=>{

    if(result){

      const fetchedSubdomain  = result[0].subDomain;
      const txtRecordStatus = await checkTxtRecordStatus(fetchedSubdomain);
      const cnameRecordsStatus = await checkDkimCnameStatus(fetchedSubdomain);
      const dmarcRecordStatus = await checkDmarcRecordStatus(fetchedSubdomain);

      res.status(200).send({ txtRecordStatus, cnameRecordsStatus, dmarcRecordStatus});
      res.end();


    }



  }).catch(e2=>{

    console.log('Error2', e2);

  })
});


async function checkDkimCnameStatus(subdomain) {

  let cnameRecordsStatus = '';

  try {
    const command = new GetIdentityDkimAttributesCommand({ Identities: [subdomain] });
    const response = await sesClient.send(command);

    if (response.DkimAttributes[subdomain]) {
      const { DkimEnabled, DkimVerificationStatus } = response.DkimAttributes[subdomain];
      // console.log(`DKIM enabled: ${DkimEnabled}`);
      // console.log(`DKIM verification status: ${DkimVerificationStatus}`);
      if (DkimVerificationStatus === "Success") {
        // console.log(`DKIM signing is active for ${subdomain}!`);
        cnameRecordsStatus = 'verified';

      } else {
        // console.log(`DKIM signing is not yet verified for ${subdomain}. Wait for DNS propagation.`);
        cnameRecordsStatus = 'pending';

      }
    } else {
      // console.log(`No DKIM attributes found for ${subdomain}.`);
      cnameRecordsStatus = 'No attributes found';

    }

    return cnameRecordsStatus;

  } catch (error) {
    console.error("Error checking DKIM status:", error);
    cnameRecordsStatus = 'Server error. Please try again later';

    return cnameRecordsStatus;
  }
}


async function checkSpfRecordStatus(subdomain) {

  let spfRecordStatus = '';

  try {
    // Resolve the TXT records for the domain
    const txtRecords = await dns.resolveTxt(subdomain);
    // Check if any TXT record contains the SPF policy
    const spfRecord = txtRecords.find(record => record.join('').includes('v=spf1'));

    if (spfRecord) {
      const spfValue = spfRecord.join('');
      // Check if it includes Amazon SES
      if (spfValue.includes('include:amazonses.com')) {
        spfRecordStatus = 'verified';
      } else {
        spfRecordStatus = 'pending';
      }
    } else {
      spfRecordStatus = 'No attributes found';
    }
  } catch (error) {
    // console.error(`Error checking SPF record for ${domain}:`, error);
    spfRecordStatus = 'error';
  }

  return spfRecordStatus;
}


// Step-2: Check whether client saved and verified the records 

async function checkTxtRecordStatus(subdomain) {

  let txtRecordStatus = '';
  try {
    const command = new GetIdentityVerificationAttributesCommand({
      Identities: [subdomain],
    });

    const response = await sesClient.send(command);

    if (response.VerificationAttributes[subdomain]) {
      const status = response.VerificationAttributes[subdomain].VerificationStatus;
      console.log(`Verification status for ${subdomain}: ${status}`);
      if (status === "Success") {
        console.log(`subdomain ${subdomain} is successfully verified!`);
        txtRecordStatus = 'verified';
      } else {
        console.log(`subdomain ${subdomain} is not yet verified. Wait for DNS propagation.`);
        txtRecordStatus = 'pending';

      }
    } else {
      console.log(`No verification attributes found for ${subdomain}.`);
      txtRecordStatus = 'No attributes found';

    }

    return txtRecordStatus;

  } catch (error) {
    console.error("Error checking verification status:", error);
    txtRecordStatus = 'Server error. Please try again later';

    return txtRecordStatus;


  }
}