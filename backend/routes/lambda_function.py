import requests

def lambda_handler(event, context):
    # Check if the 'transcript' key exists in the event
    if 'transcript' not in event:
        return {
            "statusCode": 400,
            "body": "Error: Missing 'transcript' in request payload"
        }

    transcript = event['transcript']
    headers = {"Authorization": f"Bearer YOUR_HUGGINGFACE_API_TOKEN"}
    
    try:
        # Send the request to Hugging Face's API
        response = requests.post(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            headers=headers,
            json={"inputs": transcript}
        )
        
        # Handle potential API errors
        if response.status_code != 200:
            return {
                "statusCode": response.status_code,
                "body": f"Error: {response.json().get('error', 'Unknown error')}"
            }

        # Parse the response JSON
        summary = response.json()

        # Return the summary
        return {
            "statusCode": 200,
            "body": {
                "summary": summary
            }
        }

    except Exception as e:
        # Handle any unexpected errors
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }
