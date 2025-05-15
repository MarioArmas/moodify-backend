var AWS = require('aws-sdk')

exports.getAnalysis = async (req, res) => {
  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.REKOGNITION_ACCESS_KEY,
    secretAccessKey: process.env.REKOGNITION_SECRET_KEY,
  })

  const rekognition = new AWS.Rekognition()

  try {
    const { content } = req.body
    
    if (!content) {
      return res.status(400).json({ message: 'Image missing' })
    }

    const base64Image = content.split(';base64,').pop()
    const imageBuffer = Buffer.from(base64Image, 'base64')
    const params = {
      Image: { Bytes: imageBuffer },
      Attributes: ['ALL'],
    }

    const response = await rekognition.detectFaces(params).promise()
    
    if (response.FaceDetails.length > 0) {
      const emotion = response.FaceDetails[0].Emotions[0]
      res.status(200).json({
        emotion: emotion.Type,
        confidence: emotion.Confidence,
      })
    } else {
      res.status(400).json({ message: 'Nothing clear' })
    }
  } catch (error) {
    console.log('Error! ', error)
    res.status(500).json({
      message: 'Internal rekognition error',
      error: error,
    })
  }
}
